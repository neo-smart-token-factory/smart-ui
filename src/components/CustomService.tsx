import React from 'react';
import { Mail, MessageCircle, Globe, Shield, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomService() {
    const contactOptions = [
        {
            label: "Direct Command",
            value: "neo@neoprotocol.space",
            icon: Mail,
            link: "mailto:neo@neoprotocol.space"
        },
        {
            label: "Neural Link",
            value: "Telegram Support",
            icon: MessageCircle,
            link: "https://t.me/neomello"
        },
        {
            label: "Official Web",
            value: "neoprotocol.space",
            icon: Globe,
            link: "https://neoprotocol.space"
        },
        {
            label: "Neural Whatsapp",
            value: "Whatsapp Support",
            icon: MessageCircle,
            link: "https://wa.me/5562983231110"
        },
    ];

    return (
        <div className="glass-card mt-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4">
                <Star className="w-5 h-5 text-neon-acid animate-pulse" />
            </div>

            <div className="p-8 space-y-6">
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-headline">Custom Neural Smart</h3>
                    <p className="text-slate-400 text-sm max-w-xl">
                        Seeking architectures beyond our standard matrix? Our specialized engineers craft custom protocols, L3 solutions, and complex tokenomics.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {contactOptions.map((opt, i) => (
                        <motion.a
                            key={i}
                            href={opt.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                            className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-black/20 group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-neon-acid/10 flex items-center justify-center group-hover:bg-neon-acid transition-colors">
                                <opt.icon className="w-5 h-5 text-neon-acid group-hover:text-obsidian" />
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest">{opt.label}</span>
                                <span className="text-sm font-medium">{opt.value}</span>
                            </div>
                        </motion.a>
                    ))}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                    <Shield className="w-4 h-4 text-slate-500" />
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Enterprise SLA & Custom Audits Available</span>
                </div>
            </div>
        </div>
    );
}
