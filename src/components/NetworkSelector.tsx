import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const networks = [
    {
        id: 'base',
        name: 'Base',
        icon: '🌐',
        color: '#0052FF',
        description: 'Ethereum L2 superchain by Coinbase.',
        link: 'https://base.org'
    },
    {
        id: 'polygon',
        name: 'Polygon',
        icon: '⬡',
        color: '#8247E5',
        description: 'Protocol and framework for building networks.',
        link: 'https://polygon.technology'
    },
    {
        id: 'arbitrum',
        name: 'Arbitrum',
        icon: '💙',
        color: '#28A0F0',
        description: 'Leading Ethereum Layer 2 scaling solution.',
        link: 'https://arbitrum.io'
    }
];

interface NetworkSelectorProps {
    selected: string;
    onSelect: (id: string) => void;
}

export default function NetworkSelector({ selected, onSelect }: NetworkSelectorProps) {
    return (
        <div className="space-y-4">
            <h3 className="neo-label">Select Deployment Network</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {networks.map((net) => (
                    <motion.div
                        key={net.id}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(net.id)}
                        className={cn(
                            "relative cursor-pointer glass-card border-2 transition-all",
                            selected === net.id
                                ? "border-neon-acid bg-neon-acid/5"
                                : "border-transparent"
                        )}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl" style={{ color: net.color }}>{net.icon}</span>
                            <span className="font-headline font-bold text-lg">{net.name}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {net.description}
                        </p>

                        {selected === net.id && (
                            <motion.div
                                layoutId="active-glow"
                                className="absolute inset-0 rounded-2xl neon-glow pointer-events-none"
                            />
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
