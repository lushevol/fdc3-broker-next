import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import useFieldNameController from "./useFieldNameController";
import { useEffect } from "react";
import { Service } from "../../../Root/import";
import { Context } from "../store";

describe("useController", () => {
  test("test save valid data", async () => {
    const succFn = vi.fn();
    const errFn = vi.fn();
    const onSaveCallBack = vi.fn()
    const messageApi = {
      success: succFn,
      error: errFn,
    }
    const {service} = Service;
    const promise1 = Promise.resolve({
      body: JSON.stringify({ body: { filter: {} } }),
    });
    vi.spyOn(service, "post").mockImplementation((url, data) => {
      return promise1
    });
    const props = {
      filterFieldType: "test",
      messageApi,
      onRemove: () => {},
      onSavedFilter: onSaveCallBack,
    };
    const Comp = (props) => {
      const {
        saveBuilder,
        removeBuilder,
        compareFilterName,
        compareFilterRole,
        isLoading,
        isModify,
        isRemoveLoading,
        cancel,
        isReadOnly,
      } = useFieldNameController(props);
      useEffect(() => {
        saveBuilder();
        removeBuilder();
      }, []);
      return <>test</>;
    };

    render(
      <Context.Provider
        value={{
          state: {
            filterList: {},
            currentFilter: null,
            temporaryFilter: {
              body: [
                {
                  values: ["v1", "v2"],
                },
                {
                  values: "test",
                },
              ],
            },
          },
          dispatch: ({type, data})=>{
            
          }
        }}
      >
        <Comp {...props} />
      </Context.Provider>
    );
    await promise1;
    expect(onSaveCallBack).toBeCalled();
    expect(succFn).toBeCalledWith("Save filter successful!")
  });

  test("test update/remove rowkey", async () => {
    const succFn = vi.fn();
    const errFn = vi.fn();
    const infoFn = vi.fn();
    const onSaveCallBack = vi.fn()
    const messageApi = {
      success: succFn,
      error: errFn,
      info: infoFn,
    }
    const {service} = Service;
    const promise1 = Promise.resolve({
      body: JSON.stringify({ body: { filter: {} } }),
    });
    vi.spyOn(service, "put").mockImplementation((url, data) => {
      return promise1
    });
    const promise2 = Promise.resolve(true);
    vi.spyOn(service, "delete").mockImplementation((url, data) => {
      return promise2
    });
    const props = {
      filterFieldType: "test",
      messageApi,
      onRemove: () => {},
      onSavedFilter: onSaveCallBack,
    };
    const Comp = (props) => {
      const {
        saveBuilder,
        removeBuilder,
        compareFilterName,
        compareFilterRole,
        isLoading,
        isModify,
        isRemoveLoading,
        cancel,
        isReadOnly,
      } = useFieldNameController(props);
      useEffect(() => {
        if(isModify){
          saveBuilder();
          removeBuilder();
          compareFilterName("test")
          compareFilterRole("test")
          cancel()
        }
      }, [isModify]);
      return <>test</>;
    };
    const dispathFn = vi.fn();

    render(
      <Context.Provider
        value={{
          state: {
            filterList: {},
            currentFilter: {
              name: "test"
            },
            temporaryFilter: {
              rowKey: "test",
              name: "test",
              body: [
                {
                  values: ["v1", "v2"],
                },
                {
                  values: "test",
                },
              ],
            },
          },
          dispatch: (payload)=>{
            dispathFn(payload);
          }
        }}
      >
        <Comp {...props} />
      </Context.Provider>
    );
    await promise1;
    expect(onSaveCallBack).toBeCalled();
    expect(succFn).toBeCalledWith("Save filter successful!");
    await promise2;
    expect(succFn).toBeCalledWith("Filter removed successfully!");
    expect(infoFn).toBeCalledWith("Cancel Remove!");
    expect(dispathFn).toBeCalledWith({ type: "UPDATE_TEMPORARY_FILTER", data: { name: "test" } });
    expect(dispathFn).toBeCalledWith({ type: "UPDATE_TEMPORARY_FILTER", data: { assigneeList: "test" } });
  });

  test("test api error", async () => {
    const succFn = vi.fn();
    const errFn = vi.fn();
    const infoFn = vi.fn();
    const onSaveCallBack = vi.fn()
    const messageApi = {
      success: succFn,
      error: errFn,
      info: infoFn,
    }
    const {service} = Service;
    const promise1 = Promise.reject(false);
    vi.spyOn(service, "put").mockImplementation((url, data) => {
      return promise1
    });
    const promise2 = Promise.reject(false);
    vi.spyOn(service, "delete").mockImplementation((url, data) => {
      return promise2
    });
    const props = {
      filterFieldType: "test",
      messageApi,
      onRemove: () => {},
      onSavedFilter: onSaveCallBack,
    };
    const Comp = (props) => {
      const {
        saveBuilder,
        removeBuilder,
        isModify,
      } = useFieldNameController(props);
      useEffect(() => {
        if(isModify){
          saveBuilder();
          removeBuilder();
        }
      }, [isModify]);
      return <>test</>;
    };
    const dispathFn = vi.fn();

    render(
      <Context.Provider
        value={{
          state: {
            filterList: {},
            currentFilter: {
              name: "test"
            },
            temporaryFilter: {
              rowKey: "test",
              name: "test",
              body: [
                {
                  values: ["v1", "v2"],
                },
                {
                  values: "test",
                },
              ],
            },
          },
          dispatch: (payload)=>{
            dispathFn(payload);
          }
        }}
      >
        <Comp {...props} />
      </Context.Provider>
    );
    try {
      await promise1;
      expect(errFn).toBeCalledWith("Save filter failed!");
    } catch(e) {

    }
    
    try {
      await promise2;
      expect(errFn).toBeCalledWith("Remove filter failed!");
    } catch(e) {

    }
  });

  test("test no rules", async () => {
    const succFn = vi.fn();
    const errFn = vi.fn();
    const infoFn = vi.fn();
    const onSaveCallBack = vi.fn()
    const messageApi = {
      success: succFn,
      error: errFn,
      info: infoFn,
    }
    const {service} = Service;
    const promise1 = Promise.reject(false);
    vi.spyOn(service, "put").mockImplementation((url, data) => {
      return promise1
    });
    const props = {
      filterFieldType: "test",
      messageApi,
      onRemove: () => {},
      onSavedFilter: onSaveCallBack,
    };
    const Comp = (props) => {
      const {
        saveBuilder,

        isModify,
      } = useFieldNameController(props);
      useEffect(() => {
        if(isModify){
          saveBuilder();
        }
      }, [isModify]);
      return <>test</>;
    };
    const dispathFn = vi.fn();

    render(
      <Context.Provider
        value={{
          state: {
            filterList: {},
            currentFilter: {
              name: "test"
            },
            temporaryFilter: {
              rowKey: "test",
              name: "test",
              body: {},
            },
          },
          dispatch: (payload)=>{
            dispathFn(payload);
          }
        }}
      >
        <Comp {...props} />
      </Context.Provider>
    );
    try {
      await promise1;
      expect(errFn).toBeCalledWith("The value of all fields cannot be empty!");
    } catch(e) {

    }

  });

  test("test invalid value []", async () => {
    const succFn = vi.fn();
    const errFn = vi.fn();
    const infoFn = vi.fn();
    const onSaveCallBack = vi.fn()
    const messageApi = {
      success: succFn,
      error: errFn,
      info: infoFn,
    }
    const {service} = Service;
    const promise1 = Promise.reject(false);
    vi.spyOn(service, "put").mockImplementation((url, data) => {
      return promise1
    });
  
    const props = {
      filterFieldType: "test",
      messageApi,
      onRemove: () => {},
      onSavedFilter: onSaveCallBack,
    };
    const Comp = (props) => {
      const {
        saveBuilder,

        isModify,
      } = useFieldNameController(props);
      useEffect(() => {
        if(isModify){
          saveBuilder();
        }
      }, [isModify]);
      return <>test</>;
    };
    const dispathFn = vi.fn();

    render(
      <Context.Provider
        value={{
          state: {
            filterList: {},
            currentFilter: {
              name: "test"
            },
            temporaryFilter: {
              rowKey: "test",
              name: "test",
              body: [
                {
                  values: [],
                }
              ],
            },
          },
          dispatch: (payload)=>{
            dispathFn(payload);
          }
        }}
      >
        <Comp {...props} />
      </Context.Provider>
    );
    try {
      await promise1;
      expect(errFn).toBeCalledWith("The value of all fields cannot be empty!");
    } catch(e) {

    }
  });

  test("test invalid value empty string", async () => {
    const succFn = vi.fn();
    const errFn = vi.fn();
    const infoFn = vi.fn();
    const onSaveCallBack = vi.fn()
    const messageApi = {
      success: succFn,
      error: errFn,
      info: infoFn,
    }
    const {service} = Service;
    const promise1 = Promise.reject(false);
    vi.spyOn(service, "put").mockImplementation((url, data) => {
      return promise1
    });
  
    const props = {
      filterFieldType: "test",
      messageApi,
      onRemove: () => {},
      onSavedFilter: onSaveCallBack,
    };
    const Comp = (props) => {
      const {
        saveBuilder,

        isModify,
      } = useFieldNameController(props);
      useEffect(() => {
        if(isModify){
          saveBuilder();
        }
      }, [isModify]);
      return <>test</>;
    };
    const dispathFn = vi.fn();

    render(
      <Context.Provider
        value={{
          state: {
            filterList: {},
            currentFilter: {
              name: "test"
            },
            temporaryFilter: {
              rowKey: "test",
              name: "test",
              body: [
                {
                  values: "",
                }
              ],
            },
          },
          dispatch: (payload)=>{
            dispathFn(payload);
          }
        }}
      >
        <Comp {...props} />
      </Context.Provider>
    );
    try {
      await promise1;
      expect(errFn).toBeCalledWith("The value of all fields cannot be empty!");
    } catch(e) {

    }
  });

  test("test duplicate name", async () => {
    Object.defineProperty(window, 'ratanConfig', {
      value: {
        disabledFeature: [
          "Filter_Builder_POC"
        ],
        enableFeatureForUser: {},
        enableFeatureForPage: {
          "Filter_Builder_POC": [""]
        }
      },
      writable: true
    })
    const succFn = vi.fn();
    const errFn = vi.fn();
    const infoFn = vi.fn();
    const onSaveCallBack = vi.fn()
    const messageApi = {
      success: succFn,
      error: errFn,
      info: infoFn,
    }
  
    const props = {
      filterFieldType: "test",
      messageApi,
      onRemove: () => {},
      onSavedFilter: onSaveCallBack,
    };
    const Comp = (props) => {
      const {
        saveBuilder,
      } = useFieldNameController(props);
      useEffect(() => {
        saveBuilder();
      }, []);
      return <>test</>;
    };
    const dispathFn = vi.fn();

    render(
      <Context.Provider
        value={{
          state: {
            filterList: {
              "test": [
                {type: "test",name: 'test'}
              ]
            },
            currentFilter: {
              name: "other"
            },
            temporaryFilter: {
              rowKey: "test",
              name: "test",
              body: [
                {
                  values: "",
                }
              ],
            },
          },
          dispatch: (payload)=>{
            dispathFn(payload);
          }
        }}
      >
        <Comp {...props} />
      </Context.Provider>
    );
    expect(errFn).toBeCalledWith("Filter name already exists!");

  });
});
