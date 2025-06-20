import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { MailCheck, PlusCircle, LogOut, Sparkles, User2 } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Simple auth check
    if (
      typeof window !== "undefined" &&
      !localStorage.getItem("mailyaan-auth")
    ) {
      router.replace("/login");
    }
    // Try to get user name from localStorage (or set a default)
    const user = localStorage.getItem("mailyaan-user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        // Show first name if possible
        const fullName = parsed.name || "User";
        const firstName = fullName.split(" ")[0];
        setUserName(firstName);
      } catch {
        setUserName("User");
      }
    } else {
      setUserName("User");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("mailyaan-auth");
    localStorage.removeItem("mailyaan-user");
    router.push("/");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-950"
    >
      <motion.header
        className="flex justify-between items-center px-6 py-5 shadow-md bg-indigo-900/80 backdrop-blur-md"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <MailCheck className="w-7 h-7 text-indigo-300" />
          <span className="text-2xl font-bold text-indigo-100 tracking-tight">
            MailYaan
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Profile button */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-800/70 hover:bg-indigo-700/80 transition cursor-pointer select-none shadow border border-indigo-700">
            <span className="bg-indigo-600 rounded-full p-1 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-indigo-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"
                />
              </svg>
            </span>
            <span
              className="text-indigo-100 font-medium text-base"
              id="dashboard-username"
            >
              {userName}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-700 to-blue-700 text-white font-semibold shadow hover:from-indigo-800 hover:to-blue-800 transition"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </motion.header>
      <motion.main
        className="flex-1 flex flex-col items-center justify-center text-center px-2 sm:px-0"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.h1
          className="text-3xl sm:text-5xl font-extrabold text-indigo-100 mb-4 flex items-center justify-center gap-3"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
          Welcome to your Dashboard
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl text-indigo-300 mb-8 max-w-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Here you can manage your automated emails, view schedules, and let AI
          handle your communication.
        </motion.p>
        <motion.div
          className="bg-indigo-950/80 rounded-2xl shadow-xl p-8 w-full max-w-lg flex flex-col gap-5 border border-indigo-800"
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span className="font-semibold text-indigo-300 flex items-center gap-2 justify-center">
            <MailCheck className="w-5 h-5 text-indigo-400" /> (Demo) No emails
            yet.
          </span>
          <button
            onClick={() => router.push("/create")}
            className="flex items-center gap-2 justify-center bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-2.5 rounded-lg font-semibold hover:from-indigo-800 hover:to-blue-800 transition text-base shadow"
          >
            <PlusCircle className="w-5 h-5" /> Create New Campaign
          </button>
        </motion.div>
      </motion.main>
    </motion.div>
  );
}
