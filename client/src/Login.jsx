import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState(""); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(""); 

        try {
            // ✅ Send request with credentials to store JWT in cookies
            const res = await axios.post("http://localhost:5000/login", formData, {
                withCredentials: true // 🔴 Important: Enables sending cookies
            });

            console.log("Login successful!", res.data);
            navigate("/home"); // ✅ Redirect to Home page

        } catch (error) {
            console.error("Login failed!", error.response?.data?.message || error.message);
            setErrorMessage(error.response?.data?.message || "Invalid credentials! Try again.");
        }
    };

    return (
        <div className="bg-black text-white min-h-screen flex justify-center items-center">
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block font-bold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block font-bold mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
                            required
                        />
                    </div>
                    {errorMessage && (
                        <p className="text-red-500 text-sm font-semibold">{errorMessage}</p>
                    )}
                    <button type="submit" className="bg-green-500 text-black px-6 py-3 rounded-lg hover:bg-green-400 w-full">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
