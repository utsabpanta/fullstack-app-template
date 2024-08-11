import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axiosInstance';

const CreateTaskPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const handleCreate = async () => {
    const taskData = {
      userId,
      title,
      description,
      status,
      dueDate: new Date(dueDate).toISOString(), // Convert to UTC format
    };

    try {
      await axios.post(`/users/${userId}/tasks`, taskData);
      navigate('/'); // Redirect to the task list page
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>Create New Task</h2>
      <div>
        <label>Title:</label>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Status:</label>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div>
        <label>Due Date:</label>
        <input
          type="datetime-local"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>
      <button onClick={handleCreate}>Save Task</button>
    </div>
  );
};

export default CreateTaskPage;
