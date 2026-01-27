import { useState, useMemo } from 'react';
import { CheckCircle2, AlertCircle, Copy, Search } from 'lucide-react';
import { validateAddress } from '../../utils/addressValidation';

const AddressInput = ({
    label = 'Wallet Address',
    value = '',
    onChange,
    placeholder = '0x...',
    className = '',
    disabled = false,
    required = false
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [copied, setCopied] = useState(false);

    // Compute validation status based on current controlled value for display
    // This is separate from handleChange validation because:
    // 1. This validates the current prop value for visual feedback
    // 2. handleChange validates new input to normalize it before passing to parent
    const status = useMemo(() => {
        if (!value) {
            return { valid: null, error: null };
        }
        const result = validateAddress(value);
        return { valid: result.valid, error: result.error };
    }, [value]);

    // Validate and normalize user input before passing to parent
    const handleChange = (e) => {
        const val = e.target.value;

        if (val) {
            // Validate new input to provide normalized address to parent immediately
            const result = validateAddress(val);
            if (onChange) {
                onChange(result.valid ? result.normalized : val, result.valid);
            }
        } else {
            if (onChange) onChange('', false);
        }
    };

    const handleCopy = () => {
        if (status.valid && value) {
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                    {label} {required && <span className="text-neon-acid">*</span>}
                </label>
            )}

            <div className="relative group">
                <div className={`absolute inset-0 bg-neon-acid/5 rounded-xl blur-lg transition-opacity duration-300 pointer-events-none ${isFocused ? 'opacity-100' : 'opacity-0'}`} />

                <div className={`relative flex items-center bg-black/40 border transition-all duration-200 rounded-xl overflow-hidden
          ${isFocused ? 'border-neon-acid shadow-[0_0_15px_rgba(216,242,68,0.1)]' : 'border-white/10 hover:border-white/20'}
          ${status.valid === false ? '!border-red-500/50' : ''}
          ${status.valid === true ? '!border-neon-acid/50' : ''}
        `}>
                    <div className="pl-4 pr-2 text-slate-500">
                        <Search className="w-4 h-4" />
                    </div>

                    <input
                        type="text"
                        value={value}
                        onChange={handleChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="w-full bg-transparent py-3 text-sm font-mono placeholder:text-slate-600 focus:outline-none disabled:opacity-50"
                    />

                    <div className="flex items-center gap-2 pr-3">
                        {status.valid === true && (
                            <CheckCircle2 className="w-4 h-4 text-neon-acid animate-in zoom-in duration-300" />
                        )}

                        {status.valid === false && (
                            <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
                        )}

                        {status.valid && (
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="p-1.5 hover:bg-white/5 rounded-lg transition-colors group/copy"
                                title="Copy address"
                            >
                                <Copy className={`w-3.5 h-3.5 ${copied ? 'text-neon-acid' : 'text-slate-500 group-hover/copy:text-slate-300'}`} />
                            </button>
                        )}
                    </div>
                </div>

                {status.valid === false && status.error && (
                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider pl-1 mt-1 animate-in slide-in-from-top-1">
                        {status.error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default AddressInput;
