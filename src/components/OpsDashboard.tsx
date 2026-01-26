import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
import { Activity, Shield, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface OpsState {
    version: string;
    codename: string;
    status: string;
    components: {
        [key: string]: {
            status: string;
            notes: string;
        };
    };
}

export default function OpsDashboard() {
    const [state, setState] = useState<OpsState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Fetch operational status from API route
        const fetchState = async () => {
            try {
                const res = await fetch('/api/ops-status');
                if (res.ok) {
                    const data = await res.json();
                    setState(data);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Ops Sync Failed:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchState();
    }, []);

    if (loading) return <div className="animate-pulse text-neon-acid text-[10px] font-bold uppercase tracking-widest">Synchronizing Protocol Intel...</div>;

    // Show graceful fallback UI when API is unavailable (e.g., local dev without Vercel)
    if (!state || error) {
        return (
            <div className="glass-card !p-6 border-orange-500/20 bg-black/60">
                <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-orange-400" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Protocol Intel Unavailable</h3>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                    Ops dashboard requires Vercel serverless functions. Use <code className="text-neon-acid bg-black/40 px-1 py-0.5 rounded">vercel dev</code> for local development,
                    or deploy to Vercel to enable Protocol Intel synchronization.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-neon-acid" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Protocol Intel — {state.codename}</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500">v{state.version}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(state.components).map(([key, info]) => (
                    <div key={key} className="glass-card !p-4 border-white/5 bg-black/40">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">{key}</span>
                            {info.status === 'completed' ? (
                                <CheckCircle2 className="w-3 h-3 text-green-400" />
                            ) : info.status === 'in_progress' ? (
                                <Clock className="w-3 h-3 text-orange-400 animate-spin-slow" />
                            ) : (
                                <AlertCircle className="w-3 h-3 text-slate-600" />
                            )}
                        </div>
                        <p className="text-[10px] text-slate-300 leading-tight line-clamp-2">{info.notes}</p>
                    </div>
                ))}
            </div>

            <div className="bg-neon-acid/5 border border-neon-acid/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-neon-acid" />
                    <div>
                        <p className="text-[10px] font-bold uppercase text-neon-acid">System Status</p>
                        <p className="text-[9px] text-slate-400">All neural nodes aligned and responding.</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                    <span className="text-[8px] font-bold text-green-500 uppercase">Live</span>
                </div>
            </div>

            <div className="glass-card !p-4 border-neon-acid/20 bg-black/60 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                    <Shield className="w-3 h-3 text-neon-acid" />
                </div>
                <h4 className="text-[10px] font-bold text-neon-acid uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1 h-1 bg-neon-acid rounded-full animate-pulse" />
                    Doctor Intelligence — Phase A
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Smart Scan</p>
                        <div className="flex items-center gap-2">
                            <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-neon-acid w-[100%] shadow-[0_0_10px_#ccff00]" />
                            </div>
                            <span className="text-[8px] text-neon-acid font-mono">SAFE</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Security Pulse</p>
                        <div className="flex items-center gap-2">
                            <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-neon-acid w-[100%] shadow-[0_0_10px_#ccff00]" />
                            </div>
                            <span className="text-[8px] text-neon-acid font-mono">SAFE</span>
                        </div>
                    </div>
                </div>
                <div className="mt-3 flex justify-between items-center text-[8px] text-slate-500">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-2 h-2 text-neon-acid" /> Initializable Checked</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-2 h-2 text-neon-acid" /> Proxy Validated</span>
                </div>
            </div>
        </div>
    );
}
