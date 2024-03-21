
# InSight 🔍

A chrome extension to extract information about your LinkedIn network without a LinkedIn developer account. 
All you need is your active LinkedIn login within the browser.


Extract Key Network Details:

-   **First Name**
-   **Last Name**
-   **Headline (Current Job Title)**



##  Installation
1.   Locate the latest version of the extension on the project releases page.
2.  Extract the downloaded file.
3.   Navigate to `chrome://extensions/` in your browser.
4.  Locate the toggle for "Developer mode" in the top right corner and activate it.
5.   Click "Load unpacked" and select the extracted folder.

## Disclaimer

Please note that InSight is not affiliated with LinkedIn. Using it might violate LinkedIn's Terms of Service. Use it at your own risk. This extension is meant to be used as a personal network evaluation tool. By using this tool, you agree to not hold the author or contributors responsible for any consequences resulting from its usage.


## How it works 🛠️

LinkedIn prevents straightforward web scraping without session cookies and specific headers. This extension modifies HTTP requests made by LinkedIn. It retrieves your connections in bulk while preserving the essential headers and cookie data.

The extension incorporates safeguards against exceeding LinkedIn's rate limits. It retrieves connections in batches of 100 (set as `requestChunksDivider` on background.js)  and introduces random delays (maximum delay in miliseconds is set as `maxDelay`  in background.js) between requests to ensure smooth operation.

For more information about how linkedin Voyager API works, check out [this](https://github.com/tomquirk/linkedin-api) amazing project by  tomquirk, which inspired this project. (This project does not rely on linkedin-api by tomquirk)
 
## InSight prioritizes user privacy

Importantly, **no data will be stored externally**. The extension does not save any of the gathered data on any external servers.