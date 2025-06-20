import { useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Mail as MailIcon,
  Lock,
  UserPlus,
} from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [nameError, setNameError] = useState("");
  const [genderError, setGenderError] = useState("");

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePassword(password) {
    // At least 8 chars, 1 letter, 1 number
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/.test(
      password
    );
  }

  function handleSignup(e) {
    e.preventDefault();
    let valid = true;
    setNameError("");
    setGenderError("");
    setEmailError("");
    setPasswordError("");
    setConfirmError("");
    setError("");
    setRecaptchaError("");

    if (!name.trim()) {
      setNameError("Please enter your name.");
      valid = false;
    }
    if (!gender) {
      setGenderError("Please select your gender.");
      valid = false;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters and contain a letter and a number."
      );
      valid = false;
    }
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      valid = false;
    }
    if (!recaptchaValue) {
      setRecaptchaError("Please verify that you are not a robot.");
      valid = false;
    }
    if (!valid) return;
    // Simulate signup
    localStorage.setItem("mailyaan-auth", "true");
    router.push("/dashboard");
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
        onSubmit={handleSignup}
        className="w-full max-w-sm bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800/90 backdrop-blur-md rounded-xl shadow-xl border border-indigo-900 p-4 sm:p-6 flex flex-col gap-4 relative"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex flex-col items-center mb-1">
          <motion.h2
            className="text-xl sm:text-2xl font-extrabold text-indigo-100 tracking-tight text-center flex items-center gap-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <UserPlus className="w-6 h-6 text-indigo-400" />
            Create your <span className="text-indigo-400">MailYaan</span>{" "}
            account
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
        {/* Name Field */}
        <div className="flex flex-col gap-0">
          <div className="relative">
            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
            <motion.input
              type="text"
              placeholder="Full Name"
              className={`pl-10 border w-full border-indigo-800 bg-gray-900 text-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 p-2.5 rounded-lg transition outline-none text-sm placeholder:text-indigo-400 ${
                nameError ? "border-red-500" : ""
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              initial={{ x: -15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              onBlur={() =>
                setNameError(name.trim() ? "" : "Please enter your name.")
              }
            />
          </div>
          <AnimatePresence>
            {nameError && (
              <motion.div
                className="text-red-400 text-xs pl-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {nameError}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Gender Field */}
        <div className="flex flex-col gap-0">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none">
              <UserPlus className="w-5 h-5 text-indigo-400" />
            </span>
            <select
              className={`pl-10 border border-indigo-800 bg-gray-900 text-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 p-2.5 rounded-lg transition outline-none text-sm appearance-none w-full ${
                genderError ? "border-red-500" : ""
              }`}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              onBlur={() =>
                setGenderError(gender ? "" : "Please select your gender.")
              }
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
          <AnimatePresence>
            {genderError && (
              <motion.div
                className="text-red-400 text-xs pl-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {genderError}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col gap-0">
          <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
            <motion.input
              type="email"
              placeholder="Email"
              className={`pl-10 border w-full border-indigo-800 bg-gray-900 text-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 p-2.5 rounded-lg transition outline-none text-sm placeholder:text-indigo-400 ${
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
              className={`pl-10 border border-indigo-800 bg-gray-900 text-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 p-2.5 rounded-lg transition outline-none text-sm w-full pr-12 placeholder:text-indigo-400 ${
                passwordError ? "border-red-500" : ""
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              onBlur={() =>
                setPasswordError(
                  validatePassword(password)
                    ? ""
                    : "Password must be at least 8 characters and contain a letter and a number."
                )
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-800/70 hover:bg-indigo-700 text-indigo-400 hover:text-white focus:outline-none transition"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)" }}
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
        <div className="relative flex flex-col gap-0">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
            <motion.input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={`pl-10 border border-indigo-800 bg-gray-900 text-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 p-2.5 rounded-lg transition outline-none text-sm w-full pr-12 placeholder:text-indigo-400 ${
                confirmError ? "border-red-500" : ""
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              onBlur={() =>
                setConfirmError(
                  password === confirmPassword ? "" : "Passwords do not match."
                )
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-800/70 hover:bg-indigo-700 text-indigo-400 hover:text-white focus:outline-none transition"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)" }}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="min-h-[20px]">
            <AnimatePresence>
              {confirmError && (
                <motion.div
                  className="text-red-400 text-xs pl-1 mt-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  {confirmError}
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
              setRecaptchaError("");
            }}
          />
          <AnimatePresence>
            {recaptchaError && (
              <motion.div
                className="text-red-400 text-xs pl-1 mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {recaptchaError}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.button
          type="submit"
          className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-3 rounded-lg font-bold shadow-lg hover:from-indigo-800 hover:to-blue-800 transition text-lg mt-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Sign Up
        </motion.button>
        <motion.p
          className="text-sm text-center mt-2 text-indigo-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-400 hover:underline font-semibold"
          >
            Login
          </a>
        </motion.p>
      </motion.form>
    </motion.div>
  );
}
