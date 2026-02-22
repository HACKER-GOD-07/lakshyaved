import { getAllSkills } from "../logic/dataStore";

let skillMap = null;

function buildSkillMap() {
    if (skillMap) return;
    skillMap = new Map();
    const skills = getAllSkills();
    for (const skill of skills) {
        const canonical = skill.skillName;
        // Map canonical name to itself (lowercased)
        skillMap.set(canonical.toLowerCase(), canonical);

        if (skill.aliases && skill.aliases.length > 0) {
            for (const alias of skill.aliases) {
                skillMap.set(alias.toLowerCase(), canonical);
            }
        }
    }
}

export function normalizeSkillToken(token) {
    if (!token) return '';
    buildSkillMap();
    const normalizedToken = token.trim().toLowerCase();
    const canonical = skillMap.get(normalizedToken);
    return canonical ? canonical : token.trim();
}

export function normalizeSkillList(list) {
    if (!list || !Array.isArray(list)) return [];
    const normalizedSet = new Set();

    for (const item of list) {
        normalizedSet.add(normalizeSkillToken(item));
    }

    return Array.from(normalizedSet);
}
