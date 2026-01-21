import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Rocket, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface OpsState {
    version: string;
    codename: string;
    status: string;
    forge: {
        [key: string]: {
            status: string;
            notes: string;
        };
    };
}

export default function OpsDashboard() {
    const [state, setState] = useState<OpsState | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real scenario, this would fetch from an API route that reads internal-ops/state.json
        // For now, we simulate the fetch or use a local mock if API isn't ready
        const fetchState = async () => {
            try {
                const res = await fetch('/api/ops-status');
                if (res.ok) {
                    const data = await res.json();
                    setState(data);
                }
            } catch (e) {
                console.error("Ops Sync Failed");
            } finally {
                setLoading(false);
            }
        };
        fetchState();
    }, []);

    if (loading) return <div className="animate-pulse text-neon-acid text-[10px] font-bold uppercase tracking-widest">Synchronizing Protocol Intel...</div>;
    if (!state) return null;

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
                {Object.entries(state.forge).map(([key, info]) => (
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
        </div>
    );
}
