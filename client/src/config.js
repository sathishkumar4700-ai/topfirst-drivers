import axios from 'axios';

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Set axios default base URL
axios.defaults.baseURL = API_URL;

export default API_URL;
