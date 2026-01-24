import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Rocket,
  Hexagon,
  LayoutDashboard,
  Wallet,
  AlertTriangle,
  Info
} from 'lucide-react';
import NetworkSelector from './components/NetworkSelector';
import AssetPack from './components/AssetPack';
import LandingSection from './components/LandingSection';
import CustomService from './components/CustomService';
import OpsDashboard from './components/OpsDashboard';
import useFeatures from './hooks/useFeatures';

// Input sanitization
const sanitizeInput = (val) => String(val).replace(/[<>]/g, '');

// Sanitize for display/storage (with trim)
const sanitizeForStorage = (val) => sanitizeInput(val).trim();

// Marketing & Analytics Helpers
const getOrCreateSessionId = () => {
  if (typeof window === 'undefined') return null;
  let sessionId = localStorage.getItem('neosmart_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('neosmart_session_id', sessionId);
  }
  return sessionId;
};

const safeApiCall = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null; // API not available (vite dev mode)
    }
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      return null; // Expected in vite dev
    }
    if (error.message && (error.message.includes('JSON') || error.message.includes('Unexpected token'))) {
      return null; // Expected in vite dev
    }
    console.warn('[MARKETING] API call failed:', error);
    return null;
  }
};

export default function SmartMint() {
  // Feature Flags
  const { isEnabled, currentPhase, phaseInfo } = useFeatures();
  const isWeb3Enabled = isEnabled('phase2', 'web3');
  const isRealTransactionsEnabled = isEnabled('phase2', 'realTransactions');
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    tokenSupply: '',
    network: 'base',
    description: ''
  });

  const [userAddress, setUserAddress] = useState(null);
  const [deployHistory, setDeployHistory] = useState([]);
  // isDemoMode agora é determinado pelos feature flags
  const isDemoMode = !isWeb3Enabled || !isRealTransactionsEnabled;
  const [leadId, setLeadId] = useState(null);
  const [sessionId] = useState(() => getOrCreateSessionId());

  // Fetch History with retry logic
  const fetchDeploys = useCallback(async () => {
    try {
      const res = await fetch('/api/deploys');
      
      // Check if response is actually JSON (not source code)
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Response is not JSON (likely source code in vite dev mode)
        console.info("[PROTOCOL] API routes not available. Use 'vercel dev' for full API support.");
        return;
      }
      
      if (res.ok) {
        try {
          const data = await res.json();
          setDeployHistory(Array.isArray(data) ? data : []);
        } catch (jsonError) {
          // JSON parse error - likely received source code instead
          if (jsonError.message.includes('JSON') || jsonError.message.includes('Unexpected token')) {
            console.info("[PROTOCOL] API routes require 'vercel dev'. Received source code instead of JSON.");
          } else {
            console.warn("[PROTOCOL] Failed to parse response:", jsonError);
          }
        }
      } else {
        // API route not available in vite dev mode
        if (res.status === 404 || res.status === 503) {
          console.warn("[PROTOCOL] API routes require 'vercel dev' for full functionality");
        }
      }
    } catch (error) {
      // Only log if it's not a network/CORS error (expected in vite dev)
      if (error.name !== 'TypeError' && !error.message.includes('Failed to fetch')) {
        console.warn("[PROTOCOL] Failed to sync history sequence:", error);
      } else {
        console.info("[PROTOCOL] API routes not available. Use 'vercel dev' for full API support.");
      }
    }
  }, []);

  useEffect(() => {
    fetchDeploys();
  }, [fetchDeploys]);

  // Marketing: Criar lead na primeira visita
  useEffect(() => {
    if (!sessionId) return;

    const createLead = async () => {
      // Extrair UTM parameters da URL
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');

      const lead = await safeApiCall('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          utm_source: utmSource || null,
          utm_medium: utmMedium || null,
          utm_campaign: utmCampaign || null,
          conversion_status: 'visitor'
        })
      });

      if (lead) {
        setLeadId(lead.id);
        // Registrar evento page_view
        await safeApiCall('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lead_id: lead.id,
            session_id: sessionId,
            event_type: 'page_view',
            event_data: { page: '/' }
          })
        });
      }
    };

    createLead();
  }, [sessionId]);

  // Marketing: Registrar evento quando usuário interage (step 2)
  useEffect(() => {
    if (step === 2 && leadId) {
      // Atualizar lead para 'engaged'
      safeApiCall('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          conversion_status: 'engaged'
        })
      });

      // Registrar evento form_start
      safeApiCall('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: leadId,
          session_id: sessionId,
          event_type: 'form_start'
        })
      });

      // Criar sessão
      safeApiCall('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: leadId,
          session_id: sessionId,
          step_reached: 1
        })
      });
    }
  }, [step, leadId, sessionId]);

  // Wallet Connection (Ready for Ethers.js)
  const connectWallet = async () => {
    setError(null);
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        setLoading(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          const address = accounts[0];
          setUserAddress(address);

          // Marketing: Atualizar lead com wallet_address
          if (sessionId && leadId) {
            await safeApiCall('/api/leads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                session_id: sessionId,
                wallet_address: address,
                conversion_status: 'wallet_connected'
              })
            });

            // Registrar evento wallet_connect
            await safeApiCall('/api/events', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                lead_id: leadId,
                session_id: sessionId,
                event_type: 'wallet_connect',
                event_data: { provider: 'metamask' }
              })
            });
          }
        }
      } catch {
        setError("User alignment rejected connection.");
        // Fallback for demo if no provider or Web3 not enabled
        if (!isWeb3Enabled) {
          console.info("[FEATURES] Web3 not enabled in Phase 1. Using simulation mode.");
        } else {
          console.warn("Wallet extension not detected, using sandbox mode.");
        }
        const demoAddress = '0x' + Math.random().toString(16).slice(2, 42).padEnd(40, '0');
        setUserAddress(demoAddress);
      } finally {
        setLoading(false);
      }
    } else {
      // Demo fallback - No Web3 wallet detected or Web3 not enabled
      if (!isWeb3Enabled) {
        console.info("[FEATURES] Web3 not enabled in Phase 1. Using simulation mode.");
      } else {
        console.warn("No Web3 wallet detected, entering simulation mode.");
      }
      const demoAddress = '0x' + Math.random().toString(16).slice(2, 42).padEnd(40, '0');
      setUserAddress(demoAddress);
    }
  };

  // Cloud State Sync (Drafts + Marketing Session)
  useEffect(() => {
    if (step === 2) {
      const saveData = async () => {
        // Salvar draft (se tiver wallet)
        if (userAddress) {
          try {
            const res = await fetch('/api/drafts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user_address: userAddress,
                token_config: formData,
                lead_id: leadId,
                session_id: sessionId
              })
            });
            
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              return;
            }
            
            if (!res.ok && res.status !== 404) {
              console.warn("[CLOUD] Auto-save failed:", res.status);
            }
          } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
              return;
            }
            if (error.message && (error.message.includes('JSON') || error.message.includes('Unexpected token'))) {
              return;
            }
            console.error("[CLOUD] Auto-save sequence interrupted:", error);
          }
        }

        // Atualizar sessão de marketing (com snapshot do form)
        if (sessionId && leadId) {
          // Calcular step baseado no que foi preenchido
          let currentStep = 1;
          if (formData.tokenName && formData.tokenSymbol) currentStep = 2;
          if (formData.tokenSupply) currentStep = 3;
          if (formData.description) currentStep = 4;

          await safeApiCall('/api/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lead_id: leadId,
              session_id: sessionId,
              step_reached: currentStep,
              form_data_snapshot: formData,
              conversion_funnel: {
                step1_at: formData.tokenName ? new Date().toISOString() : null,
                step2_at: formData.tokenSymbol ? new Date().toISOString() : null,
                step3_at: formData.tokenSupply ? new Date().toISOString() : null,
                step4_at: formData.description ? new Date().toISOString() : null
              }
            })
          });

          // Registrar eventos de progresso
          if (currentStep >= 2) {
            await safeApiCall('/api/events', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                lead_id: leadId,
                session_id: sessionId,
                event_type: `form_step_${currentStep}`,
                event_data: { step: currentStep, fields_filled: Object.keys(formData).filter(k => formData[k]) }
              })
            });
          }
        }
      };

      const timeoutId = setTimeout(saveData, 2000); // 2s debounce for performance
      return () => clearTimeout(timeoutId);
    }
  }, [formData, userAddress, step, sessionId, leadId]);

  // Load Cloud State
  useEffect(() => {
    if (userAddress) {
      const loadDraft = async () => {
        try {
          const res = await fetch(`/api/drafts?address=${userAddress}`);
          
          // Check if response is actually JSON (not source code)
          const contentType = res.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            // Response is not JSON (likely source code in vite dev mode)
            return; // Silently fail - expected in vite dev
          }
          
          if (res.ok) {
            try {
              const draftData = await res.json();
              setFormData(prev => ({ ...prev, ...draftData }));
            } catch (jsonError) {
              // JSON parse error - likely received source code instead
              if (jsonError.message && (jsonError.message.includes('JSON') || jsonError.message.includes('Unexpected token'))) {
                // Expected in vite dev mode, don't log
                return;
              }
              console.warn("[CLOUD] Failed to parse draft data:", jsonError);
            }
          }
        } catch (error) {
          // Silently fail in dev mode (API routes require vercel dev)
          if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            return;
          }
          // Check for JSON parse errors
          if (error.message && (error.message.includes('JSON') || error.message.includes('Unexpected token'))) {
            return;
          }
          console.warn("[CLOUD] State retrieval skipped:", error);
        }
      };
      loadDraft();
    }
  }, [userAddress]);

  // Marketing: Detectar abandono (beforeunload)
  useEffect(() => {
    if (!sessionId || !leadId || step !== 2) return;

    const handleBeforeUnload = () => {
      // Usar sendBeacon para garantir que o request seja enviado mesmo ao fechar
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          session_id: sessionId,
          abandoned_at: new Date().toISOString(),
          step_reached: formData.tokenName ? 2 : 1
        });
        navigator.sendBeacon('/api/sessions', new Blob([data], { type: 'application/json' }));
      }

      // Registrar evento de abandono
      if (navigator.sendBeacon) {
        const eventData = JSON.stringify({
          lead_id: leadId,
          session_id: sessionId,
          event_type: 'form_abandon',
          event_data: { step_reached: formData.tokenName ? 2 : 1 }
        });
        navigator.sendBeacon('/api/events', new Blob([eventData], { type: 'application/json' }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessionId, leadId, step, formData]);

  const [forgeResult, setForgeResult] = useState(null);

  const validateForge = () => {
    if (!formData.tokenName || formData.tokenName.length < 3) return "Token name must be at least 3 chars.";
    if (!formData.tokenSymbol || formData.tokenSymbol.length < 2) return "Token symbol must be at least 2 chars.";
    if (!formData.tokenSupply || Number(formData.tokenSupply) <= 0) return "Genesis supply must be positive.";
    if (!userAddress) return "Wallet connection required for protocol deployment.";
    return null;
  };

  const handleForge = async (e) => {
    e.preventDefault();
    setError(null);

    const vError = validateForge();
    if (vError) {
      setError(vError);
      return;
    }

    setLoading(true);

    try {
      // ⚠️ SIMULATION MODE: This is a mock deployment for demonstration purposes
      // Feature Flag: Real transactions are disabled in Phase 1
      // TODO: Replace with real Web3 contract deployment using ethers.js/wagmi
      // Real implementation should:
      // 1. Deploy actual ERC-20 contract to selected network
      // 2. Wait for transaction confirmation
      // 3. Listen for TokenCreated events from the blockchain
      // 4. Return real contract address and tx hash
      
      // Simulate transaction wait (3 seconds)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate simulated contract address and transaction hash
      const result = {
        ...formData,
        address: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        txHash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        status: 'FORGED'
      };

      // Record deployment in DB
      try {
        const deployRes = await fetch('/api/deploys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contract_address: result.address,
            owner_address: userAddress,
            network: formData.network,
            tx_hash: result.txHash,
            token_name: sanitizeForStorage(formData.tokenName),
            token_symbol: sanitizeForStorage(formData.tokenSymbol).toUpperCase(),
            lead_id: leadId,
            session_id: sessionId
          })
        });

        // Check if response is actually JSON (not source code)
        const contentType = deployRes.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          // Response is not JSON (likely source code in vite dev mode)
          // Silently continue - expected in vite dev
          return;
        }

        if (!deployRes.ok && deployRes.status !== 404) {
          console.warn("[PROTOCOL] Failed to record deployment in database");
        }
      } catch (error) {
        // Don't block deployment if API is unavailable
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          // Expected in vite dev mode
          return;
        }
        // Check for JSON parse errors (source code instead of JSON)
        if (error.message && (error.message.includes('JSON') || error.message.includes('Unexpected token'))) {
          // Expected in vite dev mode
          return;
        }
        console.warn("[PROTOCOL] Database sync error:", error);
      }

      // Marketing: Atualizar lead e sessão para 'token_created'
      if (sessionId && leadId) {
        // Atualizar lead
        await safeApiCall('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            conversion_status: 'token_created'
          })
        });

        // Marcar sessão como completada
        await safeApiCall('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            completed_at: new Date().toISOString(),
            step_reached: 4
          })
        });

        // Registrar evento token_created
        await safeApiCall('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lead_id: leadId,
            session_id: sessionId,
            event_type: 'token_created',
            event_data: {
              contract_address: result.address,
              network: formData.network,
              tx_hash: result.txHash
            }
          })
        });
      }

      setForgeResult(result);
      fetchDeploys(); // Refresh history
    } catch {
      setError("Protocol Forge Failed: Connectivity issues.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen selection:bg-neon-acid selection:text-obsidian">

      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-acid/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-signal-cyan/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <img src="/brand/logo-main.png" alt="NEØ Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(216,242,68,0.4)]" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tighter uppercase">NΞØ <span className="text-neon-acid">SMART FACTORY</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden md:inline">Protocol Status: <span className="text-green-400">Online</span></span>
          <button
            onClick={connectWallet}
            disabled={loading}
            className={`btn-secondary !py-2 !px-4 !text-xs flex items-center gap-2 ${userAddress ? 'border-neon-acid/50 text-neon-acid' : ''}`}
          >
            <Wallet className="w-3 h-3" /> {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        <AnimatePresence mode="wait">
          {/* Phase Status Badges - Design Moderno */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap items-center gap-3"
          >
            {/* Badge: Fase Atual */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass px-4 py-2 rounded-full flex items-center gap-2 border-[#D8F244]/30"
            >
              <div className="w-2 h-2 rounded-full bg-[#D8F244] animate-pulse"></div>
              <span className="text-xs font-bold text-[#D8F244] uppercase tracking-wider">
                {phaseInfo?.name}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {phaseInfo?.status}
              </span>
            </motion.div>

            {/* Badge: Features Disponíveis (contador) */}
            {phaseInfo?.availableFeatures && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass px-3 py-1.5 rounded-full flex items-center gap-2 border-white/10"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs text-gray-300 font-medium">
                  {phaseInfo.availableFeatures.length} Features Ativas
                </span>
              </motion.div>
            )}

            {/* Badge: Próxima Fase (se houver) */}
            {phaseInfo?.lockedFeatures && phaseInfo.lockedFeatures.length > 0 && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass px-3 py-1.5 rounded-full flex items-center gap-2 border-orange-500/20"
              >
                <Rocket className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs text-orange-300 font-medium">
                  Phase 2: {phaseInfo?.estimatedRelease || 'Q1 2026'}
                </span>
              </motion.div>
            )}

            {/* Tooltip/Info Button (opcional - expande para ver detalhes) */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="glass p-1.5 rounded-full border-white/10 hover:border-[#D8F244]/30 transition-colors"
              title="Ver detalhes da fase atual"
            >
              <Info className="w-4 h-4 text-gray-400 hover:text-[#D8F244] transition-colors" />
            </motion.button>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm font-bold"
            >
              <AlertTriangle className="w-4 h-4" /> {error}
            </motion.div>
          )}

          {!forgeResult && step === 1 ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-neon-acid uppercase tracking-widest">
                  <Zap className="w-3 h-3" /> Decentralized Intelligence Factory
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                  Deploy your <span className="text-neon-acid">Token</span> now.
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                  The most efficient Smart Contract Factory. Compile and deploy stable, liquid protocols in seconds with zero upfront fees.
                </p>
                <div className="pt-8">
                  <button 
                    onClick={() => {
                      setStep(2);
                      // Marketing: Registrar evento de clique no CTA
                      if (leadId && sessionId) {
                        safeApiCall('/api/events', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            lead_id: leadId,
                            session_id: sessionId,
                            event_type: 'cta_click',
                            event_data: { cta: 'Open Smart Mint' }
                          })
                        });
                      }
                    }} 
                    className="btn-primary flex items-center gap-3 mx-auto text-lg px-12 relative z-10 group"
                  >
                    Open Smart Mint <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <LandingSection />
            </motion.div>
          ) : !forgeResult && step === 2 ? (
            <motion.div
              key="constructor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              <form onSubmit={handleForge} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass-card space-y-6">
                    <div className="flex items-center gap-2 text-neon-acid mb-2">
                      <Cpu className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Protocol Identification</span>
                    </div>

                    <div>
                      <label className="neo-label">Token Identity</label>
                      <input
                        type="text"
                        required
                        autoComplete="off"
                        className="neo-input w-full"
                        placeholder="Ex: Neo Flow Token"
                        value={formData.tokenName}
                        onChange={e => setFormData({ ...formData, tokenName: sanitizeInput(e.target.value) })}
                      />
                    </div>

                    <div>
                      <label className="neo-label">Neural Symbol</label>
                      <input
                        type="text"
                        required
                        autoComplete="off"
                        className="neo-input w-full uppercase"
                        placeholder="Ex: FLOW"
                        maxLength={6}
                        value={formData.tokenSymbol}
                        onChange={e => setFormData({ ...formData, tokenSymbol: sanitizeInput(e.target.value).toUpperCase() })}
                      />
                    </div>

                    <div>
                      <label className="neo-label">Genesis Supply</label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="neo-input w-full"
                        placeholder="Ex: 1000000"
                        value={formData.tokenSupply}
                        onChange={e => setFormData({ ...formData, tokenSupply: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="glass-card space-y-6">
                    <div className="flex items-center gap-2 text-signal-cyan mb-2">
                      <Layers className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Smart Mint Config</span>
                    </div>

                    <div>
                      <label className="neo-label">Mission Narrative</label>
                      <textarea
                        className="neo-input w-full min-h-[140px] resize-none"
                        placeholder="Describe the neural impact and utility of this asset..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Integrated Logic</span>
                        <ShieldCheck className="w-3 h-3 text-green-400" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Anti-Whale', 'Auto-Burn', 'Liquid-Lock', 'Vesting'].map(tag => (
                          <span key={tag} className="text-[9px] bg-white/5 px-2 py-1 rounded border border-white/5 text-slate-400 font-mono tracking-tighter uppercase">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card">
                  <NetworkSelector
                    selected={formData.network}
                    onSelect={id => setFormData({ ...formData, network: id })}
                  />
                </div>

                <div className="flex flex-col items-center gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full md:w-[400px] flex items-center justify-center gap-3 text-lg"
                  >
                    {loading ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                          <Rocket className="w-5 h-5" />
                        </motion.div>
                        Forging Sequence...
                      </>
                    ) : (
                      <>
                        Deploy Protocol <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <div className="mt-4 p-4 bg-neon-acid/5 border border-neon-acid/20 rounded-xl text-center">
                    <p className="text-xs text-neon-acid font-bold uppercase tracking-wider">Zero Upfront Fee Policy</p>
                    <p className="text-[10px] text-slate-400 mt-1">A 5% protocol fee is embedded. Only network GAS is required for genesis.</p>
                  </div>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="glass-card p-10 text-center space-y-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-energy opacity-10 blur-3xl pointer-events-none group-hover:opacity-20 transition-opacity" />
                <div className="w-20 h-20 bg-neon-acid rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(216,242,68,0.4)]">
                  <ShieldCheck className="w-10 h-10 text-obsidian" />
                </div>
                <div className="space-y-2">
                  <span className="text-neon-acid font-mono text-[10px] tracking-[0.3em] font-bold">GENESIS SUCCESSFUL</span>
                  <h2 className="text-4xl font-bold">{formData.tokenName} is Forged!</h2>
                  <p className="text-slate-400 font-mono text-xs break-all border border-white/10 bg-black/40 p-2 rounded max-w-sm mx-auto">{forgeResult?.address}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <button className="bg-white/5 px-6 py-2 rounded-lg border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-all text-xs font-bold uppercase">
                    <LayoutDashboard className="w-4 h-4 text-slate-400" /> Explorer
                  </button>
                  <button className="bg-neon-acid/10 px-6 py-2 rounded-lg border border-neon-acid/20 flex items-center gap-2 hover:bg-neon-acid/20 transition-all text-xs font-bold uppercase text-neon-acid">
                    <Rocket className="w-4 h-4" /> Activate Bridge
                  </button>
                </div>
              </div>

              <AssetPack />
              <CustomService />

              <div className="flex justify-center border-t border-white/5 pt-10">
                <button
                  onClick={() => { setForgeResult(null); setStep(1); }}
                  className="text-xs text-slate-500 hover:text-neon-acid transition-colors flex items-center gap-2 uppercase tracking-widest font-bold"
                >
                  <ArrowRight className="w-3 h-3 rotate-180" /> Start New Sequence
                </button>
              </div>

              <div className="mt-20">
                <OpsDashboard />
              </div>

              <div className="mt-20 space-y-6">
                <div className="flex items-center gap-2 text-neon-acid">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">Live Protocol Feed</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deployHistory.length > 0 ? deployHistory.map((deploy) => (
                    <div key={deploy.id} className="glass-card !p-4 flex items-center justify-between border-white/5 hover:border-neon-acid/20 transition-all group">
                      <div>
                        <p className="text-xs font-bold text-white uppercase">{deploy.token_name || 'Protocol Unknown'}</p>
                        <p className="text-[10px] text-slate-500 font-mono tracking-tighter">{deploy.contract_address.slice(0, 10)}...{deploy.contract_address.slice(-8)}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] bg-neon-acid/10 text-neon-acid px-2 py-0.5 rounded-full border border-neon-acid/20 uppercase font-bold tracking-tighter">
                          {deploy.network}
                        </span>
                        <p className="text-[8px] text-slate-600 mt-1 uppercase font-bold group-hover:text-neon-acid/60 transition-colors">Verified Node</p>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                      <p className="text-[10px] text-slate-600 uppercase font-bold tracking-[0.3em]">Awaiting Uplink Sequences...</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/5 py-12 px-6 bg-black/20">
        <div className="container mx-auto max-w-4xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 opacity-50">
              <Hexagon className="w-4 h-4 text-neon-acid" />
              <span className="text-[10px] font-bold tracking-widest uppercase">NEØ PROTOCOL — EST. 2025</span>
            </div>
            <div className="flex gap-10">
              <a
                href="https://github.com/neo-smart-token-factory"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase font-bold text-slate-500 hover:text-neon-acid transition-colors tracking-widest"
              >
                Organization
              </a>
              <a
                href="https://github.com/neo-smart-token-factory/smart-ui/blob/main/docs/ARCHITECTURAL_ADDENDUMS.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase font-bold text-slate-500 hover:text-neon-acid transition-colors tracking-widest"
              >
                Governance
              </a>
              <a
                href="https://github.com/neo-smart-token-factory/smart-ui/blob/main/docs/adr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase font-bold text-slate-500 hover:text-neon-acid transition-colors tracking-widest"
              >
                Technical ADRs
              </a>
              <a
                href="https://github.com/neo-smart-token-factory/smart-ui/blob/main/docs/PROJECT_OVERVIEW.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase font-bold text-slate-500 hover:text-neon-acid transition-colors tracking-widest"
              >
                Documentation
              </a>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 text-center">
            <p className="text-[9px] text-slate-600 uppercase tracking-wider font-mono">
              Open Source Infrastructure · Institutional Responsibility · Active Governance
            </p>
            <p className="text-[8px] text-slate-700 mt-2 max-w-2xl mx-auto">
              Built with deliberate security architecture. All decisions documented in ADRs.
              Governed by <a href="https://github.com/neo-smart-token-factory" target="_blank" rel="noopener noreferrer" className="text-neon-acid/60 hover:text-neon-acid transition-colors">neo-smart-token-factory</a> organization.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

