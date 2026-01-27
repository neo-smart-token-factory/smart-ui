import { motion } from 'framer-motion';

const ProgressBar = ({
    progress = 0,
    color = 'bg-neon-acid',
    height = 'h-1',
    label = '',
    className = '',
    showPercentage = false
}) => {
    // Clamp progress between 0 and 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className={`w-full space-y-1.5 ${className}`}>
            {(label || showPercentage) && (
                <div className="flex justify-between items-center px-1">
                    {label && (
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {label}
                        </span>
                    )}
                    {showPercentage && (
                        <span className="text-[10px] font-mono text-neon-acid">
                            {Math.round(clampedProgress)}%
                        </span>
                    )}
                </div>
            )}
            <div className={`w-full bg-white/5 rounded-full overflow-hidden ${height} border border-white/5`}>
                <motion.div
                    className={`h-full ${color} shadow-[0_0_10px_rgba(216,242,68,0.2)]`}
                    initial={{ width: 0 }}
                    animate={{ width: `${clampedProgress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
