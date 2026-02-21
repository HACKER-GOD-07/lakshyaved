import { useState, useEffect } from 'react';
import { saveResume, getResume } from '../../core/db/repo';

export default function ResumeUpload() {
    const [text, setText] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const loadResume = async () => {
            const dbResume = await getResume();
            if (dbResume && dbResume.rawText) {
                setText(dbResume.rawText);
            }
        };
        loadResume();
    }, []);

    const handleSave = async () => {
        try {
            await saveResume(text);
            setStatus('Resume saved to offline DB successfully!');
            setTimeout(() => setStatus(''), 3000);
        } catch (err) {
            setStatus(`Error: ${err.message}`);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Resume Upload</h1>
                <p className="text-slate-400 mt-1">Paste your resume text below for processing. (PDF parsing coming soon!)</p>
            </div>

            <div className="bg-[#121a2a] rounded-xl p-6 border border-[#1e293b]">
                <textarea
                    className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-300 focus:outline-none focus:border-[#13ec6d] font-mono text-sm resize-y"
                    placeholder="Paste your resume content in raw text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <div className="mt-4 flex items-center justify-between">
                    <button
                        onClick={handleSave}
                        className="bg-[#13ec6d] text-[#0b0f19] font-bold px-6 py-2.5 rounded-lg hover:bg-[#13ec6d]/90 transition-colors"
                    >
                        Save to Database
                    </button>
                    {status && <span className="text-sm font-medium text-emerald-400">{status}</span>}
                </div>
            </div>
        </div>
    );
}
