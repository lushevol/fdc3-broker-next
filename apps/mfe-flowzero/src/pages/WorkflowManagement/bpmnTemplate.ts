const id = new Date().getTime();
export const startNode = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="Definitions_${id}" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="3.6.0">
  <bpmn:process id="Process_${id}" isExecutable="true">
    <bpmn:startEvent id="start-event-${id}" name="Start with Form">
      <bpmn:extensionElements>
        <camunda:properties>
          <camunda:property name="handlesMeta" value="[{&#34;id&#34;:&#34;start-event-${id}_out&#34;,&#34;role&#34;:&#34;source&#34;,&#34;label&#34;:&#34;Out&#34;}]" />
        </camunda:properties>
      </bpmn:extensionElements>
    </bpmn:startEvent>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_Process_${id}">
    <bpmndi:BPMNPlane id="BPMNPlane_Process_${id}" bpmnElement="Process_${id}">
      <bpmndi:BPMNShape id="Shape-start-event-${id}" bpmnElement="start-event-${id}">
        <dc:Bounds x="170" y="92" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="159" y="128" width="58" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
