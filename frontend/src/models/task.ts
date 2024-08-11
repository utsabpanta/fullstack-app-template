// Response returned from API
export interface Task {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  id: string;
  userId: string;
}

// Fields relevant to client for POST/PUT request
export interface TaskAttributes {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}
