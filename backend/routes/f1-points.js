const express = require("express");
const { google } = require("googleapis");
const router = express.Router();
const path = require("path");

// Auth setup (adjust path if needed)
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const SPREADSHEET_ID = "1QZAMkQA2zd_WaP-B0wbOnqdWqN01cqNat7j6EXRnrqw";

router.get("/drivers", async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: '"Drivers & Teams"!A1:F21',
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
    console.error(
      "Detailed Sheets API error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to fetch data from Sheets",
      message: error.message,
      details: error.response?.data || "No additional details",
    });
  }
});

router.get("/race-scores", async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: '"Race Scores"!A1:U27',
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
    console.error(
      "Detailed Sheets API error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to fetch data from Sheets",
      message: error.message,
      details: error.response?.data || "No additional details",
    });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: '"Leaderboard"!A1:E9',
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
    console.error(
      "Detailed Sheets API error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to fetch data from Sheets",
      message: error.message,
      details: error.response?.data || "No additional details",
    });
  }
});

module.exports = router;
