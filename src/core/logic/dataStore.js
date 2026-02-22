import roles from "../data/roles.v1.json";
import skills from "../data/skills.v1.json";
import rolesDataset from "./rolesDataset"; // fallback

export function getAllRoles() {
    return (roles && roles.length > 0) ? roles : rolesDataset;
}

export function getAllSkills() {
    return skills || [];
}

export function findRoles(query) {
    const allRoles = getAllRoles();
    if (!query || !query.trim()) return allRoles;

    const q = query.toLowerCase().trim();
    const matches = allRoles.filter(r => {
        if (r.roleName && r.roleName.toLowerCase().includes(q)) return true;
        if (r.aliases && r.aliases.some(a => a.toLowerCase().includes(q))) return true;
        return false;
    });
    return matches.slice(0, 10);
}
