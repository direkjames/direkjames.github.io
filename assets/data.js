/*
  Every app on Kitly lives in this file.
  To add an app, copy an entry, change it, and save. Apps show in the order listed.

  Fields
    name        the app's name
    platforms   any of "browser", "windows", "android"
    desc        one or two sentences
    open        the live link, for apps that run in the browser
    repo        the GitHub repo, as "owner/name"
    downloads   any of "installer", "portable", "apk"
                Kitly reads the repo's latest GitHub release and finds each file by its name:
                  installer  a file with "setup" in its name, ending in .exe
                  portable   a file with "portable" in its name, ending in .exe
                  apk        a file ending in .apk
                Version numbers in file names are fine. If a release is missing one of
                these files, that button is hidden.
    source      false hides the "Source code" link
    soon        true shows "Coming soon" instead of buttons
    suite       "kite" puts the app in the Kite suite instead of the main list
    initials    the letters on the app's tile (made from the name if left out)
    icon        optional: a square image, for example "assets/icons/grabbit.png"
    thumb       optional: a screenshot for the top of the card, for example "assets/thumbs/grabbit.png"
                Best at 1280 x 800 (16:10). Wider or taller pictures are trimmed to fit.
                Apps without one show a placeholder with their icon.
*/

window.KITLY = {
  owner: "direkjames",
  profile: "https://github.com/direkjames",
  tagline: "Free apps for the browser, Windows and Android, made by direkjames.",

  apps: [
    {
      name: "Grabbit",
      platforms: ["windows"],
      desc: "A free Windows desktop app for downloading video and audio as MP4, MP3 or WAV, made for video editors.",
      repo: "direkjames/Grabbit",
      downloads: ["installer", "portable"]
    },
    {
      name: "Qrafty",
      platforms: ["browser"],
      desc: "A free QR code maker that runs entirely in the browser. Codes are static, so they never expire, and nothing you type is sent anywhere.",
      open: "https://direkjames.github.io/Qrafty/",
      repo: "direkjames/Qrafty"
    },
    {
      name: "Smithy",
      platforms: ["browser"],
      desc: "Free browser tools for Minecraft: nickname colors and a circle and sphere planner.",
      open: "https://direkjames.github.io/Smithy/",
      repo: "direkjames/Smithy"
    },
    {
      name: "Scanwell",
      platforms: ["android"],
      desc: "A document scanner for Android: scan to PDF or JPEG with no watermark, copy and search text in your scans, and organize them in folders. No ads, no account.",
      repo: "direkjames/Scanwell",
      downloads: ["apk"]
    },
    {
      name: "Ang Pallate Mo",
      platforms: ["browser"],
      desc: "Free color palette and gradient generator with a palette explorer. No account, no paywall, runs entirely in your browser.",
      open: "https://direkjames.github.io/ang-pallate-mo/",
      repo: "direkjames/ang-pallate-mo",
      initials: "AP"
    },
    {
      name: "dkCutout",
      platforms: ["browser"],
      desc: "A free background remover that runs entirely in the visitor's browser. No server, no API keys, no uploads. Photos never leave the user's device.",
      open: "https://direkjames.github.io/dkCutout/",
      repo: "direkjames/dkCutout",
      initials: "dk"
    },
    {
      name: "Kopya",
      platforms: ["browser"],
      desc: "Free document converter that runs entirely in your browser: PDF to Word, JPG, Excel and EPUB, plus Word, PowerPoint and EPUB to PDF. No uploads, no server.",
      open: "https://direkjames.github.io/Kopya/",
      repo: "direkjames/Kopya"
    },
    {
      name: "Folio PDF",
      platforms: ["windows", "android"],
      desc: "Folio PDF is a free, ad-free PDF reader and editor for Android and Windows. No account, no subscriptions.",
      repo: "direkjames/Folio-PDF",
      downloads: ["installer", "apk"],
      initials: "FP"
    },
    {
      name: "Typalette",
      platforms: ["browser"],
      desc: "Mix and match free font pairings from Google Fonts and Fontshare with your own colors, then preview, save, share and copy the code.",
      open: "https://direkjames.github.io/Typalette/",
      repo: "direkjames/Typalette"
    },
    {
      name: "SWYP",
      platforms: ["android"],
      desc: "A free Android app for making seamless Instagram carousels. Design on one long canvas, and SWYP slices it into slides that flow into each other when you swipe.",
      downloads: ["apk"],
      repo: "direkjames/SWYP"
    },
    {
      name: "Firefly",
      platforms: ["windows"],
      desc: "A calm, dark task manager for Windows with lists, board, table, and calendar views, recurring tasks, and natural-language quick add.",
      downloads: ["installer"],
      repo: "direkjames/Firefly"
    },
    {
      name: "Budgy",
      platforms: ["android"],
      desc: "Track your money, budgets, subscriptions and investments in one app. No ads, no account, no subscription. Your data stays on your phone.",
      downloads: ["apk"],
      repo: "direkjames/Budgy"
    },

    /* ---------- Kite suite ---------- */
    {
      name: "Kite Photo",
      suite: "kite",
      platforms: ["browser"],
      desc: "Free browser photo editor with light and color sliders, presets, crop, and export. No sign-up, no uploads.",
      open: "https://direkjames.github.io/kite-photo/",
      repo: "direkjames/kite-photo",
      icon: "assets/icons/kite-photo.png"
    },
    {
      name: "Kite Reel",
      suite: "kite",
      platforms: ["windows"],
      desc: "Free multi-track video editor for Windows with video, audio and text layers. No sign-up, no uploads.",
      repo: "direkjames/kite-reel",
      soon: true,
      icon: "assets/icons/kite-reel.png"
    },
    {
      name: "Kite Paint",
      suite: "kite",
      platforms: ["windows"],
      desc: "A free alternative to Photoshop.",
      soon: true,
      icon: "assets/icons/kite-paint.png"
    }
  ],

  suites: {
    kite: {
      name: "Kite suite",
      page: "kite.html",
      line: "Free creative apps for photos, video and painting.",
      intro: "Kite is a set of free creative apps with no sign-up and no uploads. Kite Photo runs in your browser today. Kite Reel and Kite Paint are on the way."
    }
  }
};
