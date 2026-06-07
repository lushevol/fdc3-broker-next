// "Abc Def" to "abc_def"
export const plattenStr = (str: string) => {
  try {
    return str.toLowerCase().replace(/\W/g, "_");
  } catch (error) {
    return "";
  }
};
