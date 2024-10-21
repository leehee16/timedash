import { TaskCategory } from '../components/Ground';

export class Task {
  id: string;
  title: string;
  category: TaskCategory;
  estimatedTime?: number;
  recordedTime?: number;
  priority?: number;
  content: string;

  constructor(id: string, title: string, category: TaskCategory, content: string = '') {
    this.id = id;
    this.title = title;
    this.category = category;
    this.content = content;
  }

  toMarkdown(): string {
    return `# ${this.title}\n\nCategory: ${this.category}\n${this.estimatedTime ? `Estimated Time: ${this.estimatedTime} minutes\n` : ''}${this.recordedTime ? `Recorded Time: ${this.recordedTime} minutes\n` : ''}${this.priority ? `Priority: ${this.priority}\n` : ''}\n${this.content}`;
  }
}
