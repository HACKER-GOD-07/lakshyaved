import { useState } from 'react';
import { X, Plus } from 'lucide-react';

export default function ChipInput({ label, chips = [], onAdd, onRemove, placeholder = "Add..." }) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            onAdd(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
            <div className="flex flex-wrap gap-2">
                {chips.map((chip, index) => (
                    <span
                        key={index}
                        className="px-3 py-1.5 rounded-lg bg-[#13ec6d]/10 text-[#13ec6d] text-sm font-semibold border border-[#13ec6d]/20 flex items-center gap-1 cursor-pointer hover:bg-[#13ec6d]/20 transition-colors"
                        onClick={() => onRemove(chip)}
                    >
                        {chip} <X size={14} />
                    </span>
                ))}
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="px-3 py-1.5 pl-8 rounded-lg bg-slate-100 dark:bg-[#1c2533] text-slate-600 dark:text-slate-400 text-sm font-medium border border-transparent hover:border-slate-600 dark:hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-[#13ec6d] transition-colors w-32"
                        placeholder={placeholder}
                    />
                    <Plus size={14} className="absolute left-2 text-slate-500" />
                </div>
            </div>
        </div>
    );
}
