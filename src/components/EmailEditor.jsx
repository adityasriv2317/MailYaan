import React, { useState, useEffect } from "react";
import { Save, User, Eye, Brain } from "lucide-react";
import axios from "axios";

// Accept recipients prop
const EmailEditor = ({ initialContent, onSave, recipients = [], onPersonalizedEmails }) => {
  const [content, setContent] = useState(initialContent || "");
  const [selectedRecipientIndex, setSelectedRecipientIndex] = useState(0);
  const [previewContent, setPreviewContent] = useState("");
  const [aiLoading, setAILoading] = useState(false);
  const [personalizedEmails, setPersonalizedEmails] = useState({});
  const [currentEditorText, setCurrentEditorText] = useState(content);

  // Update selected index if recipients list changes
  useEffect(() => {
    if (recipients.length > 0 && selectedRecipientIndex >= recipients.length) {
      setSelectedRecipientIndex(0);
    } else if (recipients.length === 0) {
      setSelectedRecipientIndex(0);
      setPreviewContent(""); // Clear preview
      setPersonalizedEmails({}); // Clear personalized emails when recipients change
    }
  }, [recipients, selectedRecipientIndex]);

  useEffect(() => {
    setPersonalizedEmails({});
    // If the editor was showing personalized text, reset it to the new base template
    setCurrentEditorText(content);
  }, [content]); // Only depends on content

  useEffect(() => {
    const currentBaseContent = String(content || "");
    let processedPreviewContent = currentBaseContent;
    let editorTextToShow = currentBaseContent;

    if (
      recipients.length > 0 &&
      selectedRecipientIndex >= 0 &&
      selectedRecipientIndex < recipients.length
    ) {
      const selectedRecipient = recipients[selectedRecipientIndex];

      if (personalizedEmails[selectedRecipientIndex]) {
        const { subject, body } = personalizedEmails[selectedRecipientIndex];
        // Format the preview with subject and body (HTML)
        processedPreviewContent = `<h3>Subject: ${subject}</h3><hr/>${body}`;
        editorTextToShow = `Subject: ${subject}\n\n${body}`;
      } else if (selectedRecipient) {
        try {
          processedPreviewContent = currentBaseContent.replace(
            /\{\{(\w+)\}\}/g,
            (match, key) => {
              return selectedRecipient[key] !== undefined &&
                selectedRecipient[key] !== null
                ? String(selectedRecipient[key])
                : "";
            }
          );
          // Editor shows the base template
          editorTextToShow = currentBaseContent;
        } catch (error) {
          console.error("Error during placeholder replacement:", error);
          processedPreviewContent =
            "<p>Error generating preview from template.</p>";
          editorTextToShow = currentBaseContent; // Show base template on error
        }
      } else {
        // Fallback if recipient data is invalid
        processedPreviewContent = currentBaseContent;
        editorTextToShow = currentBaseContent;
      }
    } else {
      // No recipients or invalid index, show base template
      processedPreviewContent = currentBaseContent;
      editorTextToShow = currentBaseContent;
    }

    setPreviewContent(processedPreviewContent);
    setCurrentEditorText(editorTextToShow);
  }, [content, selectedRecipientIndex, recipients, personalizedEmails]);

  const handleEditorChange = (event) => {
    const newValue = event.target.value;
    setContent(newValue);
    setCurrentEditorText(newValue);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(content);
    }
  };

  const handleRecipientChange = (event) => {
    setSelectedRecipientIndex(Number(event.target.value));
  };

  // Your existing generatePrompt function
  const generatePrompt = () => {
    let prompt = `Given the following list of individuals, each with their name, organization, recent achievement, and role:\n\n`;

    recipients.forEach((recipient) => {
      prompt += `Name: ${recipient.FirstName || "N/A"}\n`;
      prompt += `Organization: ${recipient.Organization || "N/A"}\n`;
      prompt += `Recent Achievement: ${recipient.Achievement || "N/A"}\n`;
      prompt += `Role: ${recipient.Role || "N/A"}\n\n`;
    });

    prompt += `For each person listed above, please generate a personalized email for an invitation to VBDA 2025. The email should be engaging and relevant to their achievement and role.\n`;
    prompt += `Respond ONLY with a valid JSON array. Each object in the array should correspond to a person in the order provided and contain the following keys:\n`;
    prompt += `- "Name": The person's name.\n`;
    prompt += `- "Email Subject": A concise and personalized subject line for the email.\n`;
    prompt += `- "Email Body": The full personalized body of the email (use HTML for basic formatting like paragraphs <p> and bold <b> if appropriate).\n\n`;
    prompt += `Example JSON object structure: {"Name": "Jane Doe", "Email Subject": "Invitation to VBDA 2025 for Innovators like You!", "Email Body": "<p>Dear Jane,...</p>"}\n`;
    prompt += `Please provide answer in following structure, without any introductory text, code fences, or explanations.
    
    [
  {
    "Name": "Ananya",
    "Organization": "TechSpark",
    "Recent Achievement": "Raised $50M Series B for AI-powered healthcare",
    "Role": "CEO",
    "Hook": "Personalized hook message for email",
    "Email Content": "Complete email content with formatting markers"
  },
  {
    "Name": "Rahul",
    "Organization": "InnovateX",
    "Recent Achievement": "Developed a new blockchain protocol",
    "Role": "CTO",
    "Hook": "Personalized hook message for email",
    "Email Content": "Complete email content with formatting markers"
  },
  // Additional objects
]

    `;

    return prompt;
  };

  function extract(raw) {
    // Remove ```json and ```
    const cleaned = raw
      .replace(/```json/, "")
      .replace(/```/, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (e) {
      console.error("Invalid JSON after cleanup");
      try {
        const evaluated = eval(`(${cleaned})`);
        if (Array.isArray(evaluated)) {
          console.warn("Used eval to parse potentially malformed JSON.");
          return evaluated;
        }
      } catch (evalError) {
        console.error("Failed to parse JSON even with eval:", evalError);
      }
      return null;
    }
  }

  const handleEmailGenerate = async () => {
    if (recipients.length === 0) {
      alert("Please upload a recipient list first.");
      return;
    }

    setAILoading(true);
    setPersonalizedEmails({}); // Clear previous results

    try {
      const key = import.meta.env.VITE_apI_KEY;
      const api = import.meta.env.VITE_genApi;
      const prompt = generatePrompt();

      const requestData = {
        contents: [{ parts: [{ text: prompt }] }],
      };

      const response = await axios.post(`${api}${key}`, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const responseText =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      //  console.log("Raw AI Response Text:", responseText); // Log the raw response text

        // Use the extract function to clean and parse the JSON
        const responseObject = extract(responseText);

      //  console.log("Parsed Response Object:", responseObject); // Log the parsed object

        if (responseObject && Array.isArray(responseObject)) {
          const newPersonalizedEmails = {};
          responseObject.forEach((item, index) => {
            // Check if the item has the required fields and matches recipient index
            if (
              index < recipients.length &&
              item && // Ensure item is not null/undefined
              item["Email Subject"] &&
              item["Email Body"] // Use the fields specified in the prompt
            ) {
              newPersonalizedEmails[index] = {
                subject: item["Email Subject"],
                body: item["Email Body"],
              };
            } else {
              console.warn(
                `Mismatch, missing data, or invalid item structure for index ${index}:`,
                item // Log the problematic item
              );
              // Optionally provide default values or skip
              // newPersonalizedEmails[index] = { subject: 'Default Subject', body: '<p>Default Body</p>' };
            }
          });

          // Check if any emails were successfully generated
          if (Object.keys(newPersonalizedEmails).length > 0) {
            setPersonalizedEmails(newPersonalizedEmails);
            // Pass the personalized emails up to parent
            if (onPersonalizedEmails) {
              // Convert to array of { recipient, subject, body }
              const emailsArray = Object.entries(newPersonalizedEmails).map(([idx, val]) => ({
                recipient: recipients[idx],
                subject: val.subject,
                body: val.body,
              }));
              onPersonalizedEmails(emailsArray);
            }
            alert(
              `Generated personalized content for ${
                Object.keys(newPersonalizedEmails).length
              } recipients. Check the preview.`
            );
          } else {
            console.error(
              "No valid personalized emails could be extracted from the response."
            );
            alert(
              "Error: Could not extract valid email content from the AI response. Please check the console and the raw AI response."
            );
          }
        } else {
          console.error(
            "Failed to parse AI response into the expected array format. Response object:",
            responseObject // Log the result of parsing
          );
          alert(
            "Error: Could not process the generated content. The response was not a valid array. Please check the console."
          );
        }
      } else {
        console.error(
          "AI API request failed with status:",
          response.status,
          "Data:",
          response.data
        );
        alert(`Error: AI request failed with status ${response.status}.`);
      }
    } catch (error) {
      console.error(
        "Error during email generation process:",
        error.response ? error.response.data : error.message,
        error.stack // Log stack trace for more details
      );
      alert(
        "An error occurred while generating emails. Please check the console for details."
      );
    } finally {
      setAILoading(false);
    }
  };

  return (
    <div className="email-editor w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl border-b-2 text-indigo-500 border-b-indigo-600 w-fit mx-auto font-semibold text-center mb-6">
        Compose Your Email
      </h2>

      {/* Updated hint text & AI Button container */}
      <div className="w-full text-center relative mb-4">
        {/* ai button */}
        <button
          className={`absolute top-0 right-0 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full transition-opacity duration-200 ${
            recipients.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleEmailGenerate}
          disabled={aiLoading || recipients.length === 0}
          title={
            recipients.length === 0
              ? "Upload recipients to enable AI generation"
              : "Generate AI Content for All Recipients"
          }
        >
          <Brain className={`${aiLoading ? "animate-spin" : ""} w-5 h-5`} />
        </button>

        <p className="text-xs text-gray-500">
          Use placeholders like FirstName, Email, Organization, Achievement,
          Role in your email template below.
        </p>
        <p className="mt-1 mb-2 text-xs text-gray-500">
          Click the <Brain size={12} className="inline -mt-1" /> button to
          generate personalized content for all recipients based on the template <br/>
          structure and their data.
        </p>
      </div>

      <div className="email-editor-container border border-gray-300 rounded-lg overflow-hidden shadow-sm mb-6 bg-white p-1">
        <textarea
          value={currentEditorText} // Bind value to the new state
          onChange={handleEditorChange} // Use the updated handler
          className="w-full min-h-80 p-2 border-none focus:ring-0 focus:outline-none resize-none text-sm font-mono"
          placeholder="Enter your base email template here. Use HTML tags for formatting..."
        />
      </div>

      {/* Recipient Selector - Only show if recipients exist */}
      {recipients.length === 0 && (
        <p className="mb-6 text-center text-gray-500 italic">
          Upload and confirm a recipient list above to enable preview.
        </p>
      )}

      {/* Preview Section - Only show if recipients exist */}
      {recipients.length > 0 && (
        <div className="email-preview mt-8">
          <div className="flex items-center justify-between mb-4">
            {" "}
            {/* Adjusted margin */}
            <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <Eye size={20} /> Live Preview (for{" "}
              {recipients[selectedRecipientIndex]?.FirstName || "Selected User"}
              )
            </h3>
            {/* Moved recipient selector here for better layout */}
            <div className="flex items-center gap-2">
              {" "}
              {/* Adjusted alignment */}
              <label
                htmlFor="recipient-select"
                className="text-sm font-medium text-gray-700 flex items-center gap-1" // Reduced gap
              >
                <User size={16} /> Recipient:
              </label>
              <select
                id="recipient-select"
                value={selectedRecipientIndex}
                onChange={handleRecipientChange}
                className="block w-auto pl-3 pr-10 py-1.5 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm" // Adjusted padding/border
              >
                {recipients.map((recipient, index) => (
                  <option key={index} value={index}>
                    {`${index + 1}. ${recipient.FirstName || "N/A"} (${
                      recipient.Email || "N/A"
                    })`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Preview Content Area */}
          <div
            className="preview-content p-4 border border-gray-300 rounded-lg bg-gray-50 min-h-[200px] shadow-inner prose max-w-none"
            dangerouslySetInnerHTML={{ __html: String(previewContent || "") }} // Preview uses HTML content
          />
        </div>
      )}

      {/* Save Button */}
      <div className="email-editor-actions mt-6 text-right">
        <button
          className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
            recipients.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSave}
          disabled={recipients.length === 0} // Disable if no recipients
          title={
            recipients.length === 0
              ? "Upload recipients to enable saving"
              : "Save Base Email Template"
          }
        >
          <Save size={18} className="mr-2" />
          Save Template
        </button>
      </div>
    </div>
  );
};

export default EmailEditor;
