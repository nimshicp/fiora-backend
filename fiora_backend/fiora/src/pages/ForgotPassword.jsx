import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/authApi";
import { Mail, ArrowLeft, Send, Heart } from "lucide-react";
import toast from "react-hot-toast";

// Add this CSS to your global stylesheet (index.css or App.css)
const floatAnimationCSS = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
.animate-float-delayed {
  animation: float 8s ease-in-out infinite;
  animation-delay: 1s;
}
`;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Add animation styles to head
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = floatAnimationCSS;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPassword({ email });
      setMessage(res.data.message);
      setIsSubmitted(true);
      toast.success("Reset link sent! Check your email.");
    } catch (err) {
      setMessage("Error sending reset email");
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Elements - Matching Theme */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-100 to-purple-100 rounded-bl-full -mr-16 -mt-16 opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100 to-purple-100 rounded-tr-full -ml-16 -mb-16 opacity-30"></div>

      {/* Animated floating element - Heart on right side */}
      <div className="absolute bottom-20 right-10 animate-float-delayed">
        <Heart size={28} className="text-purple-200" />
      </div>

      <div className="relative max-w-md mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="mt-2 text-gray-500">
            No worries, we'll send you reset instructions
          </p>
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
                    Enter your email address and we'll send you a link to reset
                    your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors duration-200" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50/50 rounded-xl outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-200"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <>
                        <Send
                          size={18}
                          className="group-hover:rotate-12 transition-transform"
                        />
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Check Your Email
                </h3>
                <p className="text-gray-500 mb-6">
                  We've sent a password reset link to:
                </p>
                <p className="text-pink-500 font-semibold bg-pink-50 py-2 px-4 rounded-lg inline-block mb-6">
                  {email}
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage("");
                  }}
                  className="text-pink-500 hover:text-pink-600 font-medium transition-colors"
                >
                  Try another email
                </button>
              </div>
            )}

            {/* Message Display */}
            {message && !isSubmitted && (
              <div
                className={`mt-4 p-3 rounded-lg text-center ${
                  message.includes("Error")
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : "bg-green-50 text-green-600 border border-green-100"
                }`}
              >
                <p className="text-sm">{message}</p>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">
                  Remember your password?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-pink-500 font-semibold hover:text-pink-600 transition-colors relative group"
              >
                Back to Sign In
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-1 text-xs text-gray-400 pt-6">
              <span>Secure reset •</span>
              <span>We'll never share your email</span>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
}

export default ForgotPassword;
