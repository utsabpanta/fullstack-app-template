import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserTasksPage from './components/UserTasksPage';
import CreateTaskPage from './components/CreateTaskPage';
import EditTaskPage from './components/EditTaskPage';
import './styles.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserTasksPage />} />
        <Route path="create-task/users/:userId" element={<CreateTaskPage />} />
        <Route
          path="/edit-task/users/:userId/tasks/:taskId"
          element={<EditTaskPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
