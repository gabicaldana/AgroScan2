"""Ponto de entrada da funcao Python da Vercel.

Fica na RAIZ do repositorio, e nao dentro de backend/, porque a Vercel monta o
Root Directory do projeto como raiz do build: de dentro de uma subpasta, esta
funcao nao enxergaria app/, data/ nem migracoes/. Com a API na raiz, o projeto
Python ve tudo, e o projeto do PWA usa Root Directory `web/` e ignora o Python.

A Vercel procura o objeto ASGI chamado `app`.
"""

from app.api.principal import app

__all__ = ["app"]
