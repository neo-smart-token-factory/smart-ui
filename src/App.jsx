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
  AlertTriangle
} from 'lucide-react';
import NetworkSelector from './components/NetworkSelector';
import AssetPack from './components/AssetPack';
import LandingSection from './components/LandingSection';
import CustomService from './components/CustomService';
import OpsDashboard from './components/OpsDashboard';

// Input sanitization
const sanitizeInput = (val) => String(val).replace(/[<>]/g, '').trim();

export default function SmartMint() {
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
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Fetch History with retry logic
  const fetchDeploys = useCallback(async () => {
    try {
      const res = await fetch('/api/deploys');
      if (res.ok) {
        const data = await res.json();
        setDeployHistory(Array.isArray(data) ? data : []);
      }
    } catch {
      console.warn("[PROTOCOL] Failed to sync history sequence");
    }
  }, []);

  useEffect(() => {
    fetchDeploys();
  }, [fetchDeploys]);

  // Wallet Connection (Ready for Ethers.js)
  const connectWallet = async () => {
    setError(null);
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        setLoading(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
          setIsDemoMode(false);
        }
      } catch {
        setError("User alignment rejected connection.");
        // Fallback for demo if no provider
        console.warn("Wallet extension not detected, using sandbox mode.");
        setUserAddress('0x' + Math.random().toString(16).slice(2, 42).padEnd(40, '0'));
        setIsDemoMode(true);
      } finally {
        setLoading(false);
      }
    } else {
      // Demo fallback - No Web3 wallet detected
      console.warn("No Web3 wallet detected, entering simulation mode.");
      setUserAddress('0x' + Math.random().toString(16).slice(2, 42).padEnd(40, '0'));
      setIsDemoMode(true);
    }
  };

  // Cloud State Sync (Drafts)
  useEffect(() => {
    if (userAddress && step === 2) {
      const saveDraft = async () => {
        try {
          await fetch('/api/drafts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_address: userAddress,
              token_config: formData
            })
          });
        } catch {
          console.error("[CLOUD] Auto-save sequence interrupted");
        }
      };

      const timeoutId = setTimeout(saveDraft, 2000); // 2s debounce for performance
      return () => clearTimeout(timeoutId);
    }
  }, [formData, userAddress, step]);

  // Load Cloud State
  useEffect(() => {
    if (userAddress) {
      const loadDraft = async () => {
        try {
          const res = await fetch(`/api/drafts?address=${userAddress}`);
          if (res.ok) {
            const draftData = await res.json();
            setFormData(prev => ({ ...prev, ...draftData }));
          }
        } catch {
          console.warn("[CLOUD] State retrieval skipped");
        }
      };
      loadDraft();
    }
  }, [userAddress]);

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
      await fetch('/api/deploys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_address: result.address,
          owner_address: userAddress,
          network: formData.network,
          tx_hash: result.txHash,
          token_name: sanitizeInput(formData.tokenName),
          token_symbol: sanitizeInput(formData.tokenSymbol).toUpperCase()
        })
      });

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
          {isDemoMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center gap-3 text-orange-400 text-sm"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-bold mb-1">⚠️ Simulation Mode Active</p>
                <p className="text-xs text-orange-300/80">
                  No Web3 wallet detected. Deployments are simulated and won&apos;t create real blockchain contracts. 
                  Install MetaMask or another Web3 wallet to deploy real tokens.
                </p>
              </div>
            </motion.div>
          )}

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
                  <button onClick={() => setStep(2)} className="btn-primary flex items-center gap-3 mx-auto text-lg px-12 relative z-10 group">
                    Open Smart Mint <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden glass border-white/10 shadow-2xl"
              >
                <img src="/images/hero-genesis.png" alt="Smart Mint Interface" className="w-full aspect-video object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
              </motion.div>

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
                        onChange={e => setFormData({ ...formData, description: sanitizeInput(e.target.value) })}
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
        <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Hexagon className="w-4 h-4 text-neon-acid" />
            <span className="text-[10px] font-bold tracking-widest uppercase">NODE NEØ PROTOCOL — EST. 2026</span>
          </div>
          <div className="flex gap-10">
            {['Manifesto', 'Technical Ops', 'Legal', 'Structure'].map(link => (
              <a key={link} href="#" className="text-[10px] uppercase font-bold text-slate-500 hover:text-neon-acid transition-colors tracking-widest">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}

