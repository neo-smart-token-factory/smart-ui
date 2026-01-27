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
import ErrorBoundary from './ErrorBoundary';
import WalletErrorFallback from './WalletErrorFallback';
import LoadingSpinner from './ui/LoadingSpinner';
import { validateAddress, formatAddress } from '../utils/addressValidation';

/**
 * Internal component that has access to Dynamic context
 */
function WalletConnectInner({ onConnect, onDisconnect, userAddress, setUserAddress, className }) {
  const { primaryWallet, isAuthenticated, sdkHasLoaded } = useDynamicContext();
  const prevAddressRef = useRef(null);

  // Effect to handle wallet connection/disconnection callbacks
  useEffect(() => {
    const walletAddress = primaryWallet?.address || null;
    const isConnected = isAuthenticated && !!primaryWallet;
    const prevAddress = prevAddressRef.current;

    const validation = validateAddress(walletAddress);
    const effectiveAddress = validation.valid ? validation.normalized : null;

    // Update parent component state if provided
    if (setUserAddress && effectiveAddress !== userAddress) {
      setUserAddress(effectiveAddress);
    }

    // Handle connection callback (when address changes from null to a value)
    if (isConnected && effectiveAddress && !prevAddress) {
      if (onConnect) {
        onConnect(effectiveAddress);
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
          <div className="flex items-center gap-2 min-w-[120px] justify-center">
            {!sdkHasLoaded ? (
              <>
                <LoadingSpinner size="sm" className="!w-3 !h-3" />
                <span>Initializing...</span>
              </>
            ) : !isAuthenticated && primaryWallet ? (
              <>
                <LoadingSpinner size="sm" className="!w-3 !h-3" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Wallet className="w-3 h-3" />
                <span>
                  {userAddress
                    ? formatAddress(userAddress)
                    : 'Connect Wallet'}
                </span>
              </>
            )}
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
    <ErrorBoundary
      componentName="WalletConnect"
      level="critical"
      fallback={(error, reset) => (
        <WalletErrorFallback
          error={error}
          onRetry={reset}
          onUseSimulation={() => {
            // Fallback para simulation mode se disponível
            console.info('[WalletConnect] Using simulation mode fallback');
          }}
        />
      )}
      onError={(error, errorInfo) => {
        console.error('[WalletConnect] Error caught by boundary:', error, errorInfo);
      }}
    >
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
    </ErrorBoundary>
  );
}

/**
 * Hook para usar wallet conectada do Dynamic.xyz
 * 
 * NOTE: This hook uses a try-catch pattern which technically violates React's
 * rules of hooks. This is a pragmatic solution for Phase 01 where Web3 is disabled.
 * 
 * TODO Phase 02: Refactor to one of these patterns:
 * 1. Wrap entire App in DynamicContextProvider (recommended)
 * 2. Create a higher-order component
 * 3. Use React Context for optional provider pattern
 * 
 * @returns {Object} - { address, isConnected, provider, signer }
 */
export function useDynamicWallet() {
  // Try to get the context, but handle the case where we're not inside a provider
  // This violates React Hooks rules but is acceptable for Phase 01 as a temporary solution
  let context = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    context = useDynamicContext();
  } catch {
    // Expected when called outside DynamicContextProvider (Phase 01 - Web3 disabled)
    // Return safe defaults
    return {
      address: null,
      isConnected: false,
      provider: null,
      signer: null,
    };
  }

  // If context is null or undefined, return defaults
  if (!context) {
    return {
      address: null,
      isConnected: false,
      provider: null,
      signer: null,
    };
  }

  const { primaryWallet, isAuthenticated } = context;

  return {
    address: primaryWallet?.address || null,
    isConnected: isAuthenticated && !!primaryWallet,
    provider: primaryWallet?.connector?.getPublicClient?.() || null,
    signer: primaryWallet?.connector?.getSigner?.() || null,
  };
}
