/**
 * NΞØ Smart Factory — TransactionStatus Component
 * 
 * Componente para exibir status de transações blockchain
 */

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ExternalLink, Copy } from 'lucide-react';
import { useState } from 'react';
import { TRANSACTION_STATUS } from '../types/cli';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';
import TransactionErrorFallback from './TransactionErrorFallback';
import { formatAddress, formatHash } from '../utils/addressValidation';

/**
 * TransactionStatus Component
 * 
 * @param {Object} props
 * @param {string} props.status - Status da transação (pending, confirmed, failed, rejected)
 * @param {string} [props.txHash] - Hash da transação
 * @param {string} [props.network] - Rede blockchain (base, polygon, ethereum)
 * @param {string} [props.contractAddress] - Endereço do contrato (quando confirmado)
 * @param {string} [props.error] - Mensagem de erro (se falhou)
 * @param {number} [props.blockNumber] - Número do bloco (quando confirmado)
 * @param {Function} [props.onDismiss] - Callback para fechar o componente
 * @param {string} [props.className] - Classes CSS adicionais
 */
export default function TransactionStatus({
  status,
  txHash = null,
  network = 'base',
  contractAddress = null,
  error = null,
  blockNumber = null,
  onDismiss = null,
  className = '',
}) {
  const [copied, setCopied] = useState(false);

  // Mapear status para cores e ícones
  const statusConfig = {
    [TRANSACTION_STATUS.PENDING]: {
      icon: Loader2,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      message: 'Transaction pending...',
      animate: true,
    },
    [TRANSACTION_STATUS.CONFIRMED]: {
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      message: 'Transaction confirmed!',
      animate: false,
    },
    [TRANSACTION_STATUS.FAILED]: {
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      message: 'Transaction failed',
      animate: false,
    },
    [TRANSACTION_STATUS.REJECTED]: {
      icon: XCircle,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      message: 'Transaction rejected',
      animate: false,
    },
  };

  const config = statusConfig[status] || statusConfig[TRANSACTION_STATUS.PENDING];
  const Icon = config.icon;

  // URLs de exploradores de blockchain
  const explorerUrls = {
    base: 'https://basescan.org',
    polygon: 'https://polygonscan.com',
    ethereum: 'https://etherscan.io',
  };

  const explorerUrl = explorerUrls[network] || explorerUrls.base;
  const txUrl = txHash ? `${explorerUrl}/tx/${txHash}` : null;
  const contractUrl = contractAddress ? `${explorerUrl}/address/${contractAddress}` : null;

  // Copiar para clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ErrorBoundary
      componentName="TransactionStatus"
      level="critical"
      fallback={(error, reset) => (
        <TransactionErrorFallback
          error={error}
          transactionHash={txHash}
          network={network}
          onRetry={reset}
        />
      )}
      onError={(error, errorInfo) => {
        console.error('[TransactionStatus] Error caught by boundary:', error, errorInfo);
      }}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-4 rounded-xl border ${config.bgColor} ${config.borderColor} ${className}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {config.animate ? (
                <LoadingSpinner size="sm" className={config.color} />
              ) : (
                <Icon className={`w-5 h-5 ${config.color}`} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`font-bold mb-1 ${config.color}`}>{config.message}</p>

              {/* Hash da transação */}
              {txHash && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-400 font-mono truncate">
                    {formatHash(txHash)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(txHash)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title="Copy transaction hash"
                  >
                    <Copy className={`w-3 h-3 ${copied ? 'text-green-400' : 'text-gray-400'}`} />
                  </button>
                  {txUrl && (
                    <a
                      href={txUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      title="View on explorer"
                    >
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </a>
                  )}
                </div>
              )}

              {/* Endereço do contrato */}
              {contractAddress && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-300">Contract:</span>
                  <span className="text-xs text-gray-400 font-mono truncate">
                    {formatAddress(contractAddress)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(contractAddress)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title="Copy contract address"
                  >
                    <Copy className={`w-3 h-3 ${copied ? 'text-green-400' : 'text-gray-400'}`} />
                  </button>
                  {contractUrl && (
                    <a
                      href={contractUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      title="View contract on explorer"
                    >
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </a>
                  )}
                </div>
              )}

              {/* Número do bloco */}
              {blockNumber && (
                <p className="text-xs text-gray-400 mb-2">
                  Block: <span className="font-mono">{blockNumber}</span>
                </p>
              )}

              {/* Mensagem de erro */}
              {error && (
                <p className="text-xs text-red-400 mt-2">{error}</p>
              )}

              {/* Botão de fechar */}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="mt-3 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </ErrorBoundary>
  );
}

/**
 * Hook para gerenciar estado de transação
 * 
 * @returns {Object} - { transaction, setTransaction, clearTransaction }
 */
export function useTransactionStatus() {
  const [transaction, setTransaction] = useState(null);

  const clearTransaction = () => {
    setTransaction(null);
  };

  return {
    transaction,
    setTransaction,
    clearTransaction,
  };
}
