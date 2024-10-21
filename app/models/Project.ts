export class Project {
  id: string;
  name: string;
  tasks: Task[];
  subProjects: Project[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.tasks = [];
    this.subProjects = [];
  }

  addTask(task: Task) {
    this.tasks.push(task);
  }

  addSubProject(project: Project) {
    this.subProjects.push(project);
  }
}
