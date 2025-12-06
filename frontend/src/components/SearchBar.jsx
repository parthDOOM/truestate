import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value = '', onChange, placeholder = 'Search...' }) {
    const [localValue, setLocalValue] = useState(value);

    // Debounce the search
    const debounce = useCallback((fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    }, []);

    const debouncedOnChange = useCallback(
        debounce((val) => {
            onChange(val);
        }, 300),
        [onChange]
    );

    const handleChange = (e) => {
        const val = e.target.value;
        setLocalValue(val);
        debouncedOnChange(val);
    };

    const handleClear = () => {
        setLocalValue('');
        onChange('');
    };

    return (
        <div className="relative flex-1 max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-surface-400" />
            </div>
            <input
                type="text"
                value={localValue}
                onChange={handleChange}
                placeholder={placeholder}
                className="
          w-full pl-12 pr-10 py-3 
          bg-surface-800/50 backdrop-blur-sm
          border border-surface-600/50 rounded-xl
          text-surface-100 placeholder-surface-500 text-base
          transition-all duration-200
          focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20
          hover:border-surface-500
        "
            />
            {localValue && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-surface-400 hover:text-surface-200 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}
