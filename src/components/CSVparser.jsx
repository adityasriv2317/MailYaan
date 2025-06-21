import React, { useState, useRef } from "react";
import Papa from "papaparse";
// Import necessary icons
import { UploadCloud, Check, X } from "lucide-react";

// Accept onDataConfirm prop
const CSVParser = ({ onDataConfirm }) => {
  const [parsedData, setParsedData] = useState([]);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const bottomRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFileName(file.name);
      setError("");
      setParsedData([]);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Require Name and Email, Description is optional
          const requiredColumns = ["Name", "Email"];
          const optionalColumns = ["Description"];

          const headerRow = results.meta.fields;
          if (!headerRow) {
            setError(
              "Could not detect headers in the CSV file. Ensure the first row contains headers."
            );
            setParsedData([]);
            setFileName("");
            if (onDataConfirm) onDataConfirm([]);
            return;
          }

          const missingColumns = requiredColumns.filter(
            (col) => !headerRow.includes(col)
          );

          if (missingColumns.length > 0) {
            setError(
              `Missing required columns: ${missingColumns.join(
                ", "
              )}. Please ensure your CSV has 'Name' and 'Email' columns.`
            );
            setParsedData([]);
            setFileName(""); // Clear filename on error
            if (onDataConfirm) onDataConfirm([]);
          } else {
            // Filter out rows where all required fields might be empty
            const validData = results.data.filter((row) =>
              requiredColumns.some(
                (col) => row[col] && String(row[col]).trim() !== ""
              )
            );
            if (validData.length === 0 && results.data.length > 0) {
              setError(
                "CSV parsed, but no valid data rows found (rows might be empty or lack required fields)."
              );
              setParsedData([]);
              if (onDataConfirm) onDataConfirm([]);
            } else {
              setParsedData(validData);
              setError("");
            }
          }
        },
        error: (error) => {
          setError("Error parsing CSV file: " + error.message);
          setParsedData([]);
          setFileName(""); // Clear filename on error
          if (onDataConfirm) onDataConfirm([]);
        },
      });
    } else {
      setFileName(""); // Clear filename if no file is selected
      setParsedData([]);
      setError("");
      if (onDataConfirm) onDataConfirm([]);
    }
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Call onDataConfirm when data is confirmed
  const handleConfirmData = () => {
    if (onDataConfirm) {
      onDataConfirm(parsedData); // Pass the data up to the parent
    }
  };

  // Call onDataConfirm with empty array when data is removed
  const handleRemoveData = () => {
    setParsedData([]);
    setFileName("");
    setError("");
    if (onDataConfirm) {
      onDataConfirm([]);
    }
    const fileInput = document.getElementById("csv-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Remove a single recipient by index
  const handleRemoveRecipient = (index) => {
    const updatedData = parsedData.filter((_, i) => i !== index);
    setParsedData(updatedData);
    if (onDataConfirm) {
      onDataConfirm(updatedData);
    }
  };

  return (
    <div
      id="csv-parser"
      className="csv-parser container mx-auto select-none px-4 py-10 bg-indigo-950/80 rounded-2xl shadow-xl border border-indigo-800"
    >
      <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-100 text-center mb-6 flex items-center justify-center gap-2">
        <UploadCloud className="w-7 h-7 text-indigo-400 animate-bounce" />
        Upload Your Recipient List
      </h2>
      {/* File Input Section */}
      <div className="mb-6 p-6 border border-dashed border-indigo-400 rounded-xl bg-indigo-900/60 text-center flex flex-col items-center">
        <label
          htmlFor="csv-upload"
          className="cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-700 to-blue-700 hover:from-indigo-800 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 shadow"
        >
          <UploadCloud size={20} className="mr-2" />
          Choose CSV File
        </label>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
        {fileName && (
          <p className="mt-3 text-sm text-indigo-200">
            Selected file: <span className="font-medium">{fileName}</span>
          </p>
        )}
        <p className="mt-2 text-xs text-indigo-300">
          Required columns: <span className="font-semibold">Name, Email</span>
          <br />
          <span className="text-indigo-400">Optional: Description</span>
        </p>
      </div>
      {/* Error Message Display */}
      {error && (
        <div
          className="mb-6 p-4 bg-red-900/80 border border-red-500 text-red-200 rounded-lg shadow"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      {/* Data Table Display */}
      {parsedData.length > 0 && (
        <div className="overflow-x-auto border border-indigo-700 shadow-lg rounded-xl bg-indigo-950/90">
          <div className="flex justify-between items-center mb-4 px-4 pt-4">
            <h3 className="text-xl font-semibold text-indigo-100">
              Preview Data{" "}
              <span className="text-indigo-400">
                ({parsedData.length} rows)
              </span>
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleRemoveData}
                title="Clear Data"
                className="p-2 rounded-full cursor-pointer text-red-400 bg-red-900/60 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-colors duration-200"
              >
                <X size={20} />
              </button>
              <button
                onClick={() => {
                  handleConfirmData();
                  if (parsedData.length > 0) scrollToBottom();
                }}
                title="Confirm Data"
                className="p-2 rounded-full text-green-400 cursor-pointer bg-green-900/60 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition-colors duration-200"
              >
                <Check size={20} />
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y divide-indigo-800">
            <thead className="bg-indigo-800 text-indigo-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-indigo-950 divide-y divide-indigo-900">
              {parsedData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-indigo-900/80 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-100">
                    {row.Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-100">
                    {row.Email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-100">
                    {row.Description || (
                      <span className="italic text-indigo-400">(none)</span>
                    )}
                  </td>
                  <td className="px-2 py-4 text-center">
                    <button
                      onClick={() => handleRemoveRecipient(index)}
                      title="Remove this recipient"
                      className="p-1.5 rounded-full text-red-400 bg-red-900/60 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-colors duration-200"
                    >
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default CSVParser;
