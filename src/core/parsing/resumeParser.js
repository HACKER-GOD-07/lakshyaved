import { getAllSkills } from "../logic/dataStore";
import { normalizeSkillToken } from "./skillNormalizer";

export function normalizeText(text) {
    if (!text) return '';
    return text.toLowerCase().replace(/[^a-z0-9+# \n]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function extractSkillsFromText(text, rolesDataset) {
    if (!text) return [];

    const allSkills = getAllSkills();
    const allKnownSkills = new Set();

    // add from centralized db
    allSkills.forEach(skill => {
        if (skill.skillName) {
            allKnownSkills.add(skill.skillName);
        }
        if (skill.aliases) {
            skill.aliases.forEach(a => allKnownSkills.add(a));
        }
    });

    // fallback from dataset to not break older rolesDataset
    if (rolesDataset) {
        rolesDataset.forEach(role => {
            if (role.requiredSkills) {
                role.requiredSkills.forEach(s => allKnownSkills.add(s));
            }
        });
    }

    const normalized = normalizeText(text);
    const foundCanonicalSkills = new Set();

    for (const originalSkill of allKnownSkills) {
        const normSkill = normalizeText(originalSkill);
        if (!normSkill) continue;

        let isMatch = false;
        const paddedText = ` ${normalized} `;
        const paddedSkill = ` ${normSkill} `;

        if (paddedText.includes(paddedSkill)) {
            isMatch = true;
        } else {
            if (normalized.includes(normSkill)) {
                const idx = normalized.indexOf(normSkill);
                const before = idx > 0 ? normalized[idx - 1] : ' ';
                const after = idx + normSkill.length < normalized.length ? normalized[idx + normSkill.length] : ' ';
                if (before === ' ' && after === ' ') {
                    isMatch = true;
                }
            }
        }

        if (isMatch) {
            const canonical = normalizeSkillToken(originalSkill);
            foundCanonicalSkills.add(canonical);
        }
    }

    return Array.from(foundCanonicalSkills);
}
