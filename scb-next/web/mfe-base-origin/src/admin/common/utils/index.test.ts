import { getAdminModuleEms2Role, onResetUtil } from "./"


describe("Admin Module Util", () => {
  it("should be true", () => {
    let result = getAdminModuleEms2Role([
      {
        "id": 276822,
        "name": "FMO PORTAL ADMIN",
        "applicationName": "RATAN",
        "roleId": 276825,
        "roleName": "SUPER_USER",
        "subjects": [
          {
            "longName": "/category",
            "name": "category",
            "id": 276832,
            "actions": [
              {
                "name": "READ-WRITE",
                "id": 276824,
                "entitlementId": 276871
              }
            ]
          },
          {
            "longName": "/importmap",
            "name": "importmap",
            "id": 276831,
            "actions": [
              {
                "name": "READ-WRITE",
                "id": 276824,
                "entitlementId": 276872
              }
            ]
          },
          {
            "longName": "/tile",
            "name": "tile",
            "id": 276833,
            "actions": [
              {
                "name": "READ-WRITE",
                "id": 276824,
                "entitlementId": 276873
              }
            ]
          }
        ]
      }
    ])
    expect(result).toEqual("SUPER_USER")
    result = getAdminModuleEms2Role([])
    expect(result).toEqual(undefined)
  });
  it("should be true", () => {
    onResetUtil([{ id: 1 }], { id: 1 }, () => { }, () => { })
    onResetUtil([{ id: 1 }], { id: 2 }, () => { }, () => { })
  });
});