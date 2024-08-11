import { Task, TaskAttributes } from '../models/task';

/**
 * Transforms a Task object by removing the PK and SK fields.
 *
 * @param {Task} task - The original task object with PK and SK fields.
 * @returns {TaskAttributes} - The transformed task attributes without PK and SK fields.
 */
export const transformTask = (task: Task): TaskAttributes => {
    const { PK, SK, ...attributes } = task;
  
    // Extract the UUID from PK and SK
    const userId = PK.split('#')[1];
    const id = SK.split('#')[1];
  
    // Return the transformed task with id and userId
    return {
      ...attributes,
      userId,
      id,
    };
  };
  
