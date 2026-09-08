"""Testes do motor de diagnostico (implementacao de referencia).

Sem dependencias externas - roda com:
    python -m unittest discover -s tests -t .
"""

import json
import unittest

from app import fixtures
from app.db import BaseInvalida, carregar_json, validar
from app.diagnostico import (
    detalhar_doenca,
    diagnosticar,
    listar_culturas,
    listar_sintomas_da_cultura,
    melhor_pergunta,
)


def ids(sintomas) -> list[str]:
    return [s.id for s in sintomas]


class TestPontuacao(unittest.TestCase):

    def test_sintoma_classico_traz_doenca_certa_em_primeiro(self):
        """Aneis concentricos + desfolha de baixo = pinta-preta."""
        hip = diagnosticar("tomate", {"manchas_escuras_aneis",
                                      "desfolha_baixo_para_cima"})
        self.assertTrue(hip)
        self.assertEqual(hip[0].doenca_id, "tomate_pinta_preta")
        self.assertGreater(hip[0].compatibilidade, 0.6)

    def test_separa_requeima_de_pinta_preta(self):
        """Mofo branco na face inferior e o sinal que distingue a requeima."""
        hip = diagnosticar("tomate", {"manchas_encharcadas",
                                      "mofo_branco_face_inferior"})
        self.assertEqual(hip[0].doenca_id, "tomate_requeima")

    def test_sintoma_inespecifico_nao_da_certeza(self):
        """Manchas amareladas sozinhas aparecem em varias doencas.

        O sistema tem que devolver multiplas hipoteses com pontuacao baixa,
        e nao fingir certeza.
        """
        hip = diagnosticar("tomate", {"manchas_amareladas"})
        self.assertGreater(len(hip), 1)
        self.assertLess(hip[0].compatibilidade, 0.5)

    def test_sintomas_sobrando_derrubam_a_pontuacao(self):
        """Marcar sintomas que a doenca nao explica deve penalizar."""
        so_o_classico = diagnosticar("tomate", {"manchas_escuras_aneis"})[0]
        com_ruido = next(
            h for h in diagnosticar(
                "tomate", {"manchas_escuras_aneis", "po_branco_superficie"})
            if h.doenca_id == "tomate_pinta_preta"
        )
        self.assertLess(com_ruido.compatibilidade, so_o_classico.compatibilidade)
        self.assertIn("po_branco_superficie", ids(com_ruido.sintomas_nao_explicados))

    def test_perfil_inteiro_marcado_da_compatibilidade_total(self):
        """Sem faltantes e sem ruido, o indice tem que fechar em 1."""
        hip = diagnosticar("pimentao", {"manchas_angulares_halo_amarelo",
                                        "manchas_salientes_fruto",
                                        "manchas_encharcadas",
                                        "queda_precoce_folhas",
                                        "manchas_amareladas"})
        self.assertEqual(hip[0].doenca_id, "pimentao_mancha_bacteriana")
        self.assertEqual(hip[0].compatibilidade, 1.0)

    def test_sem_sintomas_nao_devolve_nada(self):
        self.assertEqual(diagnosticar("tomate", set()), [])

    def test_sintoma_desconhecido_e_ignorado_e_nao_vira_ruido(self):
        """Um id fora do catalogo (bundle antigo em cache) nao pode penalizar.

        Se virasse ruido, um unico id obsoleto derrubaria todas as hipoteses
        por igual e estragaria o diagnostico inteiro.
        """
        com_lixo = diagnosticar("tomate", {"manchas_escuras_aneis", "xyz_nao_existe"})
        limpo = diagnosticar("tomate", {"manchas_escuras_aneis"})
        self.assertEqual([h.doenca_id for h in com_lixo],
                         [h.doenca_id for h in limpo])
        self.assertEqual(com_lixo[0].compatibilidade, limpo[0].compatibilidade)

    def test_so_sintoma_desconhecido_nao_devolve_nada(self):
        self.assertEqual(diagnosticar("tomate", {"xyz_nao_existe"}), [])


class TestOrdenacaoDeterministica(unittest.TestCase):
    """A saida precisa ser reproduzivel: e o que o porte em TS tem que bater."""

    def test_listas_de_sintomas_vem_do_maior_peso_para_o_menor(self):
        hip = diagnosticar("tomate", {"manchas_escuras_aneis"})[0]
        pesos = [s.peso for s in hip.sintomas_esperados_ausentes]
        self.assertEqual(pesos, sorted(pesos, reverse=True))

    def test_empate_de_compatibilidade_sobe_a_doenca_mais_grave(self):
        """Custa mais ignorar a doenca destrutiva do que a branda."""
        hip = diagnosticar("tomate", {"manchas_escuras_aneis", "lesoes_no_caule"})
        empatadas = [h for h in hip
                     if abs(h.compatibilidade - hip[0].compatibilidade) < 1e-9]
        gravidades = [h.gravidade for h in empatadas]
        self.assertEqual(gravidades, sorted(gravidades, reverse=True))

    def test_a_ordem_nao_muda_entre_execucoes(self):
        marcados = {"manchas_amareladas", "desfolha_baixo_para_cima",
                    "lesoes_no_caule"}
        primeira = [(h.doenca_id, h.compatibilidade)
                    for h in diagnosticar("tomate", marcados)]
        segunda = [(h.doenca_id, h.compatibilidade)
                   for h in diagnosticar("tomate", marcados)]
        self.assertEqual(primeira, segunda)


class TestMelhorPergunta(unittest.TestCase):

    def test_prefere_o_sintoma_que_mais_afasta_as_duas_primeiras(self):
        """Pinta-preta x mancha-alvo empatam justamente nos aneis
        concentricos. A pergunta util nao pode ser um sintoma que as duas
        esperam igualmente forte."""
        hip = diagnosticar("tomate", {"manchas_escuras_aneis", "lesoes_no_caule"})
        self.assertEqual(hip[0].doenca_id, "tomate_pinta_preta")
        self.assertEqual(hip[1].doenca_id, "tomate_mancha_alvo")

        pergunta = melhor_pergunta(hip)
        perfil_segunda = {s.id for s in hip[1].sintomas_compativeis} | {
            s.id for s in hip[1].sintomas_esperados_ausentes}
        self.assertNotIn(pergunta.sintoma_id, perfil_segunda)
        self.assertEqual(pergunta.descarta, hip[1].nome)

    def test_com_hipotese_unica_pergunta_o_sintoma_mais_caracteristico(self):
        hip = diagnosticar("tomate", {"pontuacoes_finas_cloroticas", "teia_fina"})
        self.assertEqual(len(hip), 1)
        pergunta = melhor_pergunta(hip)
        self.assertEqual(pergunta.sintoma_id,
                         hip[0].sintomas_esperados_ausentes[0].id)
        self.assertIsNone(pergunta.descarta)

    def test_nao_promete_descartar_quando_a_segunda_tambem_espera(self):
        """Se as duas esperam o sintoma, a resposta confirma mas nao decide -
        e a interface nao pode dizer que decide."""
        hip = diagnosticar("tomate", {"manchas_amareladas",
                                      "mofo_oliva_face_inferior"})
        self.assertEqual(hip[0].doenca_id, "tomate_mofo_de_folha")
        self.assertEqual(hip[1].doenca_id, "tomate_oidio")
        pergunta = melhor_pergunta(hip)
        perfil_segunda = {s.id for s in hip[1].sintomas_compativeis} | {
            s.id for s in hip[1].sintomas_esperados_ausentes}
        self.assertIn(pergunta.sintoma_id, perfil_segunda)
        self.assertIsNone(pergunta.descarta)

    def test_sem_hipoteses_nao_ha_pergunta(self):
        self.assertIsNone(melhor_pergunta([]))


class TestCatalogo(unittest.TestCase):

    def test_sintomas_sao_filtrados_por_cultura(self):
        """A batata nao tem fruto no fluxo, e perguntar de lesao no fruto
        seria pedir ao produtor que procurasse o que nao existe."""
        ids_batata = {s["id"] for s in listar_sintomas_da_cultura("batata")}
        ids_tomate = {s["id"] for s in listar_sintomas_da_cultura("tomate")}
        self.assertIn("manchas_escuras_aneis", ids_batata)
        self.assertNotIn("lesoes_no_fruto", ids_batata)
        self.assertIn("lesoes_no_fruto", ids_tomate)

    def test_sintomas_vem_agrupados_na_ordem_em_que_se_olha_a_planta(self):
        """Folha antes de caule, fruto e planta - nao em ordem alfabetica."""
        orgaos = []
        for s in listar_sintomas_da_cultura("tomate"):
            if s["orgao"] not in orgaos:
                orgaos.append(s["orgao"])
        self.assertEqual(orgaos[0], "folha")
        self.assertEqual(orgaos, ["folha", "caule", "fruto", "planta"])

    def test_toda_cultura_cadastrada_tem_ficha(self):
        """Cultura sem doenca seria um beco sem saida no fluxo por sintomas:
        o produtor a escolhe e nao tem o que marcar."""
        todas = {c["id"] for c in listar_culturas()}
        com_doenca = {c["id"] for c in listar_culturas(apenas_com_doencas=True)}
        self.assertEqual(todas - com_doenca, set())

    def test_cultura_carrega_grupo_e_familia(self):
        """O grupo agrupa o seletor na tela; a familia sustenta o alerta de
        rotacao e explica o reuso do catalogo de sintomas entre culturas."""
        for c in listar_culturas():
            self.assertIn(c["grupo"],
                          {"fruto", "folha", "flor", "haste", "raiz"})
            self.assertTrue(c["familia"])


