import React, { useState } from "react";
import CSVParser from "../components/CSVparser";
import EmailEditor from "../components/EmailEditor";
import SendMails from "../components/SendMails";
import { motion } from "framer-motion";
import { ChevronLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/router";

const Hero = () => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative isolate px-6 lg:px-8"
    >
      {/* Back to Dashboard Button */}
      <button
        className="absolute top-6 left-6 flex items-center gap-2 bg-indigo-200/50 py-2 px-1 rounded-lg hover:bg-indigo-500 hover:rounded-2xl transition-all pr-2 hover:text-gray-50"
        onClick={() => router.back()}
      >
        <ChevronLeft />
        Go Back
      </button>
      <div className="mx-auto w-full select-none py-24 sm:py-36 lg:py-32">
        <div className="text-center">
          <motion.h1
            className="text-3xl sm:text-6xl font-extrabold tracking-tight text-indigo-100 flex items-center justify-center gap-3 mb-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
            Create an instant mailing list
          </motion.h1>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              type="button"
              className="rounded-lg bg-gradient-to-r from-indigo-700 to-blue-700 px-5 py-3 text-base font-semibold text-white shadow-lg hover:from-indigo-800 hover:to-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition"
              onClick={() => {
                const csvParserSection = document.getElementById("csv-parser");
                if (csvParserSection) {
                  csvParserSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Start
            </button>
            <a
              href="/learn"
              className="text-base font-semibold leading-6 text-indigo-200 hover:text-indigo-100 transition"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MailingLayout = () => {
  const [confirmedRecipients, setConfirmedRecipients] = useState([]);
  const [baseTemplate, setBaseTemplate] = useState(
    "<p>Hello {{FirstName}},</p><p>We noticed your recent achievement: {{Achievement}} at {{Organization}}.</p><p>Best regards,</p><p>Team Sampark AI</p>"
  );
  const [personalizedEmails, setPersonalizedEmails] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const fillTemplate = (template, recipient) => {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) =>
      recipient[key] !== undefined && recipient[key] !== null
        ? String(recipient[key])
        : ""
    );
  };

  const handleDataConfirm = (data) => {
    const processedData = data.map((recipient) => ({
      ...recipient,
      FirstName:
        recipient.FirstName ||
        (recipient.Name ? recipient.Name.split(" ")[0] : ""),
    }));
    setConfirmedRecipients(processedData);

    const defaultEmails = processedData.map((recipient) => ({
      recipient,
      subject: "Congratulations on Your Achievement",
      body: fillTemplate(baseTemplate, recipient),
    }));
    setPersonalizedEmails(defaultEmails);

    const emailEditorSection = document.querySelector(".email-editor");
    if (emailEditorSection) {
      emailEditorSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleEmailSave = (content) => {
    setBaseTemplate(content);
    const updatedEmails = confirmedRecipients.map((recipient) => ({
      recipient,
      subject: "Congratulations on Your Achievement",
      body: fillTemplate(content, recipient),
    }));
    setPersonalizedEmails(updatedEmails);
    setIsReady(true);
  };

  const handlePersonalizedEmails = (emails) => {
    setPersonalizedEmails(emails);
    setIsReady(true);
  };

  const handleClose = () => {
    setIsReady(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-950">
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-8">
        <Hero />
        <motion.div
          id="csv-parser"
          className="my-4 bg-indigo-950/80 rounded-2xl shadow-xl w-full max-w-5xl mx-auto border border-indigo-800"
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <CSVParser onDataConfirm={handleDataConfirm} />
        </motion.div>
        <motion.div
          className="email-editor my-12 bg-indigo-950/80 rounded-2xl shadow-xl w-full max-w-5xl mx-auto border border-indigo-800"
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <EmailEditor
            recipients={confirmedRecipients}
            onSave={handleEmailSave}
            initialContent={baseTemplate}
            onPersonalizedEmails={handlePersonalizedEmails}
          />
        </motion.div>
        {isReady && personalizedEmails.length > 0 && (
          <motion.div
            className="my-12 bg-indigo-950/80 rounded-2xl shadow-xl p-8 w-full max-w-2xl mx-auto border border-indigo-800"
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <SendMails emails={personalizedEmails} onClose={handleClose} />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default MailingLayout;
