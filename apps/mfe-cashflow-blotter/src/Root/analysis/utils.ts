// "Abc Def" to "abc_def"
export const plattenStr = (str: string) => {
  try {
    return String.prototype.toLowerCase.call(str + "").replace(/\W/g, "_");
  } catch (error) {
    return str + "";
  }
};
