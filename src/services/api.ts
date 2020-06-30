import axios from 'axios';

const api = axios.create({
  baseURL: 'https://f335a77fee6c.ngrok.io',
});

export default api;
