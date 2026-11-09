/**
 * Headless mode for the collector's Puppeteer launches.
 *
 * On macOS 15.1, Chrome's new headless mode crashes as soon as it starts.
 * Development runs outside the production container, so a visible window is
 * used there instead. The value has to be the boolean false: Puppeteer 21
 * treats every other truthy value, including the string "false", as headless
 * and still passes --headless.
 * @returns {false | "new"}
 */
function collectorHeadlessMode() {
  if (process.platform === "darwin" && process.env.NODE_ENV === "development")
    return false;
  return "new";
}

module.exports = { collectorHeadlessMode };
