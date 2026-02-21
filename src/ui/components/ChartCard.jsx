import { MoreHorizontal } from 'lucide-react';

export default function ChartCard({ title, value, trend, subtitle, children }) {
    return (
        <div className="rounded-2xl bg-white dark:bg-[#121a2a] border border-slate-200 dark:border-[#1e293b] p-5 shadow-lg shadow-black/5 dark:shadow-black/20">
            <div className="flex items-start justify-between mb-2">
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{value}</span>
                        {trend && (
                            <span className="flex items-center text-sm font-bold text-[#13ec6d] bg-[#13ec6d]/10 px-2 py-0.5 rounded-full">
                                {trend}
                            </span>
                        )}
                    </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400">
                    <MoreHorizontal size={20} />
                </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500 mb-6">{subtitle}</p>

            <div className="relative w-full">
                {children}
            </div>
        </div>
    );
}
