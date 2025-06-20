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
            const validData = results.data.filter((row) =>
              requiredColumns.some((col) => row[col] && String(row[col]).trim() !== "") // Ensure value is treated as string
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
    // Main container with padding and margin
    <div id="csv-parser" className="csv-parser container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Upload Your Recipient List
      </h2>

      {/* File Input Section */}
      <div className="mb-6 p-6 border border-dashed border-indigo-300 rounded-lg bg-indigo-50 text-center">
        <label
          htmlFor="csv-upload"
          className="cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <UploadCloud size={20} className="mr-2" />
          Choose CSV File
        </label>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden" // Hide the default input
        />
        {fileName && (
          <p className="mt-3 text-sm text-gray-600">
            Selected file: <span className="font-medium">{fileName}</span>
          </p>
        )}
        {/* Updated helper text to mention FirstName */}
        <p className="mt-2 text-xs text-gray-500">
          Required columns: FirstName, Email, Organization, Achievement, Role
        </p>
      </div>

      {/* Error Message Display */}
      {error && (
        <div
          className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Make sure the Confirm button calls handleConfirmData */}
      {/* Make sure the Remove button calls handleRemoveData */}
      {/* Data Table Display */}
      {parsedData.length > 0 && (
        <div className="overflow-x-auto border border-indigo-600 shadow-md shadow-indigo-200 rounded-lg">
          {/* Header section for the table preview */}
          <div className="flex justify-between items-center mb-4 px-4 pt-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Preview Data ({parsedData.length} rows)
            </h3>
            {/* Confirm and Remove Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleRemoveData} // Ensure this calls the updated handler
                title="Remove Data"
                className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-colors duration-200"
              >
                <X size={20} />
              </button>
              <button
                onClick={handleConfirmData} // Ensure this calls the updated handler
                title="Confirm Data"
                className="p-2 rounded-full text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition-colors duration-200"
                // disabled={isConfirmed} // Optionally disable after confirming
              >
                <Check size={20} />
              </button>
            </div>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            {/* Ensure no whitespace directly inside thead or between thead and tr */}
            <thead className="bg-indigo-500 text-white">
              <tr>
                {/* Updated headers to expect FirstName */}
                {["FirstName", "Email", "Organization", "Achievement", "Role"].map(
                  (header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      {/* Display header, split camelCase for readability */}
                      {header.replace(/([A-Z])/g, " $1").trim()}
                    </th>
                  )
                )}
              </tr>
            </thead>
            {/* Ensure no whitespace between thead and tbody */}
            <tbody className="bg-white divide-y divide-gray-200">
              {parsedData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {/* Use row.FirstName directly */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.FirstName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.Email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.Organization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.Achievement}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
