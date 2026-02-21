import db from './db.js';

const DEFAULT_ID = 'default';

export async function saveProfile({ skills, interests, targetRole }) {
    return db.profile.put({
        id: DEFAULT_ID,
        skills,
        interests,
        targetRole,
        updatedAt: Date.now()
    });
}

export async function getProfile() {
    return db.profile.get(DEFAULT_ID);
}

export async function saveResume(rawText) {
    return db.resume.put({
        id: DEFAULT_ID,
        rawText,
        updatedAt: Date.now()
    });
}

export async function getResume() {
    return db.resume.get(DEFAULT_ID);
}

export async function saveCareerResults(projection) {
    return db.careerResults.put({
        id: DEFAULT_ID,
        projection,
        updatedAt: Date.now()
    });
}

export async function getCareerResults() {
    return db.careerResults.get(DEFAULT_ID);
}

export async function saveSkillGapResults({ targetRole, matchedSkills, missingSkills, roadmap }) {
    return db.skillGapResults.put({
        id: DEFAULT_ID,
        targetRole,
        matchedSkills,
        missingSkills,
        roadmap,
        updatedAt: Date.now()
    });
}

export async function getSkillGapResults() {
    return db.skillGapResults.get(DEFAULT_ID);
}

export async function resetAllData() {
    await Promise.all([
        db.profile.clear(),
        db.resume.clear(),
        db.careerResults.clear(),
        db.skillGapResults.clear()
    ]);
}
