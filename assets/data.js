/*
  Kitly's content lives in this one file.

  To add an app or plugin, copy an entry, change the text, and save.
  Both the home page and the plugins page update on their own.

  Fields
    name      shown as the card title
    desc      one or two sentences
    link      where the card goes when clicked
    kind      apps only: the small label on the card ("Windows app")
    featured  plugins only: true puts it on the home page.
              The home page shows the first 6 featured plugins,
              in the order they appear here.
*/

window.KITLY = {
  owner: "direkjames",
  profile: "https://github.com/direkjames",

  apps: [
    {
      name: "Grabbit",
      kind: "Windows app",
      desc: "A free Windows desktop app for downloading video and audio as MP4, MP3 or WAV, made for video editors.",
      link: "https://github.com/direkjames/Grabbit"
    },
    {
      name: "dkCutout",
      kind: "Runs in your browser",
      desc: "A free background remover that runs entirely in the visitor's browser. No server, no API keys, no uploads. Photos never leave the user's device.",
      link: "https://direkjames.github.io/dkCutout/"
    },
    {
      name: "Qrafty",
      kind: "Runs in your browser",
      desc: "A free QR code maker with custom shapes, colors, logos and frames. Codes are made in your browser and never expire.",
      link: "https://direkjames.github.io/Qrafty/"
    }
  ],

  plugins: [
    {
      name: "dkBank",
      desc: "A premium bank plugin for Paper and Purpur: interest while playing and while away, bank tiers, chest menus, a leaderboard, an alt-account limit and a developer API.",
      link: "https://github.com/direkjames/dkBank",
      featured: true
    },
    {
      name: "dkCodes",
      desc: "A lightweight, highly customizable plugin that allows server owners to generate single-use or multi-use reward codes for items, currency, and ranks.",
      link: "https://github.com/direkjames/dkCodes",
      featured: true
    },
    {
      name: "Lodestock",
      desc: "A stock market for ores. Prices rise when players buy and fall when they sell. Based on OreMarket by OllieJW.",
      link: "https://github.com/direkjames/Lodestock",
      featured: true
    },
    {
      name: "dkAFK",
      desc: "Detects AFK players, including the usual tricks to look active, and runs your own commands when someone stays AFK too long (for example, sending them to the AFK area).",
      link: "https://github.com/direkjames/dkAFK",
      featured: true
    },
    {
      name: "dkCommands",
      desc: "Command aliases, cooldowns, warmups, costs, daily limits, confirmations, a command hider, a command blocker and a command log for our server.",
      link: "https://github.com/direkjames/dkCommands",
      featured: true
    },
    {
      name: "dkSleep",
      desc: "Vote or one-player night skipping for the dk suite.",
      link: "https://github.com/direkjames/dkSleep",
      featured: true
    },
    {
      name: "dkChat",
      desc: "Global chat plugin for our PurpurMC 26.3 server.",
      link: "https://github.com/direkjames/dkChat"
    },
    {
      name: "dkFly",
      desc: "Timed flight for our server, built on dkCore.",
      link: "https://github.com/direkjames/dkFly"
    },
    {
      name: "dkCore",
      desc: "Shared core plugin for the dk suite on our server.",
      link: "https://github.com/direkjames/dkCore"
    },
    {
      name: "AutoRestart",
      desc: "Private Paper plugin that restarts the server on a schedule, with countdown warnings, staff overrides, PlaceholderAPI placeholders and Discord webhook announcements.",
      link: "https://github.com/direkjames/AutoRestart"
    }
  ]
};
