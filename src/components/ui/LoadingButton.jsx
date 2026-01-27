import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingButton = ({
    loading = false,
    children,
    icon: Icon = null,
    loadingText = 'Processing...',
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <button
            disabled={loading || disabled}
            className={`btn-primary flex items-center justify-center gap-3 transition-all ${loading ? 'opacity-80 scale-[0.98] cursor-wait' : ''
                } ${className}`}
            {...props}
        >
            {loading ? (
                <>
                    <LoadingSpinner size="sm" className="!border-obsidian" />
                    <span className="animate-pulse">{loadingText}</span>
                </>
            ) : (
                <>
                    {children}
                    {Icon && <Icon className="w-5 h-5" />}
                </>
            )}
        </button>
    );
};

export default LoadingButton;
