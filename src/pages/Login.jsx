import { useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import useApi from "../components/useApi";
import axios from "axios";
const Login = () => {
    // const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
//   const { data, loading, error, callApi } = useApi();
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("hello login1");
    // navigate('/admin')
    await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/admin/adminLogin`,{email,password},{ withCredentials: true });
    // callApi("post",`${import.meta.env.VITE_SERVER_DOMAIN}/admin/adminLogin`, {
    //   "email": email,
    //     "password": password
    // });

    // console.log(data);
    // window.location.href = data;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen mb-5">
      <form onSubmit={handleLogin} className="flex flex-col h-fit bg-white border-2 rounded-lg shadow-lg hover:shadow-xl mx-auto mt-28 mb-4 p-8">
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
