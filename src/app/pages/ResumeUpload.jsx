import { useState, useEffect } from 'react';
import { saveResume, getResume } from '../../core/db/repo';
import { extractSkillsFromText } from '../../core/parsing/resumeParser';
import rolesDataset from '../../core/logic/rolesDataset';

export default function ResumeUpload() {
    const [text, setText] = useState('');
    const [status, setStatus] = useState('');
    const [previewSkills, setPreviewSkills] = useState([]);

    useEffect(() => {
        const loadResume = async () => {
            const dbResume = await getResume();
            if (dbResume && dbResume.rawText) {
                setText(dbResume.rawText);
                updatePreview(dbResume.rawText);
            }
        };
        loadResume();
    }, []);

    const updatePreview = (t) => {
        const skills = extractSkillsFromText(t, rolesDataset);
        setPreviewSkills(skills);
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
        updatePreview(e.target.value);
    }

    const handleSave = async () => {
        try {
            await saveResume(text);
            setStatus('Resume saved to offline DB successfully!');
            setTimeout(() => setStatus(''), 3000);
        } catch (err) {
            setStatus(`Error: ${err.message}`);
        }
    };

    const handleLoad = async () => {
        const dbResume = await getResume();
        if (dbResume && dbResume.rawText) {
            setText(dbResume.rawText);
            updatePreview(dbResume.rawText);
            setStatus('Resume loaded from DB!');
            setTimeout(() => setStatus(''), 3000);
        } else {
            setStatus('No resume found in DB.');
            setTimeout(() => setStatus(''), 3000);
        }
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Resume Upload</h1>
                <p className="text-slate-400 mt-1">Paste your resume text below for processing. (PDF parsing coming soon!)</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-[#121a2a] rounded-xl p-6 border border-[#1e293b] lg:col-span-2 shadow-lg">
                    <textarea
                        className="w-full h-80 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-300 focus:outline-none focus:border-[#13ec6d] font-mono text-sm resize-y"
                        placeholder="Paste your resume content in raw text here..."
                        value={text}
                        onChange={handleTextChange}
                    />

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                        <button
                            onClick={handleSave}
                            className="bg-[#13ec6d] text-[#0b0f19] font-bold px-6 py-2.5 rounded-lg hover:bg-[#13ec6d]/90 transition-colors"
                        >
                            Save to Database
                        </button>
                        <button
                            onClick={handleLoad}
                            className="bg-slate-800 text-white font-bold px-6 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"
                        >
                            Reload from DB
                        </button>
                        {status && <span className="text-sm font-medium text-emerald-400">{status}</span>}
                    </div>
                </div>

                <div className="bg-[#121a2a] rounded-xl p-6 border border-[#1e293b] shadow-lg">
                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Live Preview (Skills Detected)</h3>
                    {previewSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {previewSkills.map(s => (
                                <span key={s} className="px-2 py-1 bg-[#13ec6d]/10 text-[#13ec6d] rounded text-xs font-semibold border border-[#13ec6d]/20">
                                    {s}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="text-slate-500 text-sm text-center py-8">
                            No skills detected yet. Paste resume text to begin.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
