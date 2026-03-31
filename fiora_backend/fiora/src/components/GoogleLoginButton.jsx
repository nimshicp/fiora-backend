import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../api/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function GoogleLoginButton() {

  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSuccess = async (credentialResponse) => {
  try {
    const res = await googleLogin(credentialResponse.credential);



const data = res.data || res;   

    // Store tokens
    localStorage.setItem("access", data.access);

    //  Match your existing login format
    const userData = {
      id: data.user.id,
      username: data.user.username,   
      role: data.user.role,
    };

    //  Update context
    setUser(userData);
    

    //  Store user (same as login)
    localStorage.setItem("currentUser", JSON.stringify(userData));

    toast.success("Logged in with Google");

    //  Redirect
    if (userData.role === "admin" || userData.role === "superadmin") {
      navigate("/dashboard");
    } else {
      navigate("/");
    }

  } catch (error) {
  toast.error("Google login failed");
}
};
  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => toast.error("Google Login Failed")}
    />
  );
}

export default GoogleLoginButton;
