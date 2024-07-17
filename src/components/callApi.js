import {useState, useEffect} from 'react';
import axios from 'axios';

const callApi = (method, url, requestData) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiCall = async()=>{
    try {
      setLoading(true);
      setError(null);
      const apiResponse = await axios({
        method,
        url : `${import.meta.env.VITE_SERVER_DOMAIN}${url}`,
        data: requestData,
        withCredentials: true
      });
      if (apiResponse.data.code === '404'){
        setError(apiResponse.data.message)
      }
      if(apiResponse.data.code ==='200'){
        setResponse(apiResponse.data);
      }  
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    apiCall()
  }, [method, url, requestData]);

  return { response, loading, error};
};

export default callApi;
