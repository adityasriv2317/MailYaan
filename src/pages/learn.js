import Link from "next/link";
import { motion } from "framer-motion";
import {
  Upload,
  Mail,
  CalendarClock,
  Sparkles,
  Users,
  Timer,
  BarChart2,
  CheckCircle2,
} from "lucide-react";
import Footer from "@/components/footer";

export default function Learn() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 px-2 sm:px-0"
    >
      <div className="w-4/5 bg-gradient-to-tr to-gray-900 via-indigo-900 from-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-indigo-900 p-4 sm:p-8 flex flex-col gap-4 relative mt-8 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-100 mb-1 text-center">
          Learn How MailYaan Works
        </h1>
        <p className="text-indigo-200 text-base text-center mb-2">
          <span className="font-bold text-indigo-400">MailYaan</span> is an
          AI-powered email automation platform designed to help you send
          personalized, scheduled emails at scale with ease.
        </p>
        <h2 className="text-lg font-bold text-indigo-300 mt-2 mb-1 text-center">
          How Email Automation Works
        </h2>
        <ol className="space-y-3 bg-gray-900/70 rounded-xl shadow p-4">
          <li className="flex items-start gap-3">
            <span className="mt-1">
              <Upload className="w-6 h-6 text-indigo-400" />
            </span>
            <span>
              <span className="font-semibold text-indigo-400">
                Upload a CSV:
              </span>{" "}
              Start by uploading a CSV file containing your recipients. Make
              sure your file includes all required fields (e.g., name, email,
              custom fields).
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1">
              <Mail className="w-6 h-6 text-indigo-400" />
            </span>
            <span>
              <span className="font-semibold text-indigo-400">
                Compose Email Content:
              </span>{" "}
              Write a personalized email for each recipient, or use our built-in{" "}
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-indigo-300 inline" />
                AI
              </span>{" "}
              to generate tailored content for you.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1">
              <CalendarClock className="w-6 h-6 text-indigo-400" />
            </span>
            <span>
              <span className="font-semibold text-indigo-400">
                Schedule & Send:
              </span>{" "}
              Choose when to send your emails. You can schedule for later or
              send immediately. MailYaan handles delivery and tracking for you.
            </span>
          </li>
        </ol>
        <h2 className="text-lg font-bold text-indigo-300 mt-4 mb-1 text-center">
          Why MailYaan?
        </h2>
        <ul className="space-y-2 pl-0">
          <li className="flex items-center gap-2 text-indigo-100">
            <Users className="w-5 h-5 text-indigo-400" />
            Save time with bulk personalized emails
          </li>
          <li className="flex items-center gap-2 text-indigo-100">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Leverage AI to write better, more engaging content
          </li>
          <li className="flex items-center gap-2 text-indigo-100">
            <Timer className="w-5 h-5 text-indigo-400" />
            Easy scheduling and delivery management
          </li>
          <li className="flex items-center gap-2 text-indigo-100">
            <BarChart2 className="w-5 h-5 text-indigo-400" />
            Track opens, clicks, and replies in real time
          </li>
          <li className="flex items-center gap-2 text-indigo-100">
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
            Reliable validation and deliverability
          </li>
        </ul>
        <div className="flex justify-center mt-6">
          <Link
            href="/"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold shadow hover:from-indigo-700 hover:to-blue-600 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>

    </motion.div>
  );
}
