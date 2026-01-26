/**
 * NΞØ Smart Factory — WalletConnect Component
 * 
 * Componente para conexão de wallet usando Dynamic.xyz
 * 
 * @see https://docs.dynamic.xyz/
 */

import { useEffect, useRef } from 'react';
import { Wallet } from 'lucide-react';
import { DynamicContextProvider, DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import useFeatures from '../hooks/useFeatures';

/**
 * Internal component that has access to Dynamic context
 */
function WalletConnectInner({ onConnect, onDisconnect, userAddress, setUserAddress, className }) {
  const { primaryWallet, isAuthenticated } = useDynamicContext();
  const prevAddressRef = useRef(null);

  // Effect to handle wallet connection/disconnection callbacks
  useEffect(() => {
    const walletAddress = primaryWallet?.address || null;
    const isConnected = isAuthenticated && !!primaryWallet;
    const prevAddress = prevAddressRef.current;

    // Update parent component state if provided
    if (setUserAddress && walletAddress !== userAddress) {
      setUserAddress(walletAddress);
    }

    // Handle connection callback (when address changes from null to a value)
    if (isConnected && walletAddress && !prevAddress) {
      if (onConnect) {
        onConnect(walletAddress);
      }
    }

    // Handle disconnection callback (when address changes from a value to null)
    if (!isConnected && prevAddress) {
      if (onDisconnect) {
        onDisconnect();
      }
    }

    // Update ref for next render
    prevAddressRef.current = walletAddress;
  }, [primaryWallet, isAuthenticated, onConnect, onDisconnect, setUserAddress, userAddress]);

  return (
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
  );
}

export default function WalletConnect({
  className = '',
  onConnect = null,
  onDisconnect = null,
  userAddress = null,
  setUserAddress = null,
}) {
  const { isEnabled } = useFeatures();
  const isWeb3Enabled = isEnabled('phase2', 'web3');

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
      <WalletConnectInner
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        userAddress={userAddress}
        setUserAddress={setUserAddress}
        className={className}
      />
    </DynamicContextProvider>
  );
}

/**
 * Hook para usar wallet conectada do Dynamic.xyz
 * 
 * @returns {Object} - { address, isConnected, provider, signer }
 */
export function useDynamicWallet() {
  // Always call the hook - React Hooks must be called unconditionally
  let dynamicContext = null;
  let hookError = null;
  
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    dynamicContext = useDynamicContext();
  } catch (err) {
    // Dynamic context not available (provider not mounted)
    hookError = err;
  }

  // If we couldn't get the context, return default values
  if (hookError || !dynamicContext) {
    return {
      address: null,
      isConnected: false,
      provider: null,
      signer: null,
    };
  }

  const { primaryWallet, isAuthenticated } = dynamicContext;

  return {
    address: primaryWallet?.address || null,
    isConnected: isAuthenticated && !!primaryWallet,
    provider: primaryWallet?.connector?.getPublicClient?.() || null,
    signer: primaryWallet?.connector?.getSigner?.() || null,
  };
}
