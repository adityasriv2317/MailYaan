"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { ChevronLeft, Info } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Signup() {
  const router = useRouter();

  async function signupWithGoogle(googleToken) {
    try {
      const res = await axios.post("/api/auth/signup", { googleToken });
      // Store token and user info in localStorage for session
      if (res.data && res.data.success) {
        localStorage.setItem("mailyaan-auth", googleToken);
        // Optionally, fetch user profile from backend or decode from token
        // Here, decode the token to get user info (name, email, etc.)
        const base64Url = googleToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const user = JSON.parse(window.atob(base64));
        localStorage.setItem("mailyaan-user", JSON.stringify(user));
      }
      return res.data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        throw new Error(err.response.data.error);
      }
      throw new Error("Signup failed. Please try again.");
    }
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-gray-900 via-indigo-900 to-gray-800 relative">
        {/* Go Back Button */}
        <button
          className="absolute top-6 left-6 flex items-center gap-2 bg-indigo-200/50 py-2 px-1 rounded-lg hover:bg-indigo-500 hover:rounded-2xl transition-all pr-2 hover:text-gray-50"
          onClick={() => router.back()}
        >
          <ChevronLeft />
          Go Back
        </button>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="bg-gray-900 p-10 select-none rounded-2xl shadow-2xl min-w-[340px] text-center border border-gray-800"
        >
          <motion.img
            src="/lg.png"
            alt="Mailyaan Logo"
            className="w-14 mx-auto mb-4 drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          />
          <motion.h2
            className="mb-2 font-bold text-3xl text-indigo-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Provide access to MailYaan
          </motion.h2>
          <motion.p
            className="text-indigo-100 mb-8 text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Provide access to your account using Google
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex justify-center"
          >
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const token = credentialResponse.credential;
                try {
                  await signupWithGoogle(token);
                  window.location.href = "/dashboard";
                } catch (err) {
                  alert(err.message);
                }
              }}
              onError={() => {
                alert("Google sign in failed. Please try again.");
              }}
              useOneTap={false}
              shape="pill"
              text="continue_with"
              theme="filled_blue"
              width="100%"
              scope="openid email profile https://www.googleapis.com/auth/gmail.send"
            />
          </motion.div>
          <motion.div
            className="mt-10 text-base text-indigo-300 max-w-lg bg-indigo-900/40 rounded-lg p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            {/* <Info className="inline m-2 h-3" /> */}
            <strong className="text-indigo-200">Privacy Notice:</strong> We do
            not misuse your ID or personal information. Your Google account is
            used solely for authentication and access to MailYaan.
          </motion.div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
}
