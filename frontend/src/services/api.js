const BASE_URL = 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    // Add credentials so refresh token cookies are sent
    credentials: 'omit', // Wait, only omit for simple cross-origin, let's use 'include' if we need cookies
  };
  // We need to send cookies for refresh, so 'include'
  config.credentials = 'include';

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    // If 204 No Content, just return null
    if (response.status === 204) return null;

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired, a real app would try to /refresh here.
        // For simplicity, we just trigger a CustomEvent to logout the user
        window.dispatchEvent(new Event('auth:logout'));
      }
      throw new Error((data && data.message) || response.statusText);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
