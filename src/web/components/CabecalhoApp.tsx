import { BotaoConta } from "./BotaoConta";
import { BotaoVoltar } from "./BotaoVoltar";
import { IndicadorRede } from "./IndicadorRede";

export function CabecalhoApp() {
  return (
    <header className="border-borda bg-fundo sticky top-0 z-10 border-b-2">
      <div className="mx-auto flex h-toque max-w-2xl items-center justify-between px-4">
        <div className="flex items-center gap-1">
          <BotaoVoltar />
          <span className="text-lg font-bold tracking-tight">
            Agro<span className="text-primaria">Scan</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <IndicadorRede />
          <BotaoConta />
        </div>
      </div>
    </header>
  );
}
