import React, { useState } from "react";
import { Send, CircleX } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
// import "../../styles/customScrollbar.css";

import "@/styles/customScrollbar.css";

const SendMails = ({ emails = [], onSend, onClose }) => {
  const [scheduledTime, setScheduledTime] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!scheduledTime) {
      alert("Please select a scheduled time.");
      return;
    }
    const user = localStorage.getItem("mailyaan-user");
    let userMail = "";
    try {
      userMail = user ? JSON.parse(user).email : "";
    } catch (e) {
      userMail = "";
    }
    const token = localStorage.getItem("mailyaan-access-token"); // Get JWT token
    if (onSend) onSend({ scheduledTime, emails });
    if (!isSending) {
      try {
        setIsSending(true);
        if (!userMail) {
          alert("Could not determine your sender email. Please log in again.");
          return;
        }

        // console.log("Sending emails with scheduled time:", scheduledTime);
        console.log("Emails to send:", emails);
        console.log("User email:", userMail);
        const response = await axios.post(
          "/api/send",
          {
            scheduledTime,
            emails,
            userMail,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          alert("Emails sent successfully");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("Session expired or unauthorized. Please log in again.");
          window.location.href = "/login";
        } else {
          alert("Error sending emails");
          console.error(error);
        }
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed w-full h-full z-50 inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center custom-scrollbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-6xl mx-auto rounded-3xl border border-indigo-500 bg-indigo-950/50 shadow-2xl px-6 py-10 overflow-y-auto max-h-[90vh] custom-scrollbar"
          initial={{ scale: 0.95, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Close Button */}
          <button
            className="absolute top-5 right-6 text-zinc-400 hover:text-indigo-400 text-2xl font-bold focus:outline-none transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <CircleX className="inline-block" />
          </button>
          <h2 className="text-3xl font-bold text-center mb-8 text-indigo-400 tracking-tight drop-shadow-lg">
            Review & Schedule Emails
          </h2>
          <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <label className="font-medium text-zinc-200 flex items-center gap-2">
              <span className="text-base">Schedule Send Time:</span>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="border border-indigo-700 bg-zinc-900 text-indigo-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
              />
            </label>
            <button
              className={`flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-semibold px-8 py-2 rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                isSending ? "opacity-60 cursor-not-allowed" : ""
              }`}
              onClick={handleSend}
              disabled={emails.length === 0 || isSending}
            >
              {isSending ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-2 border-2 border-t-transparent border-indigo-200 rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                <>
                  <Send className="inline-block w-5 h-5" />
                  Send
                </>
              )}
            </button>
          </div>
          <div className="overflow-x-auto border border-indigo-700 shadow-lg rounded-xl bg-zinc-900 custom-scrollbar">
            <table className="min-w-full divide-y divide-indigo-800">
              <thead className="bg-indigo-950">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Content
                  </th>
                </tr>
              </thead>
              <tbody>
                {emails.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-zinc-500 text-lg"
                    >
                      No emails to send.
                    </td>
                  </tr>
                ) : (
                  emails.map((mail, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-indigo-950/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-indigo-200 font-mono">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 text-zinc-100">
                        {mail.recipient?.FirstName ||
                          mail.recipient?.Name ||
                          "N/A"}
                      </td>
                      <td className="px-4 py-3 text-indigo-100">
                        {mail.recipient?.Email || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-indigo-200">
                        {mail.subject || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-zinc-200 max-w-xs break-words">
                        <div
                          className="prose prose-invert max-w-none text-sm"
                          dangerouslySetInnerHTML={{ __html: mail.body || "" }}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SendMails;
