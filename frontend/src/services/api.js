const BASE_URL = `${process.env.REACT_APP_API}/api`;

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

    credentials: 'omit', 
  };
  config.credentials = 'include';

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (response.status === 204) return null;

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      if (response.status === 401) {
      
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
