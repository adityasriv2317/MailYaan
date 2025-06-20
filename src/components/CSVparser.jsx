import React, { useState } from "react";
import Papa from "papaparse";
// Import necessary icons
import { UploadCloud, Check, X } from "lucide-react";

// Remove the getFirstName helper function as it's no longer needed
// const getFirstName = (fullName) => { ... };

// Accept onDataConfirm prop
const CSVParser = ({ onDataConfirm }) => {
  const [parsedData, setParsedData] = useState([]);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  // const [isConfirmed, setIsConfirmed] = useState(false); // Keep track if data is confirmed locally if needed

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFileName(file.name); // Set the file name
      setError(""); // Clear previous errors
      setParsedData([]); // Clear previous data
      // setIsConfirmed(false); // Reset confirmation status on new file upload

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true, // Skip empty lines
        complete: (results) => {
          // Validate if the CSV has required columns - Changed "Name" to "FirstName"
          const requiredColumns = [
            "FirstName", // Expect FirstName directly
            "Email",
            "Organization",
            "Achievement",
            "Role",
          ];

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
            // Updated error message to reflect FirstName requirement
            setError(
              `Missing required columns: ${missingColumns.join(
                ", "
              )}. Please ensure your CSV has 'FirstName', 'Email', 'Organization', 'Achievement', and 'Role' columns.`
            );
            setParsedData([]);
            setFileName(""); // Clear filename on error
            if (onDataConfirm) onDataConfirm([]);
          } else {
            // Filter out rows where all required fields might be empty
            const validData = results.data.filter(
              (row) =>
                requiredColumns.some(
                  (col) => row[col] && String(row[col]).trim() !== ""
                ) // Ensure value is treated as string
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
      // setIsConfirmed(false);
      // Call onDataConfirm with empty array if file selection is cleared
      if (onDataConfirm) onDataConfirm([]);
    }
  };

  // Call onDataConfirm when data is confirmed
  const handleConfirmData = () => {
    // console.log("Data confirmed in CSVParser:", parsedData);
    // setIsConfirmed(true);
    if (onDataConfirm) {
      onDataConfirm(parsedData); // Pass the data up to the parent
    }
    // Keep the alert or provide other feedback
    // alert(`Confirmed ${parsedData.length} rows. You can now compose your email below.`);
  };

  // Call onDataConfirm with empty array when data is removed
  const handleRemoveData = () => {
    // console.log("Data removed");
    setParsedData([]);
    setFileName("");
    setError("");
    // setIsConfirmed(false);
    if (onDataConfirm) {
      onDataConfirm([]); // Pass empty array up to clear recipients in parent
    }
    // Reset the file input visually
    const fileInput = document.getElementById("csv-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div
      id="csv-parser"
      className="csv-parser container mx-auto px-4 py-10 bg-indigo-950/80 rounded-2xl shadow-xl border border-indigo-800 my-8"
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
          Required columns:{" "}
          <span className="font-semibold">
            FirstName, Email, Organization, Achievement, Role
          </span>
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
                title="Remove Data"
                className="p-2 rounded-full text-red-400 bg-red-900/60 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-colors duration-200"
              >
                <X size={20} />
              </button>
              <button
                onClick={handleConfirmData}
                title="Confirm Data"
                className="p-2 rounded-full text-green-400 bg-green-900/60 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition-colors duration-200"
              >
                <Check size={20} />
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y divide-indigo-800">
            <thead className="bg-indigo-800 text-indigo-100">
              <tr>
                {[
                  "FirstName",
                  "Email",
                  "Organization",
                  "Achievement",
                  "Role",
                ].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    {header.replace(/([A-Z])/g, " $1").trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-indigo-950 divide-y divide-indigo-900">
              {parsedData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-indigo-900/80 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-100">
                    {row.FirstName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-100">
                    {row.Email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-100">
                    {row.Organization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-100">
                    {row.Achievement}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-100">
                    {row.Role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CSVParser;
