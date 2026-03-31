import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { Mail, Lock, LogIn, Eye, EyeOff, ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useUser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      formData.email.includes("@") &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending login:", formData);
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // Send fields that match your Django serializer
        const result = await login({
          email: formData.email,
          password: formData.password,
        });

        if (result) {
          toast.success("Welcome back! Login successful.");
          navigate("/");
        } else {
          toast.error("Invalid login credentials");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-100 to-purple-100 rounded-bl-full -mr-16 -mt-16 opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100 to-purple-100 rounded-tr-full -ml-16 -mb-16 opacity-30"></div>

      <div className="relative max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-500">Sign in to continue shopping</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>

          <div className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="Email" className="block text-sm font-medium text-gray-700">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 transition-colors duration-200 ${errors.email ? "text-red-400" : "text-gray-400 group-focus-within:text-pink-500"}`} />
                  </div>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 outline-none ${errors.email ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-gray-200 bg-gray-50/50 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1 mt-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" name="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-sm text-pink-500 hover:text-pink-600 font-medium transition-colors">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors duration-200 ${errors.password ? "text-red-400" : "text-gray-400 group-focus-within:text-pink-500"}`} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl transition-all duration-200 outline-none ${errors.password ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-gray-200 bg-gray-50/50 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-pink-500 transition-colors" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-pink-500 transition-colors" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1 mt-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <LogIn size={18} className="group-hover:rotate-6 transition-transform" />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400">Or continue with</span></div>
              </div>

              <div className="flex justify-center"><GoogleLoginButton /></div>

              <div className="mt-6 text-center">
                <p className="text-gray-500">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-pink-500 font-semibold hover:text-pink-600 transition-colors relative group">
                    Create account
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
                </p>
              </div>

              <div className="flex items-center justify-center gap-1 text-xs text-gray-400 pt-2">
                <span>Secure login •</span>
                <span>Protected by encryption</span>
              </div>
            </form>
          </div>
        </div>
      </div>
      <br />
      <div className="relative max-w-md mx-auto mb-4 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default Login;