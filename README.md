
# 🎥 YouTube Verification Bot (Components V2)

A clean, modern Discord bot that verifies YouTube subscriptions using **screenshot OCR**.  
Built with Discord.js v14 + **Components V2** for beautiful rich messages.

> Originally adapted from the GitHub-verifier concept, now fully converted to YouTube + modern UI components.

[Discord Server](https://discord.gg/jJwrnJAEu9)

---

## ✨ Features

- 📸 **Screenshot-based verification** (no YouTube OAuth required)
- 🔍 **Smart OCR** using Tesseract.js + Jimp preprocessing
- 🎨 **Discord Components V2** — beautiful Containers, Sections, Thumbnails & modern layouts
- ⚡ Simple `/setup` slash command (Admin only)
- ✅ Automatic role assignment on success
- 🛡️ Clean error handling and helpful tips for users

---

## 🚀 Quick Start

### 1. Download & Install
```bash
# Download the zip and extract it, then:
cd youtube-verifier
npm install
```

### 2. Configure Environment
Copy the example file and edit it:
```bash
cp .env.example .env
```

Fill in your values:
```env
DISCORD_TOKEN=your_discord_bot_token
GUILD_ID=your_server_id
```

### 3. Start the Bot
```bash
npm start
```

### 4. Setup in Discord
Run this slash command in your server (requires Manage Server permission):
```
/setup channel:#verify role:@Verified youtube:@YourChannelName
```

---

## 📸 How Verification Works

1. User uploads a screenshot of their **YouTube Subscriptions** page in the configured verify channel.
2. Bot downloads the image and runs OCR (with image enhancement).
3. If it finds:
   - Your target channel name/handle, **AND**
   - Words like "Subscribed", checkmark, or subscription context
4. → Bot automatically gives the verified role + sends a nice Components V2 success message.

---

## 🖼️ Components V2 Messages

All bot replies now use the new **Discord Components V2** system:
- Rich Containers with accent colors
- Sections with thumbnails (user avatar)
- Clean separators and formatted text
- Much more modern look than old embeds

---

## 💡 Tips for Best Results

### For Users:
- Take the screenshot on the **Subscriptions** tab (not Home or Library)
- Make sure your channel name/handle is clearly visible
- The "Subscribed" button or checkmark should be in the image
- Higher resolution = better OCR accuracy

### For Server Admins:
- Give the bot **Manage Roles** permission
- Make sure the bot's role is **above** the verified role in the hierarchy
- Test with your own screenshot first

---

## 🛠️ Customization

Want to make detection stricter or support multiple channels?

Edit **`services/verifyService.js`** — you can easily:
- Add more keywords
- Change OCR language
- Add color detection for the red "Subscribed" button
- Adjust confidence thresholds

---

## 📁 Project Structure

```
youtube-verifier/
├── commands/
│   └── setup.js              # /setup command (Components V2)
├── events/
│   └── messageCreate.js      # Image upload handler + verification
├── handlers/
│   ├── commandHandler.js
│   └── eventHandler.js
├── services/
│   └── verifyService.js      # OCR + YouTube detection logic
├── utils/
│   └── components.js         # Reusable Discord Components V2 helpers (success/error containers)
├── config.js
├── index.js
├── package.json
├── .env.example
└── README.md
```

---

## ❓ Common Issues

| Problem                    | Solution                                      |
|---------------------------|-----------------------------------------------|
| Bot not responding        | Check `DISCORD_TOKEN` and intents             |
| Role not being given      | Bot role hierarchy + Manage Roles permission  |
| OCR not detecting         | Try higher quality screenshot or edit keywords in `verifyService.js` |
| Commands not showing      | Restart bot or re-invite with proper scopes   |
| Still not working.         | Join our discord server so we can check the problem or issue.
---

---

## 🛠️ Custom emoji
youtube-verifier/
|── commands/
|── events/
|── handlers/
|── services/
|── utils/
|── emoji.js (New folder)

---



## 📜 License

MIT — feel free to use and modify.

---

**Made for you** by adapting the original GitHub-verifier into a clean YouTube + Components V2 version.

Enjoy! 🎉

If you need any changes (multiple channels, better detection, web dashboard, etc.), just tell me! 