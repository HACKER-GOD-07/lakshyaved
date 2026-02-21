import { TrendingUp, MoreHorizontal } from 'lucide-react';
import ChartCard from '../../ui/components/ChartCard';

export default function Analytics() {
    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="px-2">
                <p className="text-sm font-medium text-[#13ec6d]">Overview</p>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Good evening, Alex</h2>
            </div>

            <ChartCard
                title="Projected Salary"
                value="$142k"
                trend="+$12k"
                subtitle="Based on current skill acquisition velocity"
            >
                <div className="relative h-48 w-full mt-4">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="border-t border-dashed border-slate-200 dark:border-slate-700/50 w-full h-0" />
                        ))}
                    </div>

                    {/* SVG Chart */}
                    <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="salaryGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#13ec6d" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#13ec6d" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d="M0,80 C20,75 40,60 60,50 C80,40 90,20 100,10 V100 H0 Z" fill="url(#salaryGradient)" />
                        <path d="M0,80 C20,75 40,60 60,50 C80,40 90,20 100,10" fill="none" stroke="#13ec6d" strokeLinecap="round" strokeWidth="3" />
                        <circle cx="0" cy="80" r="3" className="fill-[#121a2a] stroke-[#13ec6d] stroke-2" />
                        <circle cx="60" cy="50" r="3" className="fill-[#121a2a] stroke-[#13ec6d] stroke-2" />
                        <circle cx="100" cy="10" r="4" className="fill-[#13ec6d] stroke-white dark:stroke-[#121a2a] stroke-2 shadow-lg" />
                    </svg>

                    {/* Tooltip */}
                    <div className="absolute right-0 top-0 -mt-8 translate-x-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold py-1 px-2 rounded opacity-100 shadow-xl">
                        $142,500
                        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-white rotate-45" />
                    </div>
                </div>

                <div className="flex justify-between mt-4 text-xs font-medium text-slate-400">
                    <span>2020</span>
                    <span>2021</span>
                    <span>2022</span>
                    <span>2023</span>
                    <span className="text-[#13ec6d] font-bold">2024</span>
                </div>
            </ChartCard>

            <div className="rounded-2xl bg-white dark:bg-[#121a2a] border border-slate-200 dark:border-[#1e293b] p-5 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Role Readiness</h3>
                    <button className="text-xs font-bold text-[#13ec6d] hover:underline">View All</button>
                </div>
                <div className="space-y-5">
                    {[
                        { role: 'Senior Backend Eng', match: 82, color: 'bg-[#13ec6d]' },
                        { role: 'Tech Lead', match: 65, color: 'bg-slate-400 dark:bg-slate-600' },
                        { role: 'Cloud Architect', match: 48, color: 'bg-slate-400 dark:bg-slate-600' }
                    ].map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.role}</span>
                                <span className={`text-sm font-bold ${item.match > 80 ? 'text-[#13ec6d]' : 'text-slate-400'}`}>{item.match}% Match</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${item.color} ${item.match > 80 ? 'shadow-[0_0_10px_rgba(19,236,109,0.4)]' : ''}`}
                                    style={{ width: `${item.match}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#15202b] dark:to-[#0f151e] p-5 shadow-lg border border-slate-700/50">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-[#13ec6d] blur-[60px] opacity-20 pointer-events-none" />
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={20} className="text-[#13ec6d]" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Lakshya AI Insights</h3>
                </div>
                <ul className="space-y-3">
                    {[
                        { text: <>Focus next on <span className="text-white font-semibold">Docker + TensorFlow</span> to unlock Senior roles.</> },
                        { text: <>Your leadership score improved by <span className="text-[#13ec6d] font-bold">+15%</span> this quarter.</> },
                        { text: "Market demand for your current stack is trending high." }
                    ].map((insight, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#13ec6d] shadow-[0_0_8px_rgba(19,236,109,0.8)]" />
                            <p className="text-sm text-slate-300 leading-relaxed">{insight.text}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
