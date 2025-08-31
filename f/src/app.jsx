import React, { useState, useEffect } from 'react';
import apiClient from './api'; // Use the configured apiClient instead of the default axios

const App = () => {
  // State variables (no changes here)
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formTask, setFormTask] = useState({ id: null, title: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  // --- Auth & Token Handling ---

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
      fetchTasks(); // No need to pass the token
    }
  }, []);

  // The getAuthHeaders function is no longer needed

  const handleAuthSubmit = async (type) => {
    setError('');
    try {
      const endpoint = type === 'login' ? '/login' : '/register';
      const response = await apiClient.post(endpoint, { username, password });
      
      if (type === 'login') {
        const token = response.data.access_token;
        localStorage.setItem('access_token', token);
        setIsLoggedIn(true);
        fetchTasks(); // The interceptor will handle the token automatically
      } else {
        alert('Registration successful! Please log in.');
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'An unknown error occurred.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    setTasks([]);
  };
  
  // --- Task Management (Simplified) ---

  const fetchTasks = async () => {
    try {
      // No headers needed! The interceptor adds the token.
      const response = await apiClient.get('/tasks');
      setTasks(response.data);
    } catch {
      // You might want to log out the user if the token is invalid
      setError('Failed to fetch tasks. Your session may have expired.');
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await apiClient.put(`/tasks/${formTask.id}`, formTask);
        fetchTasks();
      } else {
        const response = await apiClient.post('/tasks', formTask);
        const newTask = response.data;
        setTasks([newTask, ...tasks]);
      }
      setFormTask({ id: null, title: '', description: '' });
      setIsEditing(false);
    } catch {
      setError('Failed to save task.');
    }
  };

  const editTask = (task) => {
    setFormTask(task);
    setIsEditing(true);
  };

  const deleteTask = async (taskId) => {
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch {
      setError('Failed to delete task.');
    }
  };

  const toggleTaskStatus = async (taskId) => {
    try {
      // The empty object {} is not needed for the PUT request if there's no body
      await apiClient.put(`/tasks/${taskId}/toggle`);
      fetchTasks();
    } catch {
      setError('Failed to toggle status.');
    }
  };

  // --- Conditional Rendering (No changes here) ---

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Task Manager</h1>
          <div className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500 transition-colors" 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-indigo-500 transition-colors" 
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          <div className="flex justify-between items-center mt-6">
            <button onClick={() => handleAuthSubmit('login')} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-md">Log In</button>
            <button onClick={() => handleAuthSubmit('register')} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-transform transform hover:scale-105">Sign Up</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex flex-col items-center font-sans">
      <div className="w-full max-w-3xl">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">Your Tasks</h1>
          <button onClick={handleLogout} className="bg-white text-gray-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors shadow-sm">Log Out</button>
        </header>

        <form onSubmit={handleTaskSubmit} className="bg-white p-6 rounded-2xl shadow-lg mb-8 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-indigo-600">{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
          <input 
            type="text" 
            placeholder="Task Title" 
            value={formTask.title} 
            onChange={(e) => setFormTask({ ...formTask, title: e.target.value })} 
            required 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 transition-colors" 
          />
          <textarea 
            placeholder="Description (optional)" 
            value={formTask.description} 
            onChange={(e) => setFormTask({ ...formTask, description: e.target.value })} 
            rows="3"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 transition-colors" 
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-md">{isEditing ? 'Save Changes' : 'Add Task'}</button>
            {isEditing && <button type="button" onClick={() => { setIsEditing(false); setFormTask({ id: null, title: '', description: '' }); }} className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">Cancel</button>}
          </div>
        </form>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <ul className="space-y-4">
            {tasks.length > 0 ? tasks.map(task => (
              <li key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-sm transition-transform transform hover:scale-[1.02]">
                <div className="flex items-center flex-grow min-w-0">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskStatus(task.id)}
                    className="form-checkbox h-6 w-6 text-indigo-600 rounded-full cursor-pointer border-gray-300 focus:ring-indigo-500 flex-shrink-0"
                  />
                  <div className="ml-4 flex-1 min-w-0">
                    <h3 className={`font-bold text-lg truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.title}</h3>
                    {task.description && <p className={`text-sm text-gray-500 truncate ${task.completed ? 'line-through' : ''}`}>{task.description}</p>}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 ml-4">
                  <button onClick={() => editTask(task)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-200 transition-colors">Edit</button>
                  <button onClick={() => deleteTask(task.id)} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-red-200 transition-colors">Delete</button>
                </div>
              </li>
            )) : <p className="text-center text-gray-500">No tasks found. Add one above!</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;