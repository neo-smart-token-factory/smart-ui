import React from 'react';
import { Download, Share2, BookOpen, MessageSquare, Twitter, Instagram, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AssetPack() {
    const assets = [
        {
            title: "Strategic Whitepaper",
            subtitle: "The philosophical & economic core",
            icon: BookOpen,
            action: "Generate Plan",
            color: "text-blue-400"
        },
        {
            title: "Marketing Copy",
            subtitle: "Viral hooks & mission statements",
            icon: MessageSquare,
            action: "Copy Text",
            color: "text-green-400"
        },
        {
<<<<<<< HEAD
            title: "Social Smart",
=======
            title: "Social Kit",
>>>>>>> main
            subtitle: "Branding kits & profile setups",
            icon: Share2,
            action: "Get Kit",
            color: "text-purple-400"
        }
    ];

    const socialGuides = [
        { platform: "X (Twitter)", icon: Twitter, status: "Pending", task: "Setup verified account with NEØ tags" },
        { platform: "Telegram", icon: Send, status: "Ready", task: "Configure community bot & group" },
        { platform: "Instagram", icon: Instagram, status: "Optional", task: "Visual visual moodboard creation" }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="neo-label">Neural Asset Pack</h3>
                <span className="text-[10px] bg-neon-acid/10 text-neon-acid px-2 py-1 rounded border border-neon-acid/20">V1.0 GENERATOR</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {assets.map((asset, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors group cursor-pointer"
                    >
                        <asset.icon className={`w-6 h-6 mb-3 ${asset.color}`} />
                        <h4 className="font-bold text-sm mb-1">{asset.title}</h4>
                        <p className="text-[10px] text-slate-500 mb-4">{asset.subtitle}</p>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-neon-acid group-hover:gap-2 transition-all">
                            {asset.action} <Download className="w-3 h-3" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="glass-card !p-0 overflow-hidden">
                <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Social Launch Protocol</span>
                    <span className="text-[10px] text-slate-500">3 Tasks Remaining</span>
                </div>
                <div className="divide-y divide-white/5">
                    {socialGuides.map((guide, i) => (
                        <div key={i} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center border border-white/10">
                                <guide.icon className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold">{guide.platform}</span>
                                    <span className={`text-[8px] px-1.5 py-0.5 rounded ${guide.status === 'Ready' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                        {guide.status}
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-500">{guide.task}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
