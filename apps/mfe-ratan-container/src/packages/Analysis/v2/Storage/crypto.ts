export const encode = (v: string): string => {
  return btoa(v);
};

export const decode = (v: string): string => {
  return atob(v);
};
