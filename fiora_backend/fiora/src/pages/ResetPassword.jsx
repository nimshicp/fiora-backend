import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { resetPassword } from "../api/authApi";
import { Lock, KeyRound, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

function ResetPassword() {
  const { uid, token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await resetPassword(uid, token, { password });
      setMessage(res.data.message);
      setIsSubmitted(true);
      toast.success("Password reset successfully!");
    } catch (err) {
      setMessage("Reset failed");
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Elements - Matching Theme */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-100 to-purple-100 rounded-bl-full -mr-16 -mt-16 opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100 to-purple-100 rounded-tr-full -ml-16 -mb-16 opacity-30"></div>

      {/* Back to Login Link - Centered */}
      <div className="relative max-w-md mx-auto mb-4 flex justify-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </Link>
      </div>

      <div className="relative max-w-md mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-xl mb-4 transform hover:scale-105 transition-transform duration-300">
            <KeyRound className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-gray-500">Create a new password for your account</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
          
          <div className="relative z-10">
            {!isSubmitted ? (
              <>
                {/* Info Message */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-700 text-center">
                    Please enter your new password below. Make sure it's at least 8 characters long.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* New Password Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors duration-200" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full pl-10 pr-12 py-3 border border-gray-200 bg-gray-50/50 rounded-xl outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-200"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <Lock className="h-5 w-5 text-gray-400 hover:text-pink-500 transition-colors" />
                        ) : (
                          <Lock className="h-5 w-5 text-gray-400 hover:text-pink-500 transition-colors" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Must be at least 8 characters long
                    </p>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors duration-200" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full pl-10 pr-12 py-3 border border-gray-200 bg-gray-50/50 rounded-xl outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-200"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <Lock className="h-5 w-5 text-gray-400 hover:text-pink-500 transition-colors" />
                        ) : (
                          <Lock className="h-5 w-5 text-gray-400 hover:text-pink-500 transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements Note */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-500" />
                      Password must be at least 8 characters
                    </p>
                  </div>

                  {/* Message Display */}
                  {message && (
                    <div className={`p-3 rounded-lg text-center ${
                      message.includes("failed") || message.includes("Failed")
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-green-50 text-green-600 border border-green-100"
                    }`}>
                      <p className="text-sm">{message}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Resetting...</span>
                      </div>
                    ) : (
                      <>
                        <KeyRound size={18} className="group-hover:rotate-6 transition-transform" />
                        <span>Reset Password</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Password Reset Successful!</h3>
                <p className="text-gray-500 mb-6">
                  Your password has been successfully reset.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <ArrowLeft size={18} />
                  <span>Go to Login</span>
                </Link>
              </div>
            )}

            {/* Divider - Only show if not submitted */}
            {!isSubmitted && (
              <>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-400">Need help?</span>
                  </div>
                </div>

                {/* Help Links */}
                <div className="text-center">
                  <Link
                    to="/forgot-password"
                    className="text-pink-500 hover:text-pink-600 text-sm font-medium transition-colors"
                  >
                    Request new reset link
                  </Link>
                </div>
              </>
            )}

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-1 text-xs text-gray-400 pt-6">
              <span>Secure reset •</span>
              <span>Your password is encrypted</span>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Having trouble? Contact our support team
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;