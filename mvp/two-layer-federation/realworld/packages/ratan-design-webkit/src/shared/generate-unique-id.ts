export const generateUniqueId = () => Date.now().toString(36).slice(2);

export const generateRandom = () => Math.random().toString(16).substring(2, 8);

export const generateFileUniqueId = () => `${generateUniqueId()}-${generateRandom()}`;
