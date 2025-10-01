import { useState, useCallback } from 'react';
import axios from 'axios';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err);
      console.error('API Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url) => execute(() => axios.get(url)), [execute]);
  const post = useCallback((url, data) => execute(() => axios.post(url, data)), [execute]);
  const put = useCallback((url, data) => execute(() => axios.put(url, data)), [execute]);
  const del = useCallback((url) => execute(() => axios.delete(url)), [execute]);

  return {
    loading,
    error,
    execute,
    get,
    post,
    put,
    delete: del
  };
};