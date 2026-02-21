import { ArrowRight } from 'lucide-react';

export default function RoadmapCard({ title, priority, steps = [] }) {
    const priorityColors = {
        high: "text-[#ef4444]",
        medium: "text-orange-400",
        low: "text-[#13ec6d]"
    };

    return (
        <div className="group relative rounded-xl bg-[#121a2a] p-5 border border-[#1e293b] hover:border-[#13ec6d]/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div className="flex flex-col">
                    <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${priorityColors[priority]}`}>
                        {priority} Priority
                    </span>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#111814] flex items-center justify-center border border-white/10 group-hover:bg-[#13ec6d] group-hover:text-[#0b0f19] group-hover:border-[#13ec6d] transition-all">
                    <ArrowRight size={18} />
                </div>
            </div>

            <div className="space-y-3 relative pl-4 border-l border-white/10 ml-1">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className={`absolute -left-[5px] h-2.5 w-2.5 rounded-full ring-4 ring-[#121a2a] ${index === 0 ? 'bg-[#13ec6d]' : 'bg-slate-600'}`}></div>
                        <p className={`text-sm ${index === 0 ? 'text-slate-300' : 'text-slate-400'}`}>{step}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
