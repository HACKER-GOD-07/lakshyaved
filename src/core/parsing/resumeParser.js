export function normalizeText(text) {
    if (!text) return '';
    return text.toLowerCase().replace(/[^a-z0-9+# \n]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function extractSkillsFromText(text, rolesDataset) {
    if (!text || !rolesDataset) return [];

    // Create a set of all possible skills across all roles to match against
    const allKnownSkills = new Set();
    rolesDataset.forEach(role => {
        if (role.requiredSkills) {
            role.requiredSkills.forEach(s => allKnownSkills.add(s));
        }
    });

    const normalized = normalizeText(text);
    const foundSkills = [];

    for (const skill of allKnownSkills) {
        const normSkill = normalizeText(skill);

        let isMatch = false;
        const paddedText = ` ${normalized} `;
        const paddedSkill = ` ${normSkill} `;

        if (paddedText.includes(paddedSkill)) {
            isMatch = true;
        } else {
            // Also try a raw include for things like "c++"
            if (normalized.includes(normSkill)) {
                // simple boundary
                const idx = normalized.indexOf(normSkill);
                const before = idx > 0 ? normalized[idx - 1] : ' ';
                const after = idx + normSkill.length < normalized.length ? normalized[idx + normSkill.length] : ' ';
                if (before === ' ' && after === ' ') {
                    isMatch = true;
                }
            }
        }

        if (isMatch) {
            foundSkills.push(skill);
        }
    }

    return foundSkills;
}
