const fs = require("fs");

function readFile(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;

  // Read the file content as plain text
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading the CSV file." });
    }

    const results = [];
    const rows = data.split("\n").map((row) => row.trim()); // Split by newline and trim each row

    // Get the headers from the first row
    const headers = rows[0].split(";").map((header) => header.trim());

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(";").map((col) => col.trim());

      if (row.length === headers.length) {
        const result = {};

        for (let j = 0; j < headers.length; j++) {
          if (headers[j] === "S. No.") {
            result[headers[j]] = row[j].replace(/['"]+/g, ""); // Remove quotes
          } else if (headers[j] === "Input Image Urls") {
            result[headers[j]] = row[j]
              .split(",")
              .map((url) => url.trim().replace(/["']/g, ""));
          } else {
            result[headers[j]] = row[j];
          }
        }

        results.push(result);
      }
    }

    req.csvData = results; // Attach parsed data to the request object
    next(); // Proceed to the next middleware
  });
}

module.exports = {
  readFile,
};
