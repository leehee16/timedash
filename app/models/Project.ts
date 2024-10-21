import { Task } from './Task';

export class Project {
  id: string;
  name: string;
  tasks: Task[];
  subProjects: Project[];
  content: string;

  constructor(id: string, name: string, content: string = '') {
    this.id = id;
    this.name = name;
    this.tasks = [];
    this.subProjects = [];
    this.content = content;
  }

  addTask(task: Task) {
    this.tasks.push(task);
  }

  addSubProject(project: Project) {
    this.subProjects.push(project);
  }

  toMarkdown(): string {
    return `# ${this.name}\n\n${this.content}\n\n## Tasks\n${this.tasks.map(task => `- ${task.title}`).join('\n')}`;
  }
}
