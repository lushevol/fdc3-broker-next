import { memo, Profiler, useState, useMemo } from "react";
import { MuiDialog } from "../../Dialog/indexMuiV1";
import {
  CreateFilter,
  DeleteFilter,
  FilterRecord,
  QueryFilterDetails,
  QueryFilterList,
  SaveFilter,
} from "./common/types";
import { EntrySelector } from "./components/EntrySelector";
import MainPanel from "./components/MainPanel";
import {
  AdvancedSearchStaticContext,
  AdvancedSearchContext,
} from "./hooks/useContext";
import { generateTemplateFilterRecord } from "./common/utiles";
import { RatanFieldConfig, RatanRawFieldConfig } from "../RatanOne/type";
import type { DefaultOperator } from "react-querybuilder";
import type { Mode } from "../ReactQueryBuilder/types";

export type AdvancedSearchProps = {
  fields: RatanRawFieldConfig[];
  type: string;
  filterMode?: Mode;
  appliedFilter: FilterRecord | null;
  setAppliedFilter: (f: FilterRecord | null) => Promise<void>;
  queryFilterList: QueryFilterList;
  queryFilterDetails: QueryFilterDetails;
  createFilter: CreateFilter;
  saveFilter: SaveFilter;
  deleteFilter: DeleteFilter;
  getOperators: (field: RatanFieldConfig) => DefaultOperator[];
};

const AdvancedSearch = memo(
  ({
    fields = [],
    filterMode,
    type = "",
    appliedFilter = null,
    setAppliedFilter,
    queryFilterList,
    queryFilterDetails,
    createFilter,
    saveFilter,
    deleteFilter,
    getOperators,
  }: AdvancedSearchProps) => {
    const [displayFilter, setDisplayFilter] = useState(
      generateTemplateFilterRecord()
    );
    const [filterList, setFilterList] = useState<FilterRecord[]>([]);
    const [open, setOpen] = useState(false);

    const handleClose = () => {
      setOpen(false);
    };

    const handleOpen = () => {
      if (appliedFilter) setDisplayFilter(appliedFilter);
      setOpen(true);
    };

    const staticContextValue = useMemo(() => {
      return {
        fields,
        filterMode,
        type,
        queryFilterList,
        queryFilterDetails,
        createFilter,
        saveFilter,
        deleteFilter,
        getOperators,
      };
    }, [
      fields,
      filterMode,
      type,
      queryFilterList,
      queryFilterDetails,
      createFilter,
      saveFilter,
      deleteFilter,
      getOperators,
    ]);

    const contextValue = useMemo(() => {
      return {
        appliedFilter,
        setAppliedFilter,
        displayFilter,
        setDisplayFilter,
        filterList,
        setFilterList,
      };
    }, [
      appliedFilter,
      setAppliedFilter,
      displayFilter,
      setDisplayFilter,
      filterList,
      setFilterList,
    ]);
    return (
      <AdvancedSearchStaticContext.Provider value={staticContextValue}>
        <AdvancedSearchContext.Provider value={contextValue}>
          <EntrySelector onOpenSetting={() => handleOpen()} />
          <MuiDialog
            title="Custom Search"
            open={open}
            onClose={handleClose}
            height={700}
            width={1100}
          >
            <MainPanel />
          </MuiDialog>
        </AdvancedSearchContext.Provider>
      </AdvancedSearchStaticContext.Provider>
    );
  }
);

export default AdvancedSearch;
