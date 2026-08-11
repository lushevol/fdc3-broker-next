import type { Entity, Subject } from '../../../hooks/model/root';

export interface ProfileProps {
  open: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export interface RoleProps {
  entity: Entity;
  expanded: string | false;
  handleChange: (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => void;
}

export interface SubjectProps {
  subject: Subject;
  expanded: string | false;
  handleChange: (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => void;
  actionObj: string[];
}
