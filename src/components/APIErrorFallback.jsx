/**
 * NΞØ Smart Factory — APIErrorFallback Component
 * 
 * Fallback UI específico para erros de API
 */

import { AlertCircle, RefreshCw, Code, X } from 'lucide-react';

export default function APIErrorFallback({ 
  error, 
  endpoint, 
  onRetry, 
  onDismiss,
  showDevInstructions = false
}) {
  return (
    <div className="api-error-fallback glass-card border-yellow-500/20 bg-black/60 p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          API Indisponível
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
        Não foi possível conectar com a API. {endpoint && `Endpoint: ${endpoint}`}
      </p>
      
      {showDevInstructions && (
        <div className="mb-4 p-3 bg-black/40 rounded border border-yellow-500/20">
          <div className="flex items-start gap-2 mb-2">
            <Code className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 mb-1 font-bold">Para desenvolvimento local:</p>
              <code className="text-[10px] text-neon-acid block">
                vercel dev
              </code>
            </div>
          </div>
          <p className="text-[10px] text-slate-500">
            As rotas de API são Vercel Serverless Functions e requerem o Vercel Dev para funcionar localmente.
          </p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-black/40 rounded border border-yellow-500/20">
          <p className="text-[10px] text-slate-400 font-mono break-all">
            {error.toString()}
          </p>
        </div>
      )}
      
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
  );
}
