import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { ChevronLeft } from "lucide-react";

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

function handleGoogleSignIn() {
  const redirectUri = encodeURIComponent(
    window.location.origin + "/auth/callback"
  );
  const scope = encodeURIComponent("profile email");
  const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
  window.location.href = oauthUrl;
}

export default function Signup() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-gray-900 via-indigo-900 to-gray-800 relative">
      {/* Go Back Button */}
      <button
        className="absolute top-6 left-6 flex items-center gap-2 bg-indigo-200/50 py-2 px-1 rounded-lg hover:bg-indigo-500 hover:rounded-2xl transition-all pr-2 :text-indigo-400"
        onClick={() => router.back()}
      >
        <ChevronLeft />
        Go Back
      </button>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="bg-gray-900 p-10 rounded-2xl shadow-2xl min-w-[340px] text-center border border-gray-800"
      >
        <motion.img
          src="/logo.png"
          alt="Mailyaan Logo"
          className="w-14 mx-auto mb-4 drop-shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        />
        <motion.h2
          className="mb-2 font-bold text-2xl text-indigo-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Sign up to MailYaan
        </motion.h2>
        <motion.p
          className="text-indigo-100 mb-6 text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Create your account using Google
        </motion.p>
        <motion.button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 border-none hover:rounded-2xl rounded-lg py-3 w-full font-semibold text-lg text-white cursor-pointer transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-6 h-6"
          />
          Sign up with Google
        </motion.button>
        <motion.div
          className="mt-6 text-indigo-300 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-400 hover:underline font-medium"
          >
            Log in
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
