import { extractSkillsFromText } from '../parsing/resumeParser';

export function analyzeSkillGap({ resumeText, targetRoleId, rolesDataset }) {
    if (!resumeText) throw new Error("Resume text is empty");
    if (!targetRoleId) throw new Error("Target role is required");
    if (!rolesDataset) throw new Error("Roles dataset is missing");

    const role = rolesDataset.find(r => r.roleId === targetRoleId);
    if (!role) throw new Error("Role not found");

    const requiredSkills = role.requiredSkills || [];
    const extractedSkills = extractSkillsFromText(resumeText, rolesDataset);

    // Make case-insensitive match maps
    const extractedMap = new Set(extractedSkills.map(s => s.toLowerCase()));

    const matchedSkills = [];
    const missingSkills = [];

    requiredSkills.forEach(reqSkill => {
        if (extractedMap.has(reqSkill.toLowerCase())) {
            matchedSkills.push(reqSkill);
        } else {
            missingSkills.push(reqSkill);
        }
    });

    const matchRate = requiredSkills.length === 0 ? 0 :
        Math.round((matchedSkills.length / requiredSkills.length) * 100);

    // Priority based roadmaps for missing skills
    const roadmap = missingSkills.map((skill, index) => {
        return {
            title: skill,
            priority: index < 2 ? 'high' : 'medium',
            steps: [
                `Find introductory courses for ${skill}`,
                `Build a small project using ${skill}`,
                `Add ${skill} to your portfolio`
            ]
        };
    });

    return {
        targetRole: role.roleName,
        targetRoleId: role.roleId,
        matchRate,
        matchedCount: matchedSkills.length,
        missingCount: missingSkills.length,
        matchedSkills,
        missingSkills,
        roadmap,
        extractedSkills
    };
}
