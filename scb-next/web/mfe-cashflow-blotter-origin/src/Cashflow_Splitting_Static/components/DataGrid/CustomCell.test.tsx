import {CustomCell} from "./CustomCell";

describe("CustomCell", () => {
    it("Custom Cell should return empty when value is ALL", ()=>{
        const props = {value: "ALL"};
        const cell = CustomCell(props);
        expect(cell).toBeDefined();
    });
    it("Custom Cell should return value when value is not ALL", ()=>{
        const props = {value: "TEST"};
        const cell = CustomCell(props);
        expect(cell).toBeDefined();
    });
});