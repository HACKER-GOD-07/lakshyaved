import React, { useState } from 'react';
import { saveProfile, getProfile, resetAllData } from '../../core/db/repo';

export default function Settings() {
    const [status, setStatus] = useState('');
    const [loadedProfile, setLoadedProfile] = useState(null);

    const handleSeedProfile = async () => {
        try {
            await saveProfile({
                skills: ["Python", "SQL"],
                interests: ["AI", "Data"],
                targetRole: "ml-engineer"
            });
            setStatus('Profile seeded successfully!');
            setLoadedProfile(null);
        } catch (error) {
            setStatus(`Error seeding profile: ${error.message}`);
        }
    };

    const handleLoadProfile = async () => {
        try {
            const profile = await getProfile();
            if (profile) {
                setLoadedProfile(profile);
                setStatus('Profile loaded successfully!');
            } else {
                setLoadedProfile(null);
                setStatus('No profile found. Please seed first.');
            }
        } catch (error) {
            setStatus(`Error loading profile: ${error.message}`);
        }
    };

    const handleResetData = async () => {
        try {
            await resetAllData();
            setLoadedProfile(null);
            setStatus('All data reset successfully!');
        } catch (error) {
            setStatus(`Error resetting data: ${error.message}`);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400 mb-8">Configure your preferences and account details.</p>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-2xl">
                <h2 className="text-xl font-semibold text-white mb-4">Offline DB Test</h2>

                <div className="flex flex-wrap gap-4 mb-6">
                    <button
                        onClick={handleSeedProfile}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                    >
                        Seed Demo Profile
                    </button>
                    <button
                        onClick={handleLoadProfile}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                    >
                        Load Profile
                    </button>
                    <button
                        onClick={handleResetData}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
                    >
                        Reset All Data
                    </button>
                </div>

                {status && (
                    <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${status.includes('Error')
                            ? 'bg-red-900/50 text-red-200 border border-red-800'
                            : 'bg-emerald-900/50 text-emerald-200 border border-emerald-800'
                        }`}>
                        {status}
                    </div>
                )}

                {loadedProfile && (
                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Loaded Profile Data:</h3>
                        <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto border border-gray-700">
                            {JSON.stringify(loadedProfile, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
