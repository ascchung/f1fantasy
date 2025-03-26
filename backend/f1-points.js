const express = require("express");
const { google } = require("googleapis");
const router = express.Router();
const path = require("path");

// Auth setup (adjust path if needed)
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "../config/google-credentials.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const SPREADSHEET_ID =
  "https://docs.google.com/spreadsheets/d/1oBThAbHh_5W5dzOGMXx8USlsXqaop_1h/edit?gid=1917170938#gid=1917170938";

router.get("/drivers", async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'Drivers & Teams'!A1:Z100`, // adjust range as needed
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No data found in sheet." });
    }

    // Convert rows to objects using the header row
    const headers = rows[0];
    const data = rows.slice(1).map((row) =>
      headers.reduce((obj, key, i) => {
        obj[key] = row[i];
        return obj;
      }, {})
    );

    res.json({ data });
  } catch (error) {
    console.error("Error fetching Drivers & Teams:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch data from Drivers & Teams" });
  }
});

router.get("/race-scores", async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'Race Scores'!A1:Z100`,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No race scores found." });
    }

    const headers = rows[0];
    const data = rows.slice(1).map((row) =>
      headers.reduce((obj, key, i) => {
        obj[key] = row[i];
        return obj;
      }, {})
    );

    res.json({ data });
  } catch (error) {
    console.error("Error fetching Race Scores:", error);
    res.status(500).json({ error: "Failed to fetch race scores data" });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'Leaderboard'!A1:Z100`,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No leaderboard data found." });
    }

    const headers = rows[0];
    const data = rows.slice(1).map((row) =>
      headers.reduce((obj, key, i) => {
        obj[key] = row[i];
        return obj;
      }, {})
    );

    res.json({ data });
  } catch (error) {
    console.error("Error fetching Leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard data" });
  }
});

module.exports = router;
