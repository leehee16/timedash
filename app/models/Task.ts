import { TaskCategory } from '../components/Ground';

export class Task {
  id: string;
  title: string;
  category: TaskCategory;
  estimatedTime?: number;
  recordedTime?: number;
  priority?: number;

  constructor(id: string, title: string, category: TaskCategory) {
    this.id = id;
    this.title = title;
    this.category = category;
  }
}
