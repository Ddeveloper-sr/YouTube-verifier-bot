# 🎥 YouTube Verification Bot (Components V2)

A clean, modern Discord bot that verifies YouTube subscriptions using **screenshot OCR**.  
Built with Discord.js v14 + **Components V2** for beautiful rich messages.

> Originally adapted from the GitHub-verifier concept, now fully converted to YouTube + modern UI components.

[Join Discord](https://discord.gg/jJwrnJAEu9)

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

### ✨ Adding Custom Emojis

You can easily replace the default emojis with **custom server emojis** or different Unicode emojis.

#### 1. Quick way (recommended)
When calling the message helpers, just pass a custom `title`:

```js
// In events/messageCreate.js or commands/setup.js
const successMessage = createSuccessMessage({
  title: '🎉 Verification Successful!',           // ← change emoji here
  description: `...`,
  thumbnail: message.author.displayAvatarURL(),
  footer: 'Welcome! <a:party:123456789>'         // animated emoji example
});
```

#### 2. Change default emojis globally
Edit **`utils/components.js`** and replace the default emojis in the functions:

```js
// Success (green)
title = '✅ Verification Successful!',

// Error (red)
title = '❌ Verification Failed',

// Info (blurple)
title = 'ℹ️ Information',

// Warning (orange)
title = '⚠️ Warning',
```

**How to use custom Discord emojis:**
- Right-click your custom emoji → Copy Emoji
- Paste it directly: `🎉` or `<:customname:123456789012345678>`
- For animated: `<a:animatedname:123456789012345678>`

#### 3. Other places with emojis
You can also change these in `events/messageCreate.js`:
- Loading reaction: `await message.react('🔄');`
- Error replies: `'❌ An error occurred...'`

---

### 🔧 Tweaking the Code (Advanced Customization)

#### Change YouTube Detection Logic
Edit **`services/verifyService.js`** — this is the brain of the verifier:

- Add/remove keywords for "subscribed"
- Change OCR language (`eng` by default)
- Adjust image preprocessing (contrast, sharpness)
- Add color detection for the red "Subscribed" button
- Make it stricter or more lenient

#### Change Success / Error Messages
All user-facing text lives in:
- `events/messageCreate.js` → success & failure replies
- `commands/setup.js` → setup confirmation
- `utils/components.js` → default titles & structure

#### Add More Features
- Multiple YouTube channels → edit config + verifyService
- Logging to a channel → add in messageCreate.js after verification
- Web dashboard → possible with express + discord.js
- Different roles per channel → extend the config system

#### Pro Tips
- Always test changes with your own screenshot first
- Use `console.log()` heavily while debugging OCR
- Restart the bot after editing (or use nodemon for auto-restart)
- Keep your token safe — never commit `.env`

Want something specific customized? Just tell me and I can update the code for you!

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

---

## 📜 License

MIT — feel free to use and modify.

---

**Made for you** by adapting the original GitHub-verifier into a clean YouTube + Components V2 version.

Enjoy! 🎉

If you need any changes (multiple channels, better detection, web dashboard, etc.), just tell me!