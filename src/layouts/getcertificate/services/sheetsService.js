import axios from "axios";
import { getSheetsValuesUrl, getGoogleSheetsConfig } from "../services/config";

export async function fetchHackathonWinners() {
  const { apiKey } = getGoogleSheetsConfig();
  if (!apiKey) {
    const error = new Error("Google API key is missing");
    error.code = "NO_API_KEY";
    throw error;
  }

  const url = getSheetsValuesUrl();
  const response = await axios.get(url);
  const values = response?.data?.values;

  if (!values || values.length === 0) {
    const error = new Error("No data found in the sheet");
    error.code = "EMPTY_SHEET";
    throw error;
  }

  const [headers, ...rows] = values;
  // Expecting columns: 0 timestamp, 2 metamaskId, 3 name, 4 certificateId
  const formatted = rows.map((row) => ({
    timestamp: row[0],
    name: row[3],
    metamaskId: row[2],
    certificateId: row[4] || "N/A",
  }));
  return formatted;
}


