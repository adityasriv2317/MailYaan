import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Footer() {
  return (
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
  );
}
