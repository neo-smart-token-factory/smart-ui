/**
 * NΞØ Smart Factory — TransactionErrorFallback Component
 * 
 * Fallback UI específico para erros de transação
 */

import { AlertCircle, RefreshCw, ExternalLink, X } from 'lucide-react';

export default function TransactionErrorFallback({ 
  error, 
  transactionHash, 
  onRetry, 
  onDismiss,
  network = 'base'
}) {
  const explorerUrl = transactionHash 
    ? network === 'base' 
      ? `https://basescan.org/tx/${transactionHash}`
      : network === 'polygon'
      ? `https://polygonscan.com/tx/${transactionHash}`
      : `https://etherscan.io/tx/${transactionHash}`
    : null;

  return (
    <div className="transaction-error-fallback glass-card border-red-500/20 bg-black/60 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-red-400">
          Erro na Transação
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
        A transação falhou. Verifique os detalhes abaixo:
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-black/40 rounded border border-red-500/20">
          <p className="text-[10px] text-slate-400 font-mono break-all">
            {error.toString()}
          </p>
        </div>
      )}
      
      {transactionHash && explorerUrl && (
        <div className="mb-4">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neon-acid hover:underline flex items-center gap-2"
          >
            Ver transação no explorer
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
      
      <div className="flex gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-neon-acid text-black text-xs font-bold rounded hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <RefreshCw className="w-3 h-3" />
            Tentar Novamente
          </button>
        )}
      </div>
    </div>
  );
}
