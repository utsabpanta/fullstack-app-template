import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Task, TaskAttributes } from '../models/task';

const EditTaskPage: React.FC = () => {
  const { userId, taskId } = useParams<{ userId: string; taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<TaskAttributes>({
    title: '',
    description: '',
    status: 'pending',
    dueDate: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = useCallback(async (): Promise<void> => {
    try {
      const response: Task = await axios
        .get<Task>(`/users/${userId}/tasks/${taskId}`)
        .then(response => response.data);
      // Convert dueDate to the format required by input[type="datetime-local"]
      const dueDate = new Date(response.dueDate).toISOString().slice(0, 16);
      // Destructure to exclude id and userId from taskData
      const {
        id: ignoredTaskId,
        userId: ignoredUserId,
        ...taskWithoutId
      } = response;

      setTask({ ...taskWithoutId, dueDate });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching task:', error);
      setError('Failed to load task.');
      setLoading(false);
    }
  }, [userId, taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await axios.put(`/users/${userId}/tasks/${taskId}`, task);
      navigate('/');
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Failed to save task.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>{taskId ? 'Edit Task' : 'Create Task'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={task.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Status:
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            required
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label>
          Due Date:
          <input
            type="datetime-local"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">{taskId ? 'Update Task' : 'Create Task'}</button>
      </form>
    </div>
  );
};

export default EditTaskPage;
