import { useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Eye, EyeOff, Mail as MailIcon, Lock } from "lucide-react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { Loader2 } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setError("");
    let valid = true;
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }
    if (!password) {
      setPasswordError("Please enter your password.");
      valid = false;
    }
    if (!recaptchaValue) {
      setError("Please verify that you are not a robot.");
      return;
    }
    if (!valid) return;
    setLoading(true);
    try {
      const res = await axios.post("/login", {
        email,
        password,
        recaptchaToken: recaptchaValue,
      });
      if (res.status !== 200) {
        setError(res.data.message || "Login failed.");
        setLoading(false);
        return;
      }
      // Success
      localStorage.setItem("mailyaan-auth", "true");
      router.push("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Server error. Please try again later."
      );
      console.error("Login error:", err);
      setLoading(false);
    }
    setLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 px-2 sm:px-0"
    >
      <button
        type="button"
        onClick={() => router.push("/")}
        className="absolute top-8 left-8 self-start mb-2 px-2 py-1.5 flex item-center flex-row justify-center rounded-lg bg-gray-600 text-indigo-300 hover:bg-indigo-800 hover:text-white text-xs font-semibold transition shadow"
      >
        <ChevronLeft />
      </button>
      <motion.form
        onSubmit={handleLogin}
        action="/api/auth/login"
        method="POST"
        className="w-full max-w-md bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-indigo-900 p-6 sm:p-10 flex flex-col gap-6 relative"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex flex-col items-center mb-2">
          <motion.h2
            className="text-2xl sm:text-3xl font-extrabold text-indigo-100 tracking-tight text-center flex items-center gap-2"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Lock className="w-7 h-7 text-indigo-400" />
            Login to <span className="text-indigo-400">MailYaan</span>
          </motion.h2>
        </div>
        <AnimatePresence>
          {error && (
            <motion.div
              className="text-red-400 text-sm text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex flex-col gap-1">
          <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
            <motion.input
              type="email"
              placeholder="Email"
              className={`pl-10 border w-full border-indigo-800 bg-gray-900 text-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 p-3 rounded-lg transition outline-none text-base placeholder:text-indigo-400 ${
                emailError ? "border-red-500" : ""
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              onBlur={() =>
                setEmailError(
                  validateEmail(email)
                    ? ""
                    : "Please enter a valid email address."
                )
              }
            />
          </div>
          <AnimatePresence>
            {emailError && (
              <motion.div
                className="text-red-400 text-xs pl-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {emailError}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative flex flex-col gap-0">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
            <motion.input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`pl-10 border border-indigo-800 bg-gray-900 text-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 p-3 rounded-lg transition outline-none text-base w-full pr-12 placeholder:text-indigo-400 ${
                passwordError ? "border-red-500" : ""
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              onBlur={() =>
                setPasswordError(password ? "" : "Please enter your password.")
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-800/70 hover:bg-indigo-700 text-indigo-400 hover:text-white focus:outline-none transition"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="min-h-[20px]">
            <AnimatePresence>
              {passwordError && (
                <motion.div
                  className="text-red-400 text-xs pl-1 mt-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  {passwordError}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center mt-2">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            theme="dark"
            onChange={(value) => {
              setRecaptchaValue(value);
              setError("");
            }}
          />
        </div>
        <motion.button
          type="submit"
          className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-3 rounded-lg font-bold shadow-lg hover:from-indigo-800 hover:to-blue-800 transition text-lg mt-2 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : null}
          Login
        </motion.button>
        <motion.p
          className="text-sm text-center mt-2 text-indigo-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-400 hover:underline font-semibold"
          >
            Sign up
          </a>
        </motion.p>
      </motion.form>
    </motion.div>
  );
}
