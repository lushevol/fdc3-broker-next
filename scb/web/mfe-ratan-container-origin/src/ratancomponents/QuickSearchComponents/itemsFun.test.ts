import {debounceFindConterparty, debounceGetDynamicList, getDynamicListForPortfolio} from "./itemsFun";
import {
  queryCounterpartyDynamicList,
  queryFetchPortfolio,
} from "../../ratanutils/http/graphql";
import exp from "constants";

jest.mock("../../ratanutils/http/graphql",()=>{
  const queryCounterpartyDynamicList= jest.fn();
  const queryFetchPortfolio = jest.fn()
  return {
    queryCounterpartyDynamicList,
    queryFetchPortfolio
  }
})

describe("Items Functions", ()=>{
  it("getDynamicListForPortfolio default", async ()=>{
    const callback = jest.fn();
    const messageApi = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    };
    const promiseProtfolioList = Promise.resolve({fetchPortfolio:[{
      Name: "Portfolio"
    }]});
    jest.mocked(queryFetchPortfolio).mockImplementation((searchName)=>{
      return promiseProtfolioList
    })
    getDynamicListForPortfolio("test","portfolio",callback,messageApi);
    await promiseProtfolioList;
    expect(queryFetchPortfolio).toBeCalledWith("test");
  })

  it("getDynamicListForPortfolio no found", async ()=>{
    const callback = jest.fn();
    const messageApi = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    };
    const promiseProtfolioList = Promise.resolve({fetchPortfolio:[]});
    jest.mocked(queryFetchPortfolio).mockImplementation((searchName)=>{
      return promiseProtfolioList
    })
    getDynamicListForPortfolio("test","portfolio",callback,messageApi, "portfolio");
    await promiseProtfolioList;
    expect(queryFetchPortfolio).toBeCalledWith("test");
    expect(messageApi.info).toBeCalledWith("[portfolio] No data found")

  });

  it("getDynamicListForPortfolio no input", async ()=>{
    const callback = jest.fn();
    const messageApi = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    };
    const promiseProtfolioList = Promise.resolve({fetchPortfolio:[]});
    jest.mocked(queryFetchPortfolio).mockImplementation((searchName)=>{
      return promiseProtfolioList
    })
    getDynamicListForPortfolio("","portfolio",callback,messageApi);
    await promiseProtfolioList;
    expect(queryFetchPortfolio).toBeCalledWith("test");
    expect(callback).toBeCalledWith([])

  })

  it("getDynamicListForPortfolio error", async ()=>{
    const callback = jest.fn();
    const messageApi = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    };
    try {
      const promiseProtfolioList = Promise.reject({message: "err"});
      jest.mocked(queryFetchPortfolio).mockImplementation((searchName)=>{
        return promiseProtfolioList
      })
      getDynamicListForPortfolio("test","portfolio",callback,messageApi);
      await promiseProtfolioList;
      expect(queryFetchPortfolio).toBeCalledWith("test");
      expect(messageApi.error).toBeCalledWith("err")
    } catch(e) { }
    

  })

  it("getDynamicListForPortfolio no input", async ()=>{
    const callback = jest.fn();
    const messageApi = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    };
    getDynamicListForPortfolio("1","portfolio",callback,messageApi);
    expect(callback).toBeCalledWith([]);
    expect(messageApi.info).toBeCalledWith("Please input more than two characters !")

  })

  it("debounceGetDynamicList for error", async ()=>{
    const callback = jest.fn();
    const messageApi = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    };
    try {
      const promiseCptyDynList = Promise.reject();
      jest.mocked(queryCounterpartyDynamicList).mockImplementation((fieldName, searchName)=>{
        return promiseCptyDynList
      })
      debounceGetDynamicList("test","fm_profile_sys_gen_id",callback,messageApi,"test");
      await promiseCptyDynList;
      expect(queryCounterpartyDynamicList).toBeCalledWith("fm_profile_sys_gen_id", "test");
      expect(callback).toBeCalledWith([])
    } catch (e) { }
    
  })
  it("debounceGetDynamicList for no data", async ()=>{
    const callback = jest.fn();
    const messageApi = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    };
    const promiseCptyDynList = Promise.resolve({referenceData:[]});
    jest.mocked(queryCounterpartyDynamicList).mockImplementation((fieldName, searchName)=>{
      return promiseCptyDynList
    })
    debounceGetDynamicList("test","fm_profile_sys_gen_id",callback,messageApi,"test");
    await promiseCptyDynList;
    expect(queryCounterpartyDynamicList).toBeCalledWith("fm_profile_sys_gen_id", "test");
    expect(callback).toBeCalledWith([])
  })
  it("debounceGetDynamicList for no search", async ()=>{
    const callback = jest.fn();
    const messageApi = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    };

    debounceGetDynamicList("","fm_profile_sys_gen_id",callback,messageApi,"test");
    expect(callback).toBeCalledWith([])
  })
  it("debounceGetDynamicList for fm_profile_sys_gen_id", async ()=>{
    const callback = jest.fn();
    const messageApi = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    };
    const promiseCptyDynList = Promise.resolve({referenceData:[{
      fm_profile_sys_gen_id: "fm_profile_sys_gen_id"
    }]});
    jest.mocked(queryCounterpartyDynamicList).mockImplementation((fieldName, searchName)=>{
      return promiseCptyDynList
    })
    debounceGetDynamicList("test","fm_profile_sys_gen_id",callback,messageApi ,"test");
    await promiseCptyDynList;
    expect(queryCounterpartyDynamicList).toBeCalledWith("fm_profile_sys_gen_id", "test");
    expect(callback).toBeCalledWith([{label:"fm_profile_sys_gen_id",value: "fm_profile_sys_gen_id"}])
  })
  it("debounceGetDynamicList for lmp_long_name", async ()=>{
    const callback = jest.fn();
    const messageApi = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    };
    const promiseCptyDynList = Promise.resolve({referenceData:[{
      lmp_long_name: "long_name"
    }]});
    jest.mocked(queryCounterpartyDynamicList).mockImplementation((fieldName, searchName)=>{
      return promiseCptyDynList
    })
    debounceGetDynamicList("test","lmp_long_name",callback,messageApi,"test");
    await promiseCptyDynList;
    expect(queryCounterpartyDynamicList).toBeCalledWith("lmp_long_name", "test");
    expect(callback).toBeCalledWith([{label:"long_name",value: "long_name"}])
  })

  it("debounceGetDynamicList for lmp_long_name 1 input", async ()=>{
    const callback = jest.fn();
    const messageApi = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    };
    const promiseCptyDynList = Promise.resolve({referenceData:[{
      lmp_long_name: "long_name"
    }]});
    jest.mocked(queryCounterpartyDynamicList).mockImplementation((fieldName, searchName)=>{
      return promiseCptyDynList
    })
    debounceGetDynamicList("t","lmp_long_name",callback,messageApi ,"test");
    await promiseCptyDynList;
    expect(queryCounterpartyDynamicList).toBeCalledWith("lmp_long_name", "test");
    expect(callback).toBeCalledWith([]);
    expect(messageApi.info).toBeCalledWith("Please input more than two characters !")
  })

  it("debounceFindConterparty fmId", async ()=>{
    const promiseCpty = Promise.resolve([{fmId: "0", counterpartyLongName: "test"}])
    const queryFn = jest.fn(()=>promiseCpty)
    const promiseImport = Promise.resolve({
      TradeApi: {
        queryConterParty: queryFn
      }
    });
    const messageApi = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    };
    
    jest.spyOn(System, "import").mockImplementation(()=>promiseImport)
    const callback = jest.fn()
    debounceFindConterparty("test", "fmId", callback, messageApi,"test");
    await promiseImport;
    await promiseCpty;
    expect(queryFn).toBeCalledWith("test");
    expect(callback).toBeCalledWith([{label: "0 | test", value: "0"}])
  });

  it("debounceFindConterparty other field as value", async ()=>{
    const promiseCpty = Promise.resolve([{fmId: "0", counterpartyLongName: "test", other: "other"}])
    const queryFn = jest.fn(()=>promiseCpty)
    const promiseImport = Promise.resolve({
      TradeApi: {
        queryConterParty: queryFn
      }
    });
    
    jest.spyOn(System, "import").mockImplementation(()=>promiseImport)
    const callback = jest.fn()
    const messageApi = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    };
    debounceFindConterparty("test", "other", callback, messageApi, "test");
    await promiseImport;
    await promiseCpty;
    expect(queryFn).toBeCalledWith("test");
    expect(callback).toBeCalledWith([{label: "0 | test", value: "other"}])
  })

  
})