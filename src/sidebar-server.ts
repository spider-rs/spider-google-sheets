/**
 * Open the settings sidebar.
 */
function openSettings(): void {
  const html = HtmlService.createHtmlOutputFromFile("sidebar")
    .setTitle("Spider Settings")
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Save API key from sidebar. Called from client-side JS.
 */
function saveApiKey(key: string): string {
  if (!key || !key.trim()) return "Please enter an API key.";
  setApiKey(key.trim());
  return "API key saved.";
}

/**
 * Get current settings for the sidebar. Called from client-side JS.
 */
function getSettings(): { email: string; hasKey: boolean; format: string } {
  const props = PropertiesService.getUserProperties();
  return {
    email: Session.getActiveUser().getEmail(),
    hasKey: !!props.getProperty("SPIDER_API_KEY"),
    format: props.getProperty("SPIDER_DEFAULT_FORMAT") || "markdown",
  };
}

/**
 * Save default format preference. Called from client-side JS.
 */
function saveDefaultFormat(format: string): void {
  PropertiesService.getUserProperties().setProperty("SPIDER_DEFAULT_FORMAT", format);
}

/**
 * Get credit balance for the sidebar. Called from client-side JS.
 */
function getCreditsBalance(): { credits: number | string; dollars: string } {
  const credits = SPIDER_CREDITS();
  const dollars = typeof credits === "number" ? `$${(credits / 10000).toFixed(2)}` : "—";
  return { credits, dollars };
}
