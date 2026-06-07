import { Stack } from "@mui/material";
import { isEmpty } from "Import/ratanutils";
import { FC } from "react";

import { ExceptionCategory, ExceptionItem } from "../../common/interface";
import { CommonExceptionsProps } from "./interface";
import CommonExceptionItem from "./item";
import StyledRoot, { classes } from "./style";

export const highPriorityCategories = [
  ExceptionCategory.HIGH_RISK_NSTP,
  ExceptionCategory.HARD_BLOCKER,
];

type ExceptionCategoryDTO = string | null | undefined | ExceptionCategory;

/**
 * to keep the type safety for exception category
 * return true means value is ExceptionCategory
 * return false means value is not ExceptionCategory
 */
export const isExceptionCategory = (value: any): value is ExceptionCategory => {
  return Object.values(ExceptionCategory).includes(value);
};
/**
 * to check if the exception category is high priority
 */
export const isHighPriority = (cat: ExceptionCategoryDTO): boolean => {
  if (isEmpty(cat)) return false;
  if (!isExceptionCategory(cat)) return false;
  return highPriorityCategories.includes(cat);
};

export const commonRiskFirst = (a: ExceptionItem, b: ExceptionItem) => {
  const aIsHigh = isHighPriority(a.Exception_Category);
  const bIsHigh = isHighPriority(b.Exception_Category);

  if (aIsHigh && !bIsHigh) return -1;
  if (!aIsHigh && bIsHigh) return 1;
  return 0;
};

const CommonExceptions: FC<CommonExceptionsProps> = ({ data }) => {
  const sortedData = data.slice().sort(commonRiskFirst);
  return (
    <StyledRoot className={classes.root}>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {sortedData.map((exp) => (
          <CommonExceptionItem key={exp.Id} {...exp} />
        ))}
      </Stack>
    </StyledRoot>
  );
};

export default CommonExceptions;
