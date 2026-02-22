import { useState, useEffect } from 'react';
import { Play, RotateCcw, Download } from 'lucide-react';
import ChipInput from '../../ui/components/ChipInput';
import StatCard from '../../ui/components/StatCard';

import { simulateCareer } from '../../core/logic/careerEngine';
import { getAllRoles, findRoles } from '../../core/logic/dataStore';
import { saveProfile, getProfile, saveCareerResults, getCareerResults } from '../../core/db/repo';

export default function CareerSimulator() {
    const rolesDataset = getAllRoles();
    const [skills, setSkills] = useState(['Python', 'React']);
    const [interests, setInterests] = useState(['Leadership']);
    const [targetRole, setTargetRole] = useState(rolesDataset[0]?.roleId || '');
    const [results, setResults] = useState(null);
    const [errorStatus, setErrorStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRoles, setFilteredRoles] = useState(rolesDataset);

    useEffect(() => {
        setFilteredRoles(findRoles(searchQuery));
    }, [searchQuery]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const profile = await getProfile();
                if (profile) {
                    if (profile.skills) setSkills(profile.skills);
                    if (profile.interests) setInterests(profile.interests);
                    if (profile.targetRole) setTargetRole(profile.targetRole);
                }

                const savedResults = await getCareerResults();
                if (savedResults && savedResults.projection) {
                    setResults({ projection: savedResults.projection });

                    if (profile && profile.targetRole && profile.skills) {
                        const sim = simulateCareer({
                            skills: profile.skills,
                            interests: profile.interests || [],
                            targetRole: profile.targetRole,
                            rolesDataset
                        });
                        setResults(sim);
                    }
                }
            } catch (err) {
                console.error("Failed to load saved data:", err);
            }
        };
        loadData();
    }, []);

    const formatINR = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    const addSkill = (skill) => setSkills([...skills, skill]);
    const removeSkill = (skill) => setSkills(skills.filter(s => s !== skill));

    const addInterest = (interest) => setInterests([...interests, interest]);
    const removeInterest = (interest) => setInterests(interests.filter(i => i !== interest));

    const handleSimulate = async () => {
        try {
            if (!targetRole) {
                setErrorStatus('Please select a target role');
                return;
            }

            const simulation = simulateCareer({
                skills,
                interests,
                targetRole,
                rolesDataset
            });

            setResults(simulation);
            setErrorStatus('');

            await saveProfile({ skills, interests, targetRole });
            await saveCareerResults(simulation.projection);
        } catch (err) {
            setErrorStatus(err.message);
        }
    };

    const handleReset = () => {
        setSkills([]);
        setInterests([]);
        setTargetRole(rolesDataset[0]?.roleId || '');
        setResults(null);
        setErrorStatus('');
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Career Simulator</h2>
                <p className="text-slate-400 text-sm mt-1">Project your growth path based on current market data.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="bg-white dark:bg-[#121a2a] rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-[#1e293b] space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            Parameters
                        </h3>
                        <button onClick={handleReset} className="text-xs text-[#13ec6d] font-medium hover:underline flex items-center gap-1 cursor-pointer">
                            <RotateCcw size={12} /> Reset
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Role Search</label>
                            <input
                                type="text"
                                placeholder="Search roles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#1c2533] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#13ec6d]/50 focus:border-[#13ec6d] transition-all font-medium"
                            />
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Target Role</label>
                            <select
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#1c2533] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#13ec6d]/50 focus:border-[#13ec6d] transition-all font-medium appearance-none">
                                {filteredRoles.map(role => (
                                    <option key={role.roleId} value={role.roleId}>
                                        {role.roleName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <ChipInput
                            label="Current Skills"
                            chips={skills}
                            onAdd={addSkill}
                            onRemove={removeSkill}
                            placeholder="Add skill..."
                        />

                        <ChipInput
                            label="Interests"
                            chips={interests}
                            onAdd={addInterest}
                            onRemove={removeInterest}
                            placeholder="Add interest..."
                        />

                        {errorStatus && (
                            <div className="p-3 bg-red-900/50 text-red-200 border border-red-800 rounded-lg text-sm font-medium">
                                {errorStatus}
                            </div>
                        )}

                        <button onClick={handleSimulate} className="w-full bg-[#13ec6d] text-slate-900 font-bold py-3.5 rounded-xl mt-4 hover:bg-[#0ea64d] active:scale-[0.98] transition-all shadow-[0_0_20px_-5px_rgba(19,236,109,0.3)] flex items-center justify-center gap-2 cursor-pointer">
                            <Play size={20} fill="currentColor" />
                            Simulate Career Path
                        </button>
                    </div>
                </div>

                {/* Projection Result */}
                <div className="bg-white dark:bg-[#121a2a] rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-[#1e293b] flex flex-col relative overflow-hidden">
                    {results ? (
                        <>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#13ec6d]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Projection</h3>
                                <div className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded-md border border-green-500/20 font-bold uppercase">Simulation Active</div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8 flex-1">
                                <div className="relative w-40 h-40 flex-shrink-0">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-slate-200 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                                        {results.explain && (
                                            <path className="text-[#13ec6d] drop-shadow-[0_0_8px_rgba(19,236,109,0.5)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${results.explain.skillMatchPercent}, 100`} strokeLinecap="round" strokeWidth="3.5" />
                                        )}
                                    </svg>
                                    {results.explain && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl font-bold text-slate-900 dark:text-white">{results.explain.skillMatchPercent}%</span>
                                            <span className="text-[10px] text-slate-500 uppercase font-semibold">Match</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4 w-full">
                                    <StatCard title="Target Year" value="Year 5" />
                                    <StatCard
                                        title="Est. Salary"
                                        value={results.projection.length ? formatINR(results.projection[4].salaryINR) : 'N/A'}
                                        trend={results.explain ? `+${results.explain.effectiveGrowthPercent}% /yr` : ''}
                                        trendUp={true}
                                    />
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                                {results.explain ? (
                                    <>Based on your profile, you are projected to reach <strong className="text-slate-300">{results.projection[4]?.title}</strong> level smoothly with a {results.explain.effectiveGrowthPercent}% YoY compounding growth rate.</>
                                ) : 'Data loaded successfully.'}
                            </p>
                        </>
                    ) : (
                        <div className="h-full bg-slate-800/20 rounded-xl border border-slate-700/50 border-dashed flex items-center justify-center p-12 text-center text-slate-500 flex-1">
                            <div>
                                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <p className="text-lg font-medium text-slate-400 mb-1">No Simulation Complete</p>
                                <p className="text-xs">Select your parameters and simulate.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Roadmap Table */}
            {results && results.projection && (
                <div className="bg-white dark:bg-[#121a2a] rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-[#1e293b]">
                    <div className="p-5 border-b border-slate-200 dark:border-[#1e293b] flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">5-Year Roadmap</h3>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                            <Download size={20} />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-[#151e2e] text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Year</th>
                                    <th className="px-6 py-4">Projected Role</th>
                                    <th className="px-6 py-4 text-right">Compensation</th>
                                    <th className="px-6 py-4 hidden sm:table-cell">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {results.projection.map((row) => (
                                    <tr key={row.year} className={`group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-2 w-2 rounded-full bg-slate-600`} />
                                                <span className={`text-sm font-bold text-slate-900 dark:text-white`}>Year {row.year}</span>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-sm text-slate-600 dark:text-slate-300`}>{row.title}</td>
                                        <td className={`px-6 py-4 text-sm font-medium text-right text-slate-900 dark:text-white`}>{formatINR(row.salaryINR)}</td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <span className={`px-2 py-1 rounded text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300`}>
                                                Progressing
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
