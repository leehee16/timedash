import { TaskCategory } from '../components/Ground';

export class Task {
  id: string;
  title: string;
  category: TaskCategory;
  estimatedTime?: number;
  recordedTime?: number;
  priority?: number;
  content: string;
  x: number;
  y: number;

  constructor(id: string, title: string, category: TaskCategory = 'Inbox', content: string = '', x: number = 0, y: number = 0) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.content = content;
    this.x = x;
    this.y = y;
  }

  toMarkdown(): string {
    return `# ${this.title}\n\nCategory: ${this.category}\nPosition: (${this.x}, ${this.y})\n${this.estimatedTime ? `Estimated Time: ${this.estimatedTime} minutes\n` : ''}${this.recordedTime ? `Recorded Time: ${this.recordedTime} minutes\n` : ''}${this.priority ? `Priority: ${this.priority}\n` : ''}\n${this.content}`;
  }

  updatePosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  updateCategory(category: TaskCategory): void {
    this.category = category;
  }
}
