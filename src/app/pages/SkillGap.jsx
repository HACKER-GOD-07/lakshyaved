import { useState, useEffect } from 'react';
import { ArrowLeft, MoreHorizontal, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import SkillChip from '../../ui/components/SkillChip';
import RoadmapCard from '../../ui/components/RoadmapCard';

import rolesDataset from '../../core/logic/rolesDataset';
import { getResume, getProfile } from '../../core/db/repo';

export default function SkillGap() {
    const [resumeSaved, setResumeSaved] = useState(false);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const loader = async () => {
            const resume = await getResume();
            if (resume && resume.rawText) {
                setResumeSaved(true);
            }
            const p = await getProfile();
            if (p) {
                setProfile(p);
            }
        };
        loader();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Skill Gap Analyzer</h1>
                </div>
                <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Resume Status */}
            <div className="relative overflow-hidden rounded-xl bg-[#121a2a] p-1 shadow-lg ring-1 ring-white/10">
                <div className="absolute inset-0 bg-gradient-to-r from-[#13ec6d]/10 to-transparent pointer-events-none" />
                <div className="relative flex items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${resumeSaved ? 'bg-[#13ec6d]/20 text-[#13ec6d]' : 'bg-slate-800 text-slate-500'}`}>
                            {resumeSaved ? <CheckCircle size={20} /> : <FileText size={20} />}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{resumeSaved ? 'Resume: Saved in DB' : 'Resume: Missing'}</p>
                            <p className="text-xs text-gray-400">Head to the upload page to attach your resume.</p>
                        </div>
                    </div>
                    {resumeSaved && <CheckCircle size={24} className="text-[#13ec6d]" />}
                </div>
            </div>

            {/* Controls & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Target Role</label>
                        <select className="w-full rounded-lg bg-[#121a2a] border border-[#3b5445] py-3 px-4 text-sm text-white focus:border-[#13ec6d] focus:outline-none focus:ring-1 focus:ring-[#13ec6d]">
                            {rolesDataset.map(r => (
                                <option key={r.roleId}>{r.roleName}</option>
                            ))}
                        </select>
                    </div>
                    <button className="w-full bg-[#13ec6d] text-[#0b0f19] font-bold py-3 rounded-lg shadow-lg shadow-[#13ec6d]/20 hover:bg-[#13ec6d]/90 transition-all">
                        Analyze
                    </button>
                </div>

                <div className="flex flex-col rounded-xl bg-[#121a2a] p-4 border border-[#1e293b] shadow-lg">
                    <div className="flex items-start justify-between mb-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Analysis Status</p>
                    </div>
                    <div className="mt-auto">
                        <p className="text-sm font-bold text-slate-300">
                            Coming Next: Skill analysis engine integration.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Pending logic core hooks...</p>
                    </div>
                </div>
            </div>

            {/* Skills Breakdown - Static for now since Engine hook is pending */}
            <div className="space-y-4 opacity-50 relative pointer-events-none">

                <div className="rounded-xl bg-[#121a2a] p-5 border border-[#1e293b]">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle size={18} className="text-[#13ec6d]" />
                        <h3 className="text-sm font-bold text-white">Matched Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {profile?.skills?.length ? (
                            profile.skills.map(skill => <SkillChip key={skill} label={skill} type="matched" />)
                        ) : (
                            <p className="text-xs text-slate-500">No profile skills tracked yet...</p>
                        )}
                    </div>
                </div>

                <div className="rounded-xl bg-[#121a2a] p-5 border border-[#ef4444]/20 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#ef4444]/5 blur-2xl pointer-events-none" />
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                        <AlertTriangle size={18} className="text-[#ef4444]" />
                        <h3 className="text-sm font-bold text-white">Missing Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 relative z-10">
                        {['Unknown (Analysis pending)'].map(skill => (
                            <SkillChip key={skill} label={skill} type="missing" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
