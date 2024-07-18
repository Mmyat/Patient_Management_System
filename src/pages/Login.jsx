import { useState,useEffect } from "react";
import {useNavigate} from "react-router-dom";
const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const handleLogin = async (e) => { 
    e.preventDefault();
    // setMessage('');
    // const response = await api.post(`/login`,{ email, password }, { withCredentials: true });
    // navigate('/admin/unauthorize')
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
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
