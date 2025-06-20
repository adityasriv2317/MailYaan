import React, { useState } from "react";
import { Send, CircleX } from "lucide-react";
import axios from "axios";

const SendMails = ({ emails = [], onSend, onClose }) => {
  const [scheduledTime, setScheduledTime] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!scheduledTime) {
      alert("Please select a scheduled time.");
      return;
    }
    if (onSend) onSend({ scheduledTime, emails });
    // alert(`Emails scheduled for ${scheduledTime} (mock send)`);

    // send using axios
    if (!isSending) {
      try {
        setIsSending(true);
        const sendApi = import.meta.env.VITE_SEND_BULK;

        const response = await axios.post(sendApi, {
          scheduledTime,
          emails,
        });

        if (response.status === 200) {
          alert("Emails sent successfully");
        }
      } catch (error) {
        alert("Error sending emails");
        console.error(error);
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <div className="fixed w-full h-full z-50 inset-0 bg-black/50">
      <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-4/5 h-6/7 rounded-2xl border-indigo-400 border px-4 py-8 bg-white overflow-y-scroll shadow-xl">
        {/* Close Button */}
        <button
          className="absolute top-4 right-6 text-gray-400 hover:text-indigo-600 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          {/* &times; */}
          <CircleX className="inline-block" />
        </button>
        <h2 className="text-2xl border-b-2 text-indigo-500 border-b-indigo-600 w-fit mx-auto font-semibold text-center mb-6">
          Review Emails
        </h2>
        <div className="mb-6 mx-2 flex flex-col md:flex-row items-center justify-between">
          <label className="font-medium text-gray-700">
            Schedule Send Time:
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="ml-2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
          <button
            className={`${
              isSending ? "cursor-not-allowed" : "cursor-pointer"
            } bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded transition-colors duration-200`}
            onClick={handleSend}
            disabled={emails.length === 0}
          >
            {isSending ? (
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <Send className="inline-block mr-2" />
                Send
              </>
            )}
          </button>
        </div>
        <div className="overflow-x-auto border border-indigo-600 shadow-md rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  #
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  Recipient
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  Subject
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  Content
                </th>
              </tr>
            </thead>
            <tbody>
              {emails.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    No emails to send.
                  </td>
                </tr>
              ) : (
                emails.map((mail, idx) => (
                  <tr key={idx} className="hover:bg-indigo-50">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">
                      {mail.recipient?.FirstName ||
                        mail.recipient?.Name ||
                        "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {mail.recipient?.Email || "N/A"}
                    </td>
                    <td className="px-4 py-2">{mail.subject || "N/A"}</td>
                    <td className="px-4 py-2">
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: mail.body || "" }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SendMails;
