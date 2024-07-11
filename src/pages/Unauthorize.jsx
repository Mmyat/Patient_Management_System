import React, { useEffect } from 'react'
import useApi from "../components/useApi";
import axios from 'axios';

const Unauthorize = () => {
  // const { data, loading, error, callApi } = useApi();
  axios.defaults.withCredentials = true;
  const handleLogin = async () => { 
    // await callApi("get", `http://192.168.100.18:8000/protected-endpoint`);
    const response = await axios.get(`http://localhost:3000/dashboard`, { withCredentials: true },{headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },});
    console.log(response);
    // console.log(error);
    if (response.status == '200'){
      console.log("login succ");
    }
  };
  useEffect(()=>{
    handleLogin()
  },[])
  return (
    <div>Hi</div>
  )
}

export default Unauthorize