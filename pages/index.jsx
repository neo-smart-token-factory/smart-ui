import { useState, useEffect } from 'react';
import Head from 'next/head';
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
  Wallet
} from 'lucide-react';
import NetworkSelector from '../components/NetworkSelector';
import AssetPack from '../components/AssetPack';
import LandingSection from '../components/LandingSection';
import CustomService from '../components/CustomService';

export default function NeuralForge() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    tokenSupply: '',
    network: 'base',
    description: ''
  });

  const [forgeResult, setForgeResult] = useState(null);

  const handleForge = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simular o "WOW" process
    setTimeout(() => {
      setForgeResult({
        ...formData,
        address: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        status: 'FORGED'
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen Selection:bg-neon-acid Selection:text-obsidian">
      <Head>
        <title>NΞØ | Neural Forge Factory</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-acid/10 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-signal-cyan/10 blur-[120px] rounded-full animate-pulse-slow" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <img src="/brand/logo-main.png" alt="NEØ Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(216,242,68,0.4)]" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tighter uppercase">NΞØ <span className="text-neon-acid">FORGE</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden md:inline">Neural Network Status: <span className="text-green-400">Stable</span></span>
          <div className="btn-secondary !py-2 !px-4 !text-xs flex items-center gap-2">
            <Wallet className="w-3 h-3" /> Connect Neural Link
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        <AnimatePresence mode="wait">
          {!forgeResult && step === 1 ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-neon-acid uppercase tracking-widest"
                >
                  <Zap className="w-3 h-3" /> Decentralized Intelligence Factory
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                  Forge your <span className="text-neon-acid">Multichain</span> Future.
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                  The first neural-ready asset generator. Create stable, liquid, and narratives-driven protocols in seconds across the Superchain.
                </p>
                <div className="pt-8">
                  <button onClick={() => setStep(2)} className="btn-primary flex items-center gap-3 mx-auto text-lg px-12 relative z-10">
                    Enter the Forge <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Hero Image Integration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden glass border-white/10 shadow-2xl"
              >
                <img src="/images/hero-genesis.png" alt="Neural Forge Genesis" className="w-full aspect-video object-cover opacity-80" />
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
              {/* Forge Interface */}
              <form onSubmit={handleForge} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Basic ID */}
                  <div className="glass-card space-y-6">
                    <div className="flex items-center gap-2 text-neon-acid mb-2">
                      <Cpu className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Protocol Identification</span>
                    </div>

                    <div>
                      <label className="neo-label">Token Identity</label>
                      <input
                        type="text"
                        required
                        className="neo-input w-full"
                        placeholder="Ex: Neural Flow"
                        value={formData.tokenName}
                        onChange={e => setFormData({ ...formData, tokenName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="neo-label">Neural Symbol</label>
                      <input
                        type="text"
                        required
                        className="neo-input w-full uppercase"
                        placeholder="Ex: FLOW"
                        maxLength={6}
                        value={formData.tokenSymbol}
                        onChange={e => setFormData({ ...formData, tokenSymbol: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="neo-label">Genesis Supply</label>
                      <input
                        type="number"
                        required
                        className="neo-input w-full"
                        placeholder="Ex: 1,000,000"
                        value={formData.tokenSupply}
                        onChange={e => setFormData({ ...formData, tokenSupply: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Right Column: Narrative */}
                  <div className="glass-card space-y-6">
                    <div className="flex items-center gap-2 text-signal-cyan mb-2">
                      <Layers className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Nexus Config</span>
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
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Features Enabled</span>
                        <ShieldCheck className="w-3 h-3 text-green-400" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Anti-Whale', 'Auto-Burn', 'Bridge-Ready', 'Vesting'].map(tag => (
                          <span key={tag} className="text-[9px] bg-white/5 px-2 py-1 rounded border border-white/5 text-slate-400">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Network Selection */}
                <div className="glass-card">
                  <NetworkSelector
                    selected={formData.network}
                    onSelect={id => setFormData({ ...formData, network: id })}
                  />
                </div>

                {/* Call to Action */}
                <div className="flex flex-col items-center gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full md:w-[400px] flex items-center justify-center gap-3 text-lg"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Rocket className="w-5 h-5" />
                        </motion.div>
                        Igniting Neural Forge...
                      </>
                    ) : (
                      <>
                        Forge Protocol <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-slate-500 flex items-center gap-2 italic">
                    <ShieldCheck className="w-3 h-3" /> Secure Minting Protocol v0.5.3 — Audit Stable
                  </p>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Success Header */}
              <div className="glass-card p-10 text-center space-y-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-energy opacity-10 blur-3xl pointer-events-none group-hover:opacity-20 transition-opacity" />
                <div className="w-20 h-20 bg-neon-acid rounded-full mx-auto flex items-center justify-center neon-glow">
                  <ShieldCheck className="w-10 h-10 text-obsidian" />
                </div>
                <div className="space-y-2">
                  <span className="text-neon-acid font-mono text-[10px] tracking-[0.3em] font-bold">GENESIS SUCCESSFUL</span>
                  <h2 className="text-4xl font-bold">{formData.tokenName} is Forged!</h2>
                  <p className="text-slate-400 font-mono text-sm">{forgeResult.address}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5 flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold uppercase">View on Explorer</span>
                  </div>
                  <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5 flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors">
                    <Rocket className="w-4 h-4 text-neon-acid" />
                    <span className="text-xs font-bold uppercase">Activate Bridge</span>
                  </div>
                </div>
              </div>

              <AssetPack tokenName={formData.tokenName} tokenSymbol={formData.tokenSymbol} />

              <CustomService />

              <div className="flex justify-center">
                <button
                  onClick={() => setForgeResult(null)}
                  className="text-xs text-slate-500 hover:text-neon-acid transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-3 h-3 rotate-180" /> Start New Genesis
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/5 py-12 px-6">
        <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Hexagon className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-widest uppercase">NODE NEØ Protocol — 2026</span>
          </div>
          <div className="flex gap-8">
            {['Manifesto', 'Technical Ops', 'Legal', 'Infrastructure'].map(link => (
              <a key={link} href="#" className="text-[10px] uppercase font-bold text-slate-500 hover:text-neon-acid transition-colors tracking-widest">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <style jsx global>{`
        * { cursor: crosshair !important; }
        .container { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
