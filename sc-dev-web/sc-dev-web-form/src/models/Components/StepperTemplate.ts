import { cloneProperties } from '../../shared/utils.js';
import { ContainerMixin } from '../mixin/containerMixin.js';

export class StepOption {
  id: string;
  title: string;
  status?: string;
  disabled?: boolean;
  active?: boolean;
}

export class StepperTemplate extends ContainerMixin('Stepper') {
  steps: StepOption[] = [{
    id: 'Step1',
    title: 'Step 1',
  }, {
    id: 'Step2',
    title: 'Step 2',
  }];
  conditional: boolean;

  static from(obj?: object) {
    if (!obj) return new StepperTemplate();

    const newInstance = new StepperTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return StepperTemplate.from(obj);
  }

  manuallyUpdateStatus(steps: StepOption[]) {
    this.steps.forEach((step, index) => {
      if (steps[index]) {
        cloneProperties(step, steps[index]);
      }
    });
  }

  updateStatus(invalidSteps: string[]) {
    this.steps.forEach((step, index) => {
      const preStep = this.steps[index - 1];
      const { id } = step;
      if (preStep && preStep.status !== 'finish') return;
      if (!invalidSteps.includes(id)) {
        step.status = 'finish';
      }
    });
  }

  updateConditionalStatus(invalidSteps: string[]) {
    this.steps.forEach((step, index) => {
      const preStep = this.steps[index - 1];
      if (preStep) {
        const preId = preStep.id;
        if (invalidSteps.includes(preId)) {
          step.disabled = true;
        } else {
          if (!invalidSteps.includes(step.id)) {
            step.status = 'finish';
          } else {
            step.status = undefined;
          }
          step.disabled = false;
        }
      } else {
        if (!invalidSteps.includes(step.id)) {
          step.status = 'finish';
        } else {
          step.status = undefined;
        }
      }
    });
  }
}
