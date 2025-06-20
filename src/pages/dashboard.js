import { useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Simple auth check
    if (typeof window !== "undefined" && !localStorage.getItem("mailyaan-auth")) {
      router.replace("/login");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("mailyaan-auth");
    router.push("/");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-blue-100"
    >
      <motion.header
        className="flex justify-between items-center px-8 py-6"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-indigo-700">MailYaan</span>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 rounded bg-indigo-700 text-white font-semibold shadow hover:bg-indigo-800 transition">Logout</button>
      </motion.header>
      <motion.main
        className="flex-1 flex flex-col items-center justify-center text-center px-4"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold text-indigo-800 mb-6">Welcome to your Dashboard</h1>
        <p className="text-lg sm:text-xl text-indigo-600 mb-8 max-w-2xl">
          Here you can manage your automated emails, view schedules, and let AI handle your communication.
        </p>
        <div className="bg-white rounded shadow p-8 w-full max-w-lg flex flex-col gap-4">
          <span className="font-semibold text-indigo-700">(Demo) No emails yet.</span>
          <button className="bg-indigo-700 text-white py-2 rounded font-semibold hover:bg-indigo-800 transition">Create New Campaign</button>
        </div>
      </motion.main>
    </motion.div>
  );
}
