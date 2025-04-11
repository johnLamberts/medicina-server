"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomAvatarImage = void 0;
const getRandomAvatarImage = () => {
    const avatarImage = [
        `https://api.dicebear.com/9.x/adventurer/svg?seed=Liliana`,
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Chase",
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Jocelyn",
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Riley",
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Leah",
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Kingston",
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Easton",
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Kimberly",
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Amaya",
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Emery",
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Adrian",
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Vivian",
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Maria",
        "https://api.dicebear.com/9.x/adventurer/svg?seed=Leo",
    ];
    const randomIndex = Math.floor(Math.random() * avatarImage.length);
    return avatarImage[randomIndex];
};
exports.getRandomAvatarImage = getRandomAvatarImage;
exports.default = exports.getRandomAvatarImage;
//# sourceMappingURL=random-avatar.utils.js.map