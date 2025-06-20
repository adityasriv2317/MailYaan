import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import GradientText from "@/ui/GradientText";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800"
    >
      <motion.header
        className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-800 backdrop-blur-md shadow-md top-0 z-20"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <Image src="/file.svg" alt="MailYaan Logo" width={36} height={36} />
          {/* <span className="text-2xl font-extrabold text-indigo-700 tracking-tight">
            MailYaan
          </span> */}
          <GradientText
            colors={["#ffffff", "#cccccc", "#ffffff"]}
            animationSpeed={3}
            showBorder={false}
          >
            MailYaan
          </GradientText>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-5 py-2 rounded-lg bg-white text-indigo-700 font-semibold shadow hover:bg-indigo-50 border border-indigo-100 transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold shadow hover:to-indigo-700 hover:from-blue-600 transition"
          >
            Sign Up
          </Link>
        </div>
      </motion.header>
      <motion.main
        className="flex-1 flex flex-col items-center justify-center text-center px-4 w-full"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <section className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 py-12">
          <div className="flex-1 flex flex-col items-start md:items-start text-left">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-indigo-50 mb-6 leading-tight">
              Automate Your{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text">
                Email Workflow
              </span>
            </h1>
            <p className="text-lg sm:text-2xl text-indigo-200 mb-8 max-w-xl">
              MailYaan uses AI to write, schedule, and track emails—boosting
              productivity and ensuring you never miss a follow-up.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link
                href="/learn"
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold text-lg shadow-lg hover:to-indigo-700 hover:from-blue-600 transition"
              >
                Learn More
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 rounded-lg bg-white/10 text-indigo-200 font-bold text-lg shadow-lg hover:bg-indigo-50/20 hover:text-white border border-indigo-500 transition"
              >
                Login
              </Link>
            </div>
            <ul className="flex flex-wrap gap-4 mt-2 text-sm text-indigo-500 font-medium">
              <li className="flex items-center gap-1">
                <span className="w-2 h-2 bg-indigo-400 rounded-full inline-block"></span>{" "}
                4 minds
              </li>
              <li className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full inline-block"></span>{" "}
                1 mission
              </li>
              <li className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>{" "}
                0 compromises
              </li>
            </ul>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Image
              src="/globe.svg"
              alt="MailYaan AI"
              width={260}
              height={260}
              className="drop-shadow-xl"
            />
          </div>
        </section>
      </motion.main>
      <motion.footer
        className="py-2 px-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-800 text-gray-300 border-t border-indigo-900 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-indigo-400 hover:underline">
            MailYaan
          </Link>
          <span className="hidden md:inline text-gray-500">|</span>
          <div className="text-xs text-gray-300 md:text-right w-full md:w-auto mt-2 md:mt-0">
            © {new Date().getFullYear()} MailYaan.
          </div>
        </div>
        <a
          href="https://fouram.adityasrivastava.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 cursor-pointer hover:bg-white/10 pl-1.5 pr-2 py-1 rounded-xl transition"
        >
          <Image
            src="/lg.png"
            alt="Next.js logo"
            width={30}
            height={30}
            className=""
          />
          <span className="text-xs text-indigo-300">
            Powered by <span className="text-gray-100">FourAM</span>
          </span>
        </a>
        <div className="flex items-center gap-4">
          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-gray-400"
          >
            Built with Next.js
          </a>
          <span className="hidden md:inline text-gray-500">&amp;</span>
          <a
            href="https://tailwindcss.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-gray-400"
          >
            Tailwind CSS
          </a>
        </div>
      </motion.footer>
    </motion.div>
  );
}
