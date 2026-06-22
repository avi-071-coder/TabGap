# TabGap

## The Issue
Modern web browsing leads to tab overload, causing cluttered browser windows, high memory consumption, and difficulty locating important information among dozens of open pages.

## The Solution
TabGap is a local-only Chrome Extension designed to instantly gather and manage all your open tabs. With a single click, it saves your active tabs into a secure, local database and closes them in the browser, instantly freeing up memory while ensuring you never lose a link. 

## Key Features
- Instant Gathering: One-click action to save all open tabs to your dashboard and close them in the browser.
- Local Storage: Uses IndexedDB to store all data locally on your machine. No data is sent to external servers, ensuring complete privacy.
- Organization: Supports custom tab renaming, pinning important tabs, and viewing recently accessed tabs.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the extension:
   ```bash
   npm run build
   ```
3. Open Google Chrome and navigate to `chrome://extensions/`.
4. Enable "Developer mode" and click "Load unpacked".
5. Select the generated `dist/` directory inside the project folder.

*Any suggestions or feedback would be appreciated*

