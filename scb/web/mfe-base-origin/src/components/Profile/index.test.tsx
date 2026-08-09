import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Provider from "../../hooks/provider";
import Profile from ".";
import ThemeProvider from "../../theme";

afterAll(() => {
  jest.clearAllMocks();
});

const mockClose = jest.fn();

const waitFor = (time = 10000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time)
});

jest.mock('../../utils/locale', () => {
  return {
    DateTimeFormat: (t,v) => v,
  }
});

describe("Profile component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should trigger close function in the document", async() => {
    jest.mock('../Dialog', () => {
      return (props:any)=>{
          const { onClose, open, children, rest } = props;
          return (
            <section data-testid="mock-dialog" open={true} onClose={onClose} {...rest}>
              <button data-testid="closeDialog" onClick={onClose}/>
              {children}
            </section>
          );
        };
    });
    render(
      <Provider data={
        { user: 
          { id: "123", 
          entitlements:{
            "X_RATANONE:FMO_OPS_SUP": {
                "RATAN_NETTING_RULE": [
                    "ACCESS_FMO_POST_TRADE_PORTAL"
                ],
            },
            "RATAN_DATA_ENTITLEMENT:Global": {
                "RATAN_DATA_ENTITLEMENT": [
                    "VIEW_ENTITLEMENT"
                ]
            },
        }
      }, token: "123", theme: "dark",
        entities:[
            {
                "id": 11164654,
                "name": "RATAN_DATA_ENTITLEMENT",
                "applicationName": "RATAN",
                "roleId": 11515751,
                "roleName": "Global",
                "subjects": [
                    {
                        "longName": "/RATAN_DATA_ENTITLEMENT",
                        "name": "RATAN_DATA_ENTITLEMENT",
                        "id": 11164752,
                        "actions": [
                            {
                                "name": "VIEW_ENTITLEMENT",
                                "id": 11164807,
                                "entitlementId": 11514754
                            }
                        ]
                    }
                ]
            },
            {
                "id": 11274101,
                "name": "X_RATANONE",
                "applicationName": "RATAN",
                "roleId": 11274180,
                "roleName": "FMO_OPS_SUP",
                "subjects": [
                    {
                        "longName": "/RATAN_NETTING_RULE",
                        "name": "RATAN_NETTING_RULE",
                        "id": 11274220,
                        "actions": [
                            {
                                "name": "ACCESS_FMO_POST_TRADE_PORTAL",
                                "id": 11274984,
                                "entitlementId": 11275353
                            }
                        ]
                    },
                ]
            }
        ]
        }}>
      <ThemeProvider>
        <Profile
         open={true}
         onClose={mockClose}
        />
        </ThemeProvider>
        </Provider>);

    await waitFor();
    expect(screen).toBeDefined();
    expect(screen.getByTestId("entitlement-profile-label-box")).toBeInTheDocument();

    expect(screen.getByText(/RATAN :: X_RATANONE :: FMO_OPS_SUP/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/RATAN :: X_RATANONE :: FMO_OPS_SUP/i));

    expect(screen.getByText(/RATAN_NETTING_RULE/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/RATAN_NETTING_RULE/i));
    fireEvent.click(screen.getByText(/RATAN_NETTING_RULE/i));
    
    fireEvent.click(screen.getByText(/RATAN :: X_RATANONE :: FMO_OPS_SUP/i));

    const closeBtn = screen.getByText("Close");
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(mockClose).toBeCalled();

  });
});
