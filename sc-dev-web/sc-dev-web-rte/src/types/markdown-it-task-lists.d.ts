declare module 'markdown-it-task-lists' {
  import type MarkdownIt from 'markdown-it';

  type TaskListOptions = {
    enabled?: boolean;
    label?: boolean;
    labelAfter?: boolean;
  };

  type TaskListPlugin = (md: MarkdownIt, options?: TaskListOptions) => void;

  const taskLists: TaskListPlugin;
  export default taskLists;
}
