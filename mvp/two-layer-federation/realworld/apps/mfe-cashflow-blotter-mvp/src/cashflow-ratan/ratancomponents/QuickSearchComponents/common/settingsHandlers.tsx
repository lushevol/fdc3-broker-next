import { Spin } from "antd";

export const getSelectCompMode = (config) => {
  if (config.selectMode === "multiple") {
    return {
      mode: "multiple",
      maxTagCount: "responsive",
      listHeight: 280,
    };
  }
  return {};
};

export const getNextRenderList = (
  result: { label: string; value: string }[],
  selected: { label: string; value: string }[]
) => {
  const nextList: any[] = [];
  result.forEach((item) => {
    const { value } = item;
    const findSelected = selected.find((sel) => sel.value == value);
    if (!findSelected) {
      nextList.push(item);
    }
  });
  return selected.concat(nextList);
};

export const getRemarkElement = (str: string, searchName: string) => {
  return str.localeCompare(searchName, undefined, { sensitivity: "base" }) ==
    0 ? (
    <mark>{str}</mark>
  ) : (
    str
  );
};

export const getNotFoundContent = (fetching: boolean) => {
  return fetching ? <Spin size="small" /> : null;
};
