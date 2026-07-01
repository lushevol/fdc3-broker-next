import { defaultOperators } from "react-querybuilder";
import { getUser } from "../../../../ratanutils/authenticator";
import { DEFAULT_CREATING_FILTER_KEY } from "./const";
import { FilterRecord } from "./types";

export const generateTemplateFilterRecord = (): FilterRecord => {
  const { id } = getUser();
  return {
    rowKey: DEFAULT_CREATING_FILTER_KEY,
    name: "",
    body: "",
    owner: id,
    creator: id,
    type: "",
    isPublic: false,
    moduleOwner: "",
    assignee: "",
    assigneeList: "",
    updateFlag: "",
  };
};

export const defaultGetOperators = () => {
  return [...defaultOperators.filter((op) => ["="].includes(op.name))];
};
