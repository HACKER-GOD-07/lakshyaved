import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight } from 'lucide-react';
import ChartCard from '../../ui/components/ChartCard';
import StatCard from '../../ui/components/StatCard';

import { getCareerResults, getSkillGapResults, getProfile } from '../../core/db/repo';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Analytics() {
    const [hasData, setHasData] = useState(true);
    const [loading, setLoading] = useState(true);
    const [salaryData, setSalaryData] = useState([]);
    const [skillData, setSkillData] = useState([]);
    const [insights, setInsights] = useState([]);
    const [stats, setStats] = useState({ y1: 0, y5: 0, matchRate: 0 });
    const [userName, setUserName] = useState('Alex'); // Default fallback

    useEffect(() => {
        async function loadData() {
            try {
                const profile = await getProfile();
                const career = await getCareerResults();
                const skillGap = await getSkillGapResults();

                if (profile?.name) setUserName(profile.name);

                if (!career?.projection && (!skillGap || skillGap.matchRate === undefined)) {
                    setHasData(false);
                    setLoading(false);
                    return;
                }

                const newInsights = [];

                // Prepare Salary Data
                if (career?.projection && career.projection.length > 0) {
                    const arr = career.projection.map(p => ({
                        year: `Year ${p.year}`,
                        salary: p.salaryINR
                    }));
                    setSalaryData(arr);

                    const y1 = arr[0].salary;
                    const y5 = arr[arr.length - 1].salary;
                    setStats(prev => ({ ...prev, y1, y5 }));

                    const inc = Math.round(((y5 - y1) / y1) * 100);

                    const formatLakhs = (val) => `${(val / 100000).toFixed(1)}L`;
                    newInsights.push(
                        <>Your projected salary grows from <span className="text-white font-semibold">₹{formatLakhs(y1)}</span> to <span className="text-[#13ec6d] font-bold">₹{formatLakhs(y5)}</span> in 5 years (~{inc}% increase).</>
                    );
                }

                // Prepare Skill Data
                if (skillGap && skillGap.matchRate !== undefined) {
                    const matched = skillGap.matchedCount || 0;
                    const missing = skillGap.missingCount || 0;

                    setSkillData([
                        { name: "Matched", value: matched, fill: '#13ec6d' },
                        { name: "Missing", value: missing, fill: '#ef4444' }
                    ]);
                    setStats(prev => ({ ...prev, matchRate: skillGap.matchRate }));

                    if (missing > 0 && skillGap.missingSkills?.length) {
                        newInsights.push(
                            <>Focus next on <span className="text-white font-semibold">{skillGap.missingSkills[0]}</span> to improve your job readiness fast.</>
                        );
                    }
                    if (matched > 0) {
                        newInsights.push(`Strong foundation: you already match ${matched} core skills for this role.`);
                    }
                }

                setInsights(newInsights);
                setHasData(true);
            } catch (err) {
                console.error("Failed to load analytics data:", err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const formatINR = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading insights...</div>;
    }

    if (!hasData) {
        return (
            <div className="max-w-3xl mx-auto space-y-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp size={40} className="text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">No Analytics Data Yet</h2>
                <p className="text-slate-400 max-w-md">Run the Career Simulator and Skill Gap Analyzer to generate your personalized insights and growth projections.</p>

                <div className="flex gap-4 mt-6">
                    <Link to="/career" className="px-6 py-3 bg-[#13ec6d] text-[#0b0f19] font-bold rounded-xl hover:bg-[#13ec6d]/90 transition-colors flex items-center gap-2">
                        Career Simulator <ArrowRight size={18} />
                    </Link>
                    <Link to="/skill-gap" className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-2">
                        Skill Gap Analyzer
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="px-2">
                <p className="text-sm font-medium text-[#13ec6d]">Overview</p>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Good evening, {userName}</h2>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Current Target Est." value={stats.y1 > 0 ? formatINR(stats.y1) : 'N/A'} />
                <StatCard title="Year 5 Projection" value={stats.y5 > 0 ? formatINR(stats.y5) : 'N/A'} trendUp={true} trend={stats.y1 > 0 ? `+${Math.round(((stats.y5 - stats.y1) / stats.y1) * 100)}%` : ''} />
                <StatCard title="Overall Skill Match" value={`${stats.matchRate}%`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Salary Growth Chart */}
                <ChartCard
                    title="Salary Growth (5 Years)"
                    value={stats.y5 > 0 ? formatINR(stats.y5) : '₹0'}
                    subtitle="Based on current skill acquisition velocity"
                >
                    <div className="h-64 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salaryData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis
                                    dataKey="year"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${value / 100000}L`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '8px' }}
                                    itemStyle={{ color: '#13ec6d' }}
                                    formatter={(value) => [formatINR(value), 'Salary']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="salary"
                                    stroke="#13ec6d"
                                    strokeWidth={3}
                                    dot={{ fill: '#0f172a', stroke: '#13ec6d', strokeWidth: 2, r: 4 }}
                                    activeDot={{ fill: '#13ec6d', stroke: '#fff', strokeWidth: 2, r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Skill Breakdown Chart */}
                <ChartCard
                    title="Skill Match Overview"
                    value={`${stats.matchRate}%`}
                    subtitle="Core requirements vs current profile"
                >
                    <div className="h-64 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={skillData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#1e293b', opacity: 0.4 }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '8px' }}
                                />
                                <Bar
                                    dataKey="value"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>

            {insights.length > 0 && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#15202b] dark:to-[#0f151e] p-5 shadow-lg border border-slate-700/50 mt-6 xl:mt-8">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-[#13ec6d] blur-[60px] opacity-20 pointer-events-none" />
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={20} className="text-[#13ec6d]" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Lakshya AI Insights</h3>
                    </div>
                    <ul className="space-y-3">
                        {insights.map((insight, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#13ec6d] shadow-[0_0_8px_rgba(19,236,109,0.8)]" />
                                <p className="text-sm text-slate-300 leading-relaxed">{insight}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
