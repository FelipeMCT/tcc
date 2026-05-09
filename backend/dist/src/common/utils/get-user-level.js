"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserLevel = getUserLevel;
function getUserLevel(points) {
    if (points >= 500)
        return 'Diamante';
    if (points >= 250)
        return 'Ouro';
    if (points >= 100)
        return 'Prata';
    return 'Bronze';
}
//# sourceMappingURL=get-user-level.js.map