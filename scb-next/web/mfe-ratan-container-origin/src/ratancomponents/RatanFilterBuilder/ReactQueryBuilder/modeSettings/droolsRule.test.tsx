import { render } from '@testing-library/react';
import { getModePropsOfDroolsRule } from "./droolsRule";
import { AntDActionElement } from "@react-querybuilder/antd";
import { RuleType } from 'react-querybuilder';

describe('droolsRule mode settings', () => {
    it("getModePropsOfDroolsRule should be work", () => {
        const props = getModePropsOfDroolsRule({
            FieldSelector: vi.fn(() => <div>FieldSelector</div>),
            ValueEditor: vi.fn(() => <div>ValueEditor</div>),
        });
       
        const controlElements = props.controlElements || {controlElements: {
            addRuleAction:<></>,
            addGroupAction:<></>,
            removeRuleAction:<></>,
            removeGroupAction:<></>
        }} as any;

        const controlProps = {
            className: "ruleGroup-addRule",
            context: undefined,
            disabled: false,
            handleOnClick: vi.fn(),
            label: "test",
            level: 1,
            path: [],
            ruleOrGroup: {
                combinator: "and",
                rules: [
                    {
                        id: "9f143043-2767-4928-90e6-54e5940579f6",
                        field: "AACode_Comments",
                        operator: "=",
                        valueSource: "value",
                        value: ""
                    } as RuleType
                ]
            },
            schema: {} as any
        }
        const { container } = render(
            <AntDActionElement type="primary" ghost {...controlProps} >Add Rule</AntDActionElement>
          );
        expect(container).toHaveTextContent('Add Rule');

        // Test the addRuleAction component
        const addRuleActionProps = { onClick: vi.fn() };
        render(<controlElements.addRuleAction {...addRuleActionProps} />);      

        // Test the addGroupAction component
        const addGroupActionProps = { onClick: vi.fn() };
        render(<controlElements.addGroupAction {...addGroupActionProps} />);      

        // Test the removeRuleAction component
        const removeRuleActionProps = { onClick: vi.fn() };
        render(<controlElements.removeRuleAction {...removeRuleActionProps} />);      

        // Test the removeGroupAction component
        const removeGroupActionProps = { onClick: vi.fn() };
        render(<controlElements.removeGroupAction {...removeGroupActionProps} />);      

        // Test the combinatorSelector component
        const combinatorSelectorProps = { onClick: vi.fn() };
        render(<controlElements.combinatorSelector {...combinatorSelectorProps} />);      
        
        expect(props.controlElements!.addRuleAction).toBeDefined();
        expect(props.controlElements!.addGroupAction).toBeDefined();
        expect(props.controlElements!.removeRuleAction).toBeDefined();
        expect(props.controlElements!.removeGroupAction).toBeDefined();
        expect(props.controlElements!.combinatorSelector).toBeDefined();
    });
});