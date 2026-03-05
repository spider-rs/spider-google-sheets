/**
 * Bulk scrape URLs from selected cells and write results to adjacent columns.
 */
function bulkScrapeSelection(): void {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getActiveRange();
  if (!range) {
    SpreadsheetApp.getUi().alert("Select cells containing URLs first.");
    return;
  }

  const urls = range.getValues();
  const startRow = range.getRow();
  const outputCol = range.getColumn() + range.getNumColumns();
  const format = PropertiesService.getUserProperties().getProperty("SPIDER_DEFAULT_FORMAT") || "markdown";

  // Write header
  sheet.getRange(startRow - 1 > 0 ? startRow - 1 : startRow, outputCol).setValue("Spider Content");

  let row = startRow;
  for (const urlRow of urls) {
    for (const cell of urlRow) {
      const url = String(cell).trim();
      if (!url || !url.startsWith("http")) {
        sheet.getRange(row, outputCol).setValue("Skipped: not a URL");
        row++;
        continue;
      }

      try {
        const content = SPIDER_SCRAPE(url, format);
        sheet.getRange(row, outputCol).setValue(content);
      } catch (e) {
        sheet.getRange(row, outputCol).setValue(`Error: ${e}`);
      }

      row++;
      sleepMs(100);
    }
  }

  SpreadsheetApp.getUi().alert(`Scraped ${urls.length} URL(s). Results in column ${columnLetter(outputCol)}.`);
}

/**
 * Crawl a site and write all pages to a new sheet tab.
 */
function crawlSiteToSheet(): void {
  const ui = SpreadsheetApp.getUi();
  const urlResponse = ui.prompt("Crawl Site", "Enter the URL to crawl:", ui.ButtonSet.OK_CANCEL);
  if (urlResponse.getSelectedButton() !== ui.Button.OK) return;
  const url = urlResponse.getResponseText().trim();
  if (!url) return;

  const limitResponse = ui.prompt("Crawl Limit", "Max pages to crawl (default 25):", ui.ButtonSet.OK_CANCEL);
  if (limitResponse.getSelectedButton() !== ui.Button.OK) return;
  const limit = parseInt(limitResponse.getResponseText()) || 25;

  const res = spiderPost("/crawl", {
    url,
    limit,
    return_format: "markdown",
  });

  if (res.status !== 200) {
    ui.alert(formatError(res.status, res.body));
    return;
  }

  try {
    const data = JSON.parse(res.body);
    const pages = Array.isArray(data) ? data : [data];

    const hostname = url.replace(/https?:\/\//, "").split("/")[0].substring(0, 20);
    const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(`Crawl: ${hostname}`);

    newSheet.getRange(1, 1, 1, 3).setValues([["URL", "Status", "Content"]]);
    newSheet.getRange(1, 1, 1, 3).setFontWeight("bold");

    let row = 2;
    for (const page of pages) {
      newSheet.getRange(row, 1).setValue(page.url || "");
      newSheet.getRange(row, 2).setValue(page.status || "");
      newSheet.getRange(row, 3).setValue(page.content || "");
      row++;
    }

    newSheet.autoResizeColumns(1, 2);
    ui.alert(`Crawled ${pages.length} page(s). See the "${newSheet.getName()}" tab.`);
  } catch {
    ui.alert("Error: Could not parse crawl results.");
  }
}

/**
 * AI extract from a column of URLs with a prompt. Writes results to a new column.
 */
function aiExtractColumn(): void {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getActiveRange();

  if (!range) {
    ui.alert("Select cells containing URLs first.");
    return;
  }

  const promptResponse = ui.prompt(
    "AI Extract",
    "Enter the extraction prompt (e.g., 'Extract the company name and pricing'):",
    ui.ButtonSet.OK_CANCEL,
  );
  if (promptResponse.getSelectedButton() !== ui.Button.OK) return;
  const prompt = promptResponse.getResponseText().trim();
  if (!prompt) return;

  const urls = range.getValues();
  const startRow = range.getRow();
  const outputCol = range.getColumn() + range.getNumColumns();

  sheet.getRange(startRow - 1 > 0 ? startRow - 1 : startRow, outputCol).setValue("AI Extract");

  let row = startRow;
  for (const urlRow of urls) {
    for (const cell of urlRow) {
      const url = String(cell).trim();
      if (!url || !url.startsWith("http")) {
        sheet.getRange(row, outputCol).setValue("Skipped: not a URL");
        row++;
        continue;
      }

      try {
        const content = SPIDER_EXTRACT(url, prompt);
        sheet.getRange(row, outputCol).setValue(content);
      } catch (e) {
        sheet.getRange(row, outputCol).setValue(`Error: ${e}`);
      }

      row++;
      sleepMs(100);
    }
  }

  ui.alert(`Extracted from ${urls.length} URL(s). Results in column ${columnLetter(outputCol)}.`);
}

/**
 * Search and write results to a new sheet tab.
 */
function searchToSheet(): void {
  const ui = SpreadsheetApp.getUi();
  const queryResponse = ui.prompt("Spider Search", "Enter your search query:", ui.ButtonSet.OK_CANCEL);
  if (queryResponse.getSelectedButton() !== ui.Button.OK) return;
  const query = queryResponse.getResponseText().trim();
  if (!query) return;

  const results = SPIDER_SEARCH(query, 10);

  const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(`Search: ${query.substring(0, 20)}`);
  newSheet.getRange(1, 1, results.length, results[0].length).setValues(results);
  newSheet.getRange(1, 1, 1, results[0].length).setFontWeight("bold");
  newSheet.autoResizeColumns(1, results[0].length);

  ui.alert(`Found ${results.length - 1} result(s). See the "${newSheet.getName()}" tab.`);
}

/**
 * Convert a column number to a letter (1 → A, 27 → AA).
 */
function columnLetter(col: number): string {
  let letter = "";
  while (col > 0) {
    const mod = (col - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    col = Math.floor((col - mod) / 26);
  }
  return letter;
}
