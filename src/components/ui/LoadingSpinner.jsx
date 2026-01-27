
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-10 h-10 border-3',
    };

    return (
        <div className={`relative ${sizes[size] || sizes.md} ${className}`}>
            <motion.div
                className="absolute inset-0 rounded-full border-white/10"
                style={{ borderTopColor: 'transparent' }}
            />
            <motion.div
                className="absolute inset-0 rounded-full border-neon-acid"
                style={{ borderLeftColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: 'transparent' }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
        </div>
    );
};

export default LoadingSpinner;
