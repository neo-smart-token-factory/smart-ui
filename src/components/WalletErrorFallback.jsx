/**
 * NΞØ Smart Factory — WalletErrorFallback Component
 * 
 * Fallback UI específico para erros de conexão de wallet
 */

import { Wallet, AlertTriangle, RefreshCw, Info } from 'lucide-react';

export default function WalletErrorFallback({ error, onRetry, onUseSimulation, onDismiss }) {
  return (
    <div className="wallet-error-fallback glass-card border-orange-500/20 bg-black/60 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <Wallet className="w-5 h-5 text-orange-400 flex-shrink-0" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-orange-400">
          Erro na Conexão da Carteira
        </h3>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-auto text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Não foi possível conectar sua carteira. Isso pode acontecer se:
      </p>
      
      <ul className="text-xs text-slate-500 mb-4 space-y-1.5 list-disc list-inside">
        <li>A extensão da carteira não está instalada</li>
        <li>A conexão foi rejeitada</li>
        <li>Há um problema com a rede</li>
        <li>A carteira está bloqueada ou travada</li>
      </ul>
      
      {error && (
        <div className="mb-4 p-3 bg-black/40 rounded border border-orange-500/20">
          <div className="flex items-start gap-2">
            <Info className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-slate-400 font-mono break-all">
              {error.toString()}
            </p>
          </div>
        </div>
      )}
      
      <div className="flex gap-2 flex-wrap">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-neon-acid text-black text-xs font-bold rounded hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <RefreshCw className="w-3 h-3" />
            Tentar Novamente
          </button>
        )}
        
        {onUseSimulation && (
          <button
            onClick={onUseSimulation}
            className="px-4 py-2 bg-slate-700 text-white text-xs font-bold rounded hover:opacity-90 transition-opacity"
          >
            Usar Modo Simulação
          </button>
        )}
      </div>
    </div>
  );
}
