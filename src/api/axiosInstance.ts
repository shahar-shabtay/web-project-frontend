import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  // baseURL: 'https://localhost:3000/api',
  baseURL: 'https://node71.cs.colman.ac.il/api',
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle Token Expiration Error
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      console.log('Token expired. Attempting refresh...');
      originalRequest._retry = true;
      
      try {
        // Call the refresh token endpoint
        const refreshResponse = await axios.post('https://node71.cs.colman.ac.il/api/refresh-token', {
          token: Cookies.get('refreshToken'),
        });
        const newAccessToken = refreshResponse.data.accessToken;
        Cookies.set('accessToken', newAccessToken, { secure: true, sameSite: 'Strict' });

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log('Retrying original request with new token...');
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // window.location.href = '/signIn'; // Redirect to login if refresh fails
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // Return any other errors
  }
);

export default axiosInstance;