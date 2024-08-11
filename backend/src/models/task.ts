export interface Task {
  PK: string; // Partition key, structured as `USER#UUID`
  SK: string; // Sort key, structured as `TASK#UUID`
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string; // Due date of the task in ISO 8601 format (UTC)
  userId?: string; // Extracted user UUID
  id?: string; // Extracted task UUID
}

// Clients don't need to know or see PK and SK fields in response
export type TaskAttributes = Omit<Task, 'PK' | 'SK'>;

export type TaskResult = {
  data?: TaskAttributes[];
  error?: string;
};
