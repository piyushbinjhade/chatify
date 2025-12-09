import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import { ENV } from "./env.js";

// LIVE only in production, DRY_RUN otherwise
const MODE = ENV.ARCJET_ENV === "production" ? "LIVE" : "DRY_RUN";

const aj = arcjet({
  key: ENV.ARCJET_KEY,
  rules: [
    // Protection against common vulnerabilities
    shield({ mode: MODE }),

    // Bot detection
    detectBot({
      // LIVE only in production → blocks bots
      // DRY_RUN in dev → logs bot but does not block (Postman allowed)
      mode: MODE,
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc.
        // Add more allowed bot categories if needed
      ],
    }),

    // Rate limiting
    slidingWindow({
      mode: MODE, // DRY_RUN in dev → not blocking
      max: 100,
      interval: 60, // 60 seconds
    }),
  ],
});

export default aj;
