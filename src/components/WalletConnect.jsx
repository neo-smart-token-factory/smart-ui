/**
 * NΞØ Smart Factory — WalletConnect Component
 * 
 * Componente para conexão de wallet usando Dynamic.xyz
 * 
 * @see https://docs.dynamic.xyz/
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { EthersExtension } from '@dynamic-labs/ethers-v6';
import useFeatures from '../hooks/useFeatures';

/**
 * WalletConnect Component
 * 
 * @param {Object} props
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {Function} [props.onConnect] - Callback quando wallet conecta
 * @param {Function} [props.onDisconnect] - Callback quando wallet desconecta
 * @param {string} [props.userAddress] - Endereço da wallet conectada (controlado)
 * @param {Function} [props.setUserAddress] - Setter para endereço (controlado)
 */
export default function WalletConnect({
  className = '',
  onConnect = null,
  onDisconnect = null,
  userAddress = null,
  setUserAddress = null,
}) {
  const { isEnabled } = useFeatures();
  const isWeb3Enabled = isEnabled('phase2', 'web3');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Dynamic.xyz Environment ID
  const dynamicEnvironmentId = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID || 
                                import.meta.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID;

  // Se Web3 não está habilitado, mostrar modo simulação
  if (!isWeb3Enabled) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          disabled
          className="btn-secondary !py-2 !px-4 !text-xs flex items-center gap-2 opacity-50 cursor-not-allowed"
          title="Web3 features will be available in Phase 2"
        >
          <Wallet className="w-3 h-3" />
          <span>Web3 (Phase 2)</span>
        </button>
      </div>
    );
  }

  // Se não tem Dynamic Environment ID configurado
  if (!dynamicEnvironmentId) {
    console.warn('[WalletConnect] Dynamic.xyz Environment ID not configured');
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          disabled
          className="btn-secondary !py-2 !px-4 !text-xs flex items-center gap-2 opacity-50 cursor-not-allowed"
          title="Dynamic.xyz not configured"
        >
          <Wallet className="w-3 h-3" />
          <span>Wallet (Not Configured)</span>
        </button>
      </div>
    );
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId: dynamicEnvironmentId,
        walletConnectors: ['metamask', 'walletconnect', 'coinbase'],
        appName: 'NΞØ Smart Factory',
        appLogoUrl: '/brand/logo-main.png',
        overrides: {
          evmNetworks: [
            {
              chainId: 8453, // Base Mainnet
              name: 'Base',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: {
                default: {
                  http: ['https://mainnet.base.org'],
                },
              },
            },
            {
              chainId: 137, // Polygon Mainnet
              name: 'Polygon',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              rpcUrls: {
                default: {
                  http: ['https://polygon-rpc.com'],
                },
              },
            },
          ],
        },
      }}
    >
      <div className={`flex items-center gap-2 ${className}`}>
        <DynamicWidget
          variant="modal"
          buttonClassName="btn-secondary !py-2 !px-4 !text-xs flex items-center gap-2"
          innerButtonComponent={
            <div className="flex items-center gap-2">
              <Wallet className="w-3 h-3" />
              <span>
                {userAddress
                  ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
                  : 'Connect Wallet'}
              </span>
            </div>
          }
        />
      </div>
    </DynamicContextProvider>
  );
}

/**
 * Hook para usar wallet conectada do Dynamic.xyz
 * 
 * @returns {Object} - { address, isConnected, provider, signer }
 */
export function useDynamicWallet() {
  const { useDynamicContext } = require('@dynamic-labs/sdk-react-core');
  const { primaryWallet, isAuthenticated } = useDynamicContext();

  return {
    address: primaryWallet?.address || null,
    isConnected: isAuthenticated && !!primaryWallet,
    provider: primaryWallet?.connector?.getPublicClient?.() || null,
    signer: primaryWallet?.connector?.getSigner?.() || null,
  };
}

// Export default já está no início do arquivo
