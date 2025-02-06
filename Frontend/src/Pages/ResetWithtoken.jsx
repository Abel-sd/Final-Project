import { useEffect, useState } from "react";
import { Navigate, Router, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import useCreateNewPassword from "../hooks/UseCreateNewpassword";

const ResetWithToken = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [message, setMessage] = useState();
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
console.log(token)
    const  {mutate,isPending}=useCreateNewPassword({
        onSuccess:(data)=>{
            setMessage(data.message);
            setIsSuccess(true);
            setTimeout(()=>{
                setMessage('');
            },3000)
            navigate('/login')
        },
        onError:(error)=>{
            setMessage(error.response.data.message);
        }
    })

const handleSubmit=(e)=>{
    e.preventDefault();
    mutate({token,password})
}


    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium">Enter your password</label>
          <input
           type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter your New Password"
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isPending ? 'changing...' : 'Change Password'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </div>
        </div>
    );
};

export default ResetWithToken;