import axios from 'axios';

// Create a new Axios instance
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5000/api'
});

// ✨ Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('access_token');
    
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  }, 
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default apiClient;