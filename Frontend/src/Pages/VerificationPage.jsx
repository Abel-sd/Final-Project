import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners";

const VerificationPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [message, setMessage] = useState("Verifying your email...");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setMessage("Invalid verification link");
                setIsVerifying(false);
                return;
            }

            try {
                const response = await axios.post(
                    `http://localhost:3000/api/donor/manage/Verify`,
                    { token }
                );
                setMessage(response.data.message || "Email verified successfully! 🎉");
                setIsSuccess(true);
            } catch (error) {
                setMessage(error.response?.data?.message || "Verification failed. Please try again.");
                setIsSuccess(false);
            } finally {
                setIsVerifying(false);
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
                <div className="flex flex-col items-center space-y-4">
                    {/* Animated Icon */}
                    <div className={`p-4 rounded-full ${isSuccess ? 'bg-green-100' : 'bg-red-100'} 
                        ${isVerifying ? 'animate-pulse bg-blue-100' : ''}`}>
                        {isVerifying ? (
                            <svg className="w-12 h-12 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : isSuccess ? (
                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        ) : (
                            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        )}
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800">
                        {isVerifying ? "Verifying..." : (isSuccess ? "Success!" : "Oops!")}
                    </h2>

                    <p className={`text-lg text-center ${isSuccess ? 'text-green-600' : 'text-red-600'} 
                        ${isVerifying ? 'text-blue-600' : ''} transition-colors duration-300`}>
                        {message}
                    </p>

                    <button
                        onClick={() => window.location.href = "/login"}
                        className={`mt-6 px-6 py-3 rounded-lg font-semibold transition-all duration-300
                            ${isSuccess ? 
                                'bg-green-500 hover:bg-green-600 text-white' : 
                                'bg-blue-500 hover:bg-blue-600 text-white'}
                            ${isVerifying ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isVerifying}
                    >
                        {isVerifying ? (
                            <BeatLoader size={10} color="white" />
                        ) : (
                            'Continue to Login'
                        )}
                    </button>

                    <p className="text-sm text-gray-500 mt-4 text-center">
                        {isVerifying ? 
                            "This might take a few seconds..." : 
                            "You can now login with your verified account"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;