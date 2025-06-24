import React, { useState } from "react";
import { Send, CircleX } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const SendMails = ({ emails = [], onSend, onClose }) => {
  const [scheduledTime, setScheduledTime] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    const user = localStorage.getItem("mailyaan-user");
    let sendersEmail = "";
    try {
      sendersEmail = user ? JSON.parse(user).email : "";
    } catch (e) {
      sendersEmail = "";
    }
    const token = localStorage.getItem("mailyaan-access-token");
    if (!sendersEmail) {
      alert("Could not determine your sender email. Please log in again.");
      return;
    }
    if (emails.length === 0) {
      alert("No emails to send.");
      return;
    }
    // Prepare receiversEmail and description arrays
    const receiversEmail = emails.map((mail) => mail.recipient?.Email || "");
    const description = emails.map((mail) => mail.body || "");
    const subject = emails[0]?.subject || "";
    if (receiversEmail.length !== description.length) {
      alert("Number of recipients and descriptions must match!");
      return;
    }
    setIsSending(true);
    try {
      let response;
      if (scheduledTime) {
        // Format scheduledTime as yyyy-MM-dd'T'HH:mm:ss (local time)
        const localDate = new Date(scheduledTime);
        const pad = (n) => n.toString().padStart(2, "0");
        const formattedTime = `${localDate.getFullYear()}-${pad(
          localDate.getMonth() + 1
        )}-${pad(localDate.getDate())}T${pad(localDate.getHours())}:${pad(
          localDate.getMinutes()
        )}:${pad(localDate.getSeconds())}`;
        response = await axios.post(
          "https://mailyaan.onrender.com/api/email/send-now",
          {
            sendersEmail,
            receiversEmail,
            subject,
            description,
            // scheduledTime: formattedTime,
          },
          {
            headers: { "access-token": token },
          }
        );
      } else {
        response = await axios.post(
          "https://mailyaan.onrender.com/api/email/send-now",
          {
            sendersEmail,
            receiversEmail,
            subject,
            description,
          },
          {
            headers: { "access-token": token },
          }
        );
      }
      if (response.status === 200) {
        alert(response.data || response.statusText);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Session expired or unauthorized. Please log in again.");
        window.location.href = "/auth";
      } else {
        alert(error.response?.data || "Error sending emails");
        console.error(error);
      }
    } finally {
      setIsSending(false);
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
            className="absolute z-50 top-5 right-6 w-fit p-2 bg-white/20 cursor-pointer rounded-full text-zinc-400 hover:bg-indigo-400 hover:text-white text-2xl font-bold focus:outline-none transition-colors shadow-lg"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <motion.span
              initial={{ rotate: 90, scale: 0.7, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <CircleX className="w-6 h-6" />
            </motion.span>
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
                min={new Date().toISOString().slice(0, 16)}
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
