export interface ChatAction {
  id: string;
  title: string;
  handler: () => void;
}

export interface ChatConversation {
  user: string;
  text: string;
  id: string;
  actions?: ChatAction[];
}
