/* Example Axios client with automatic refresh handling (browser). 
   - Access token stored in memory
   - Refresh token stored as HttpOnly cookie (set by /api/users/login)
   - /api/auth/refresh returns a new access token and rotates refresh token cookie
*/

import axios from 'axios';

let accessToken = null; // store current access token in memory
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}
function onRefreshed(token) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true // important to send HttpOnly refresh cookie
});

// request interceptor to attach the access token
api.interceptors.request.use(config => {
  if (accessToken) config.headers['Authorization'] = 'Bearer ' + accessToken;
  return config;
});

// response interceptor to handle 401 by trying refresh
api.interceptors.response.use(response => response, async error => {
  const originalRequest = error.config;
  if (error.response && error.response.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      // queue the request until refresh completes
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          resolve(axios(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // call refresh endpoint (will send refresh cookie automatically)
      const resp = await axios.post('http://localhost:5000/api/auth/refresh', {}, { withCredentials: true });
      const newToken = resp.data.token;
      accessToken = newToken;
      onRefreshed(newToken);
      return axios(originalRequest);
    } catch (e) {
      // cannot refresh -> redirect to login or handle accordingly
      accessToken = null;
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
  return Promise.reject(error);
});

// helper functions
export async function login(phone, password) {
  const resp = await axios.post('http://localhost:5000/api/users/login', { phone, password }, { withCredentials: true });
  accessToken = resp.data.token;
  return resp.data;
}

export async function logout() {
  await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
  accessToken = null;
}

export default api;
