import Dexie from 'dexie';

const db = new Dexie('lakshyaved_db');

db.version(1).stores({
    profile: 'id', // id (string), skills (string[]), interests (string[]), targetRole (string), updatedAt (number)
    resume: 'id', // id (string), rawText (string), updatedAt (number)
    careerResults: 'id', // id (string), projection (array), updatedAt (number)
    skillGapResults: 'id' // id (string), targetRole (string), matchedSkills (string[]), missingSkills (string[]), roadmap (array), updatedAt (number)
});

export default db;
