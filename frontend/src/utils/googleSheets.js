/**
 * Fetches and parses a public Google Sheet tab as JSON.
 * The Google Sheet must be shared as "Anyone with the link can view".
 * 
 * @param {string} sheetId - The ID of the Google Sheet (from the URL).
 * @param {string} tabName - The name of the tab/sheet (e.g., "Stats", "Testimonials").
 * @returns {Promise<Array<Object>>} - Array of objects where keys are the column header names.
 */
export async function fetchGoogleSheetData(sheetId, tabName) {
  try {
    if (!sheetId || sheetId === "YOUR_GOOGLE_SHEET_ID_HERE") {
      return [];
    }

    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    
    // Google Sheets returns JSON wrapped in: google.visualization.Query.setResponse(...)
    const startIdx = text.indexOf("({");
    const endIdx = text.lastIndexOf("})");
    
    if (startIdx === -1 || endIdx === -1) {
      throw new Error("Invalid JSON structure returned from Google Sheets");
    }
    
    const jsonString = text.substring(startIdx + 1, endIdx + 1);
    const data = JSON.parse(jsonString);
    
    if (!data.table || !data.table.rows || data.table.rows.length === 0) {
      return [];
    }

    // Determine if the first row is a header row (in case Google Sheets fails to parse headers)
    const firstRowCells = data.table.rows[0].c;
    const firstRowValues = firstRowCells.map(cell => 
      cell && cell.v !== null ? String(cell.v).trim().toLowerCase().replace(/\s+/g, "_") : ""
    );
    
    const commonHeaders = ["title", "description", "name", "subtitle", "text", "question", "answer", "key", "value", "initials"];
    const isFirstRowHeader = firstRowValues.some(val => commonHeaders.includes(val));
    
    let headerNames = [];
    let startRowIndex = 0;
    
    if (isFirstRowHeader) {
      headerNames = firstRowValues;
      startRowIndex = 1; // Skip header row in data
    } else {
      // Use Google Sheet column labels if available, otherwise fallback to column indices (a, b, c...)
      headerNames = data.table.cols.map((col, index) => 
        col.label ? col.label.trim().toLowerCase().replace(/\s+/g, "_") : String.fromCharCode(97 + index)
      );
      startRowIndex = 0;
    }
    
    // Map rows to objects using headerNames as keys
    const rows = [];
    for (let i = startRowIndex; i < data.table.rows.length; i++) {
      const row = data.table.rows[i];
      if (!row || !row.c) continue;
      
      const rowData = {};
      row.c.forEach((cell, index) => {
        const colName = headerNames[index];
        if (colName) {
          rowData[colName] = cell && cell.v !== null ? cell.v : "";
        }
      });
      rows.push(rowData);
    }
    
    return rows;
  } catch (error) {
    console.error(`Error fetching Google Sheet tab "${tabName}":`, error);
    return [];
  }
}