class TestFicha(unittest.TestCase):

    def test_ficha_completa_tem_todos_os_blocos(self):
        d = detalhar_doenca("batata_requeima")
        self.assertEqual(d["cultura"], "Batata")
        self.assertEqual(d["gravidade"], 5)
        self.assertTrue(d["descricao"])
        self.assertTrue(d["tratamentos"])
        self.assertTrue(d["ingredientes_ativos"])
        self.assertIn("temperatura", d["condicoes_favoraveis"])

    def test_tratamentos_vem_na_ordem_do_manejo_integrado(self):
        """Cultural antes de biologico antes de quimico - nao e cosmetico,
        e a ordem que o MIP recomenda."""
        tipos = [t["tipo"] for t in detalhar_doenca("batata_requeima")["tratamentos"]]
        self.assertEqual(tipos, sorted(
            tipos, key=lambda t: {"cultural": 1, "biologico": 2, "quimico": 3}[t]))

    def test_virose_nao_inventa_ingrediente_ativo(self):
        """Nenhum defensivo age sobre virus de planta. A lista vazia e o
        conteudo correto, e a interface precisa aguentar isso."""
        d = detalhar_doenca("tomate_mosaico")
        self.assertEqual(d["ingredientes_ativos"], [])
        self.assertTrue(d["tratamentos"])

    def test_doenca_inexistente_levanta_erro(self):
        with self.assertRaises(KeyError):
            detalhar_doenca("tomate_doenca_que_nao_existe")


class TestBaseDeConhecimento(unittest.TestCase):

    def setUp(self):
        self.base = carregar_json()

    def test_a_base_versionada_e_valida(self):
        validar(self.base)

    def test_validador_pega_sintoma_com_id_errado(self):
        """Erro de digitacao num id sumiria do perfil em silencio, e a doenca
        passaria a ser diagnosticada errado sem ninguem notar."""
        self.base["culturas"][0]["doencas"][0]["sintomas"][0]["id"] = "nao_existe"
        with self.assertRaises(BaseInvalida):
            validar(self.base)

    def test_validador_pega_doenca_sem_sintoma_classico(self):
        for s in self.base["culturas"][0]["doencas"][0]["sintomas"]:
            s["peso"] = 0.5
        with self.assertRaises(BaseInvalida):
            validar(self.base)


class TestFixturesCompartilhadas(unittest.TestCase):
    """As fixtures sao o contrato com o porte em TypeScript.

    Se o motor ou a base mudarem, este teste quebra e o arquivo tem que ser
    regerado de proposito - o que forca o porte a ser revisado junto. Sem
    isso, as duas implementacoes divergiriam em silencio.
    """

    def test_o_arquivo_versionado_esta_atualizado(self):
        with open(fixtures.CAMINHO_FIXTURES, encoding="utf-8") as f:
            gravado = json.load(f)

        # Passa pelo JSON para normalizar tipos (dataclass -> dict etc.)
        atual = json.loads(json.dumps(fixtures.montar(), ensure_ascii=False))

        self.assertEqual(
            atual, gravado,
            "As fixtures estao desatualizadas. Rode `python -m app.fixtures` "
            "e reveja o porte em web/lib/diagnostico.ts antes de commitar.")

    def test_os_casos_cobrem_todas_as_doencas_da_base(self):
        base = carregar_json()
        todas = {d["id"] for c in base["culturas"] for d in c["doencas"]}
        nos_casos = {
            h["doenca_id"]
            for caso in fixtures.montar()["casos"]
            for h in caso["esperado"]["hipoteses"]
        }
        self.assertEqual(todas - nos_casos, set())


if __name__ == "__main__":
    unittest.main()
