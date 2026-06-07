import { useEffect, useMemo, useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import { RuleGroupType } from "react-querybuilder";
import { initialQuery } from "../../ReactQueryBuilder";
import { dehydrate, hydrate } from "../../ReactQueryBuilder/utils";
import { DEFAULT_CREATING_FILTER_KEY } from "../common/const";
import {
  CreateFilter,
  DeleteFilter,
  FilterRecord,
  SaveFilter,
  ShadowFilterRecord,
} from "../common/types";
import { generateTemplateFilterRecord } from "../common/utiles";
import { useFilterBuilderContext } from "./useContext";
import { message } from "antd";

export const Filter2Shadow = (f: FilterRecord): ShadowFilterRecord => {
  return {
    ...f,
    body: hydrate(f.body),
  };
};

export const Shadow2Filter = (f: ShadowFilterRecord): FilterRecord => {
  return {
    ...f,
    body: dehydrate(f.body),
  };
};

export const useDisplayFilter = ({
  appliedFilter,
  setFilterList,
  deleteFilter,
  saveFilter,
  createFilter,
}: {
  appliedFilter: FilterRecord | null;
  setFilterList: (
    f: FilterRecord[] | ((r: FilterRecord[]) => FilterRecord[])
  ) => void;
  deleteFilter: DeleteFilter;
  saveFilter: SaveFilter;
  createFilter: CreateFilter;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [fetchingLatest, setFetchingLatest] = useState(false);
  const { displayFilter, setDisplayFilter, onSelectFilter, onApplyFilter } =
    useFilterBuilderContext();
  const [shadowDisplayFilter, setShadowDisplayFilter] =
    useState<ShadowFilterRecord>(Filter2Shadow(displayFilter));
  const [messageApi, MessageContext] = message.useMessage();

  const isDisplayFilterModifying = useMemo(() => {
    const res = Object.keys(displayFilter).find(
      (k) => displayFilter[k] !== shadowDisplayFilter[k]
    );
    return !!res;
  }, [displayFilter, shadowDisplayFilter]);

  const isOnNewFilterTab = useMemo(() => {
    return displayFilter.rowKey === DEFAULT_CREATING_FILTER_KEY;
  }, [displayFilter]);

  const handleDisplayFilterCreateNew = () => {
    const newFilter = generateTemplateFilterRecord();
    handleDisplayFilterChange(newFilter);
  };

  useEffect(() => {
    if (appliedFilter === null) handleDisplayFilterCreateNew();
  }, [appliedFilter]);

  const handleDisplayFilterChange = async (f: FilterRecord) => {
    if (f.rowKey === appliedFilter?.rowKey) {
      f = appliedFilter;
    }
    if (!f.body) setFetchingLatest(true);
    setShadowDisplayFilter(Filter2Shadow(f));
    const latestFilter = await onSelectFilter(f);
    if (latestFilter) setShadowDisplayFilter(Filter2Shadow(latestFilter));
    setFetchingLatest(false);
  };

  const handleShadowDisplayFilterUpdate = (props: {
    name?: string;
    isPublic?: boolean;
  }) => {
    setShadowDisplayFilter((f) => ({
      ...f,
      ...props,
    }));
  };

  const handleShadowDisplayFilterBodyUpdate = (query: RuleGroupType) => {
    setShadowDisplayFilter((f) => ({ ...f, body: query }));
  };

  const handleApplyFilter = async (f: FilterRecord) => {
    try {
      setIsProcessing(true);
      await onApplyFilter(f);
    } catch (error) {
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisplayFilterSave = async () => {
    try {
      if (
        !shadowDisplayFilter.name ||
        shadowDisplayFilter.body.rules.length === 0
      )
        return;
      setIsProcessing(true);
      let filter = Shadow2Filter(shadowDisplayFilter);
      if (shadowDisplayFilter.rowKey === DEFAULT_CREATING_FILTER_KEY) {
        filter = await createFilter?.(filter);
        setFilterList((fs) => [...fs, filter]);
      } else {
        filter = await saveFilter?.(filter);
        setFilterList((fs) => {
          const copy = cloneDeep(fs) as FilterRecord[];
          const targetIndex = copy.findIndex((f) => f.rowKey === filter.rowKey);
          copy[targetIndex] = filter;
          return copy;
        });
      }
      messageApi.success("Filter Saved !");
      setDisplayFilter(filter);
      setShadowDisplayFilter(Filter2Shadow(filter));
    } catch (error) {
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisplayFilterDelete = async () => {
    try {
      setIsProcessing(true);
      await deleteFilter?.(displayFilter);
      messageApi.success("Filter Deleted !");
      setFilterList((fs) =>
        fs.filter((f) => f.rowKey !== displayFilter.rowKey)
      );
      handleDisplayFilterCreateNew();
    } catch (error) {
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisplayFilterClearBody = () => {
    handleShadowDisplayFilterBodyUpdate(initialQuery);
  };

  const handleDisplayFilterReset = () => {
    setShadowDisplayFilter(Filter2Shadow(displayFilter));
  };

  const handleDuplicateFilter = () => {
    const filter = Shadow2Filter(shadowDisplayFilter);
    const newFilter = generateTemplateFilterRecord();
    newFilter.name = `${filter.name} (Copy)`;
    newFilter.body = filter.body;
    setShadowDisplayFilter(Filter2Shadow(newFilter));
    setDisplayFilter(newFilter);
  };

  return {
    isProcessing,
    fetchingLatest,
    displayFilter,
    shadowDisplayFilter,
    isDisplayFilterModifying,
    isOnNewFilterTab,
    handleApplyFilter,
    handleDisplayFilterCreateNew,
    handleDisplayFilterChange,
    handleShadowDisplayFilterUpdate,
    handleShadowDisplayFilterBodyUpdate,
    handleDisplayFilterSave,
    handleDisplayFilterDelete,
    handleDisplayFilterClearBody,
    handleDisplayFilterReset,
    handleDuplicateFilter,
    MessageContext,
  };
};
