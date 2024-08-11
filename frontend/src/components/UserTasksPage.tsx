import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Task } from '../models/task';

const UserTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const userId = 'b7ca0fd2-9a9b-4808-9ccc-281812ae2db4'; // or pick another userId from Dynamo table
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`/users/${userId}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await axios.delete(`/users/${userId}/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = (taskId: string) => {
    navigate(`/edit-task/users/${userId}/tasks/${taskId}`);
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>Tasks</h2>
      <button
        type="submit"
        onClick={() => navigate(`/create-task/users/${userId}`)}
      >
        Create New Task
      </button>
      <table>
        <thead>
          <tr>
            <th>User Id</th>
            <th>Task ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.userId}</td>
              <td>{task.id}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.status}</td>
              <td>{task.dueDate}</td>
              <td>
                <button onClick={() => handleEdit(task.id)}>Edit</button>
                <button onClick={() => handleDelete(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTasksPage;
