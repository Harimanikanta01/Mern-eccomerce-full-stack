// src/utils/fetchApi.js
import SummaryApi from '../common/SummaryApi';

const fetchApi = async (apiKey, body = null) => {
  const api = SummaryApi[apiKey];
  if (!api) throw new Error(`API Key "${apiKey}" not found in SummaryApi`);

  const headers = {
    'Content-Type': 'application/json'
  };

  if (api.auth) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token found. Please login.');
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(api.url, {
    method: api.method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: api.auth ? 'include' : 'same-origin' // include cookies if needed
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errText}`);
  }

  return response.json();
};

export default fetchApi;
