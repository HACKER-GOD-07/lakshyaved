export default function StatCard({ title, value, subtitle, icon, trend, trendUp = true }) {
    return (
        <div className="flex flex-col rounded-xl bg-[#121a2a] p-4 border border-[#1e293b] shadow-lg">
            <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
                {icon && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#13ec6d]/30 border-t-[#13ec6d]">
                        <span className="text-[10px] font-bold text-[#13ec6d]">{icon}</span>
                    </div>
                )}
            </div>
            <div className="mt-auto">
                <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-white">{value}</p>
                    {trend && (
                        <span className={`text-xs font-bold ${trendUp ? 'text-[#13ec6d]' : 'text-[#ef4444]'}`}>
                            {trend}
                        </span>
                    )}
                </div>
                {subtitle && <p className="text-[10px] font-medium text-slate-500 mt-1">{subtitle}</p>}
            </div>
        </div>
    );
}
