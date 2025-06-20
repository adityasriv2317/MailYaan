import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CSVParser from "../components/CSVparser";
import EmailEditor from "../components/EmailEditor";
import SendMails from "../components/SendMails";

const Hero = () => {
  return (
    <div className="relative isolate px-6 lg:px-8">
      <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-44">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Create an instant mailing list
          </h1>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
              href="#features"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Hero />
        <CSVParser onDataConfirm={handleDataConfirm} />
        <EmailEditor
          recipients={confirmedRecipients}
          onSave={handleEmailSave}
          initialContent={baseTemplate}
          onPersonalizedEmails={handlePersonalizedEmails}
        />
        {isReady && personalizedEmails.length > 0 && (
          <SendMails emails={personalizedEmails} onClose={handleClose} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MailingLayout;
