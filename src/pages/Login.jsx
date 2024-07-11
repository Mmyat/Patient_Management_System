import { useState,useEffect } from "react";
import useApi from "../components/useApi";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { data, loading, error, callApi } = useApi();
  
  const handleLogin = async (e) => { 
    e.preventDefault();
    setMessage('');
    // if (email === '' && password === '') {
    //   setMessage("Please fill email and password!");axios.defaults.withCredentials = true;

    //   return;
    // }
    // await callApi("post", `http://localhost:3000/login`, { email, password });
    // navigate('/admin/unauthorize')
    const response = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/login`,{ email, password }, { withCredentials: true });
    console.log(response);
    navigate('/admin/unauthorize')
  };



  // useEffect(() => {
  //   if (data) {
  //         console.log("data login", error, data);
  //     if (data.code !== '303') {
  //       setMessage(data.message);
  //       return;
  //     }
  //     if (data.code === '303') {
  //       console.log("login success");
  //       setMessage('')
  //       // navigate('/admin/unauthorize')
  //       // window.location.href = data.url;
  //     }
  //   }
  // }, [data, email, password]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}
      {message && <p className="text-red-500">{message}</p>} */}
      <form onSubmit={handleLogin} className="flex flex-col h-fit bg-white border-2 rounded-lg shadow-lg hover:shadow-xl mt-20 mb-4 p-8">
        <h1 className="text-center font-bold text-sky-400 text-2xl mt-8">
          Login Form
        </h1>
        <input
          type="text"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-gray-800 text-sm font-normal border border-sky-500 px-3 py-1 rounded-md mt-8 text-medium w-full"
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-gray-800 text-sm border border-sky-500 px-3 py-1 rounded-md mt-6 text-medium w-full"
        />
        <div className="flex items-center mb-10 mt-8">
          <button
            type="submit"
            className="font-medium w-22 text-white border-2 border-sky-500 bg-sky-500/100 px-3 py-1 rounded-lg w-full"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
