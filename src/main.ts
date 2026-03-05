/**
 * Runs when the spreadsheet is opened. Adds the Spider menu.
 */
function onOpen(): void {
  SpreadsheetApp.getUi()
    .createMenu("Spider")
    .addItem("Settings", "openSettings")
    .addSeparator()
    .addItem("Scrape Selected URLs", "bulkScrapeSelection")
    .addItem("Crawl Site to New Sheet", "crawlSiteToSheet")
    .addItem("AI Extract Column", "aiExtractColumn")
    .addItem("Search to Sheet", "searchToSheet")
    .addToUi();
}

/**
 * Runs when the add-on is installed.
 */
function onInstall(): void {
  onOpen();
}

/**
 * Homepage trigger for the add-on card.
 */
function onHomepage(): GoogleAppsScript.Card_Service.Card {
  const builder = CardService.newCardBuilder();
  builder.setHeader(CardService.newCardHeader().setTitle("Spider for Google Sheets"));

  const section = CardService.newCardSection();
  section.addWidget(
    CardService.newTextParagraph().setText(
      "Use custom functions like =SPIDER_SCRAPE(url) or open the Spider menu for bulk actions.",
    ),
  );
  section.addWidget(
    CardService.newTextButton()
      .setText("Open Settings")
      .setOnClickAction(CardService.newAction().setFunctionName("openSettings")),
  );
  builder.addSection(section);

  return builder.build();
}
