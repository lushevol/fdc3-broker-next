import type { Entity, Subject } from '../../../hooks/model/root';

export interface ProfileProps {
  open: boolean;
  onClose: Function;
}

export interface RoleProps {
  entity: Entity;
  expanded: string | false;
  handleChange: Function;
}

export interface SubjectProps {
  subject: Subject;
  expanded: string | false;
  handleChange: Function;
  actionObj: string[];
}
