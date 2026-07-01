# BPMN Service Instruction

## Scope
This document describes the BPMN conversion architecture in this project, covering the core service layer implementation and its wrapper utilities.

---

## Architecture Overview

### Current Implementation (Migration Complete)
The BPMN conversion logic has been migrated from util files to a centralized service layer:

**Core Service:**
- `src/service/BpmnService.ts` - Primary BPMN conversion service using bpmn-moddle
  - Provides bidirectional conversion between ReactFlow data and standard BPMN 2.0 XML
  - Supports Camunda BPMN extensions (camunda:assignee, camunda:Properties)
  - Comprehensive test coverage in `src/service/BpmnService.test.ts`

**Legacy Wrapper Utilities (Maintained for backward compatibility):**
- `src/util/bpmnParser.ts` - Wrapper that calls BpmnService for parsing
- `src/util/bpmnExport.ts` - Wrapper that calls BpmnService for export
- These files exist for backward compatibility and will eventually be deprecated

---

## Core Logic Overview

### BpmnService.ts
The centralized service handles all BPMN conversion operations:

**Export (ReactFlow → BPMN XML):**
- Node type mapping: Maps ReactFlow node types to BPMN element types
  - `StartEventNode` → `bpmn:StartEvent`
  - `WorkFlowStepNode` → `bpmn:UserTask`
  - `EndNode` → `bpmn:EndEvent`
  - `HttpNode` → `bpmn:ServiceTask`
  - `CodeNode` → `bpmn:ScriptTask`
  - `IfNode` → `bpmn:ExclusiveGateway`

- Field mapping (HARDCODED - Future refactoring planned):
  - `data.label` → BPMN `name` attribute
  - `data.assignee` → `camunda:assignee` attribute (UserTask only)
  - Other fields → `camunda:Properties` extension elements
  - Position/dimensions → `bpmndi:BPMNShape` with `dc:Bounds`
  
**Parse (BPMN XML → ReactFlow):**
- Reverse mapping of all export operations
- Extracts `name` attribute → `data.label`
- Extracts `camunda:assignee` → `data.assignee`
- Parses `camunda:Properties` back to node data object
- Converts BPMN shapes to ReactFlow position and dimensions

**Key Methods:**
- `toXML(nodes, edges)` - Convert ReactFlow data to BPMN XML
- `parseXMLToReactFlow(xml)` - Parse BPMN XML to ReactFlow data
- `fromXML(xml)` - Parse BPMN XML (internal)
- `getNodes()` - Get parsed nodes in ReactFlow format
- `getEdges()` - Get parsed edges in ReactFlow format

---

## Current State: Hardcoded Field Mappings

⚠️ **Known Limitation:** The current implementation uses hardcoded field mappings for specific node types. This is a temporary implementation and will be refactored.

**Hardcoded fields:**
- `label` - Always mapped to BPMN `name` attribute
- `assignee` - Mapped to `camunda:assignee` for UserTask nodes
- Node type mappings are defined in lookup objects

**Future Refactoring Plan:**
- Develop a generic, configuration-driven field mapping system
- Support dynamic field definitions without code changes
- Enable custom property mappings through configuration files
- Decouple field mapping logic from business logic

---

## Coordination Instructions

### When modifying BPMN conversion logic:

1. **Primary changes go to `src/service/BpmnService.ts`**
   - All new features must be implemented in the service layer
   - Update both export (`toXML`) and parse (`parseXMLToReactFlow`) methods
   - Maintain bidirectional consistency

2. **Update tests in `src/service/BpmnService.test.ts`**
   - Add test cases for new node types or field mappings
   - Verify bidirectional conversion for all changes
   - Ensure backward compatibility with existing BPMN files

3. **Document hardcoded changes in this file**
   - If adding new hardcoded field mappings, document them here
   - Add notes about future refactoring requirements

4. **Legacy wrappers (`src/util/bpmnExport.ts` and `bpmnParser.ts`)**
   - Avoid making changes to these files
   - They should remain as simple wrappers to BpmnService
   - Plan migration path for any code still using them directly

---

## Test Case Management

**Primary Test Suite:**
- `src/service/BpmnService.test.ts` - Comprehensive BpmnService tests
  - Single node type conversion tests
  - Complex workflow conversion tests
  - Edge case and error handling tests
  - Bidirectional conversion validation

**Legacy Test Suite:**
- `src/util/bpmnExportParser.test.ts` - Legacy wrapper tests (maintained for compatibility)

**Test Coverage Requirements:**
- Every new node type must have export and parse tests
- Every new field mapping must have bidirectional tests
- Edge cases and error conditions must be covered
- Performance tests for large workflows (optional but recommended)

**When adding new features:**
1. Write tests first (TDD approach recommended)
2. Implement in BpmnService.ts
3. Verify all existing tests still pass
4. Update this documentation

---

## Maintenance Recommendations

### Short-term (Current Phase):
- All BPMN logic changes go through `src/service/BpmnService.ts`
- Keep bidirectional conversion logic synchronized
- Document any new hardcoded field mappings
- Maintain comprehensive test coverage

### Long-term (Refactoring Phase):
- Design generic field mapping configuration system
- Migrate hardcoded mappings to configuration files
- Implement plugin/extension system for custom node types
- Deprecate and remove legacy util wrappers
- Create migration guide for existing BPMN files

### Code Review Checklist:
- [ ] Changes made in BpmnService.ts (not util wrappers)
- [ ] Both export and parse logic updated consistently
- [ ] Tests added/updated in BpmnService.test.ts
- [ ] Documentation updated if adding new field mappings
- [ ] Backward compatibility maintained
- [ ] No breaking changes to existing BPMN files

---

## File Reference

**Core Files:**
- `src/service/BpmnService.ts` - Main BPMN conversion service
- `src/service/BpmnService.test.ts` - Comprehensive test suite
- `src/service/index.ts` - Service exports and hooks

**Legacy Files (Compatibility Layer):**
- `src/util/bpmnParser.ts` - Parser wrapper (calls BpmnService)
- `src/util/bpmnExport.ts` - Export wrapper (calls BpmnService)
- `src/util/bpmnExportParser.test.ts` - Legacy tests

**Supporting Files:**
- `src/util/generateSmoothWaypoints.ts` - Edge waypoint calculation utility

---

> This document describes the BPMN conversion architecture. For questions about specific implementations, refer to the comprehensive comments in `src/service/BpmnService.ts` or the test files for examples.
