import { useState, useCallback } from 'react';
import axios from 'axios';

const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (method, url, requestData = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        method,
        url,
        data: requestData,
      });
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, callApi };
};

export default useApi;
