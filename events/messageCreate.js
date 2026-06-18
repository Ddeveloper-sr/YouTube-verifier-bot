const { verifyYoutubeScreenshot } = require('../services/verifyService');
const { loadConfig, isBotConfigured } = require('../config');
const { EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // Ignore bots and DMs
    if (message.author.bot || !message.guild) return;

    const config = loadConfig();

    // Only process in the configured verify channel
    if (message.channel.id !== config.VERIFY_CHANNEL_ID) return;

    // Check if bot is fully configured
    if (!isBotConfigured(config)) {
      return message.reply('⚠️ The verification system is not fully configured yet. Please ask an admin to run `/setup`.');
    }

    // Check for image attachments
    const attachment = message.attachments.first();
    if (!attachment || !attachment.contentType?.startsWith('image/')) {
      // Optionally delete non-image messages or ignore
      return;
    }

    // React with loading
    await message.react('🔄');

    try {
      const targetChannel = config.YOUTUBE_CHANNEL;
      const result = await verifyYoutubeScreenshot(attachment.url, targetChannel);

      await message.reactions.cache.get('🔄')?.remove().catch(() => {});

      if (result.success) {
        // Assign role
        const member = message.member;
        const role = message.guild.roles.cache.get(config.VERIFIED_ROLE_ID);

        if (role && !member.roles.cache.has(config.VERIFIED_ROLE_ID)) {
          await member.roles.add(role, 'YouTube subscription verified via screenshot');
        }

        // Success message with Components V2
        const successComponents = {
          flags: MessageFlags.IsComponentsV2,
          components: [
            {
              type: 17, // Container
              accent_color: 0x00FF00, // Green accent
              components: [
                {
                  type: 10, // TextDisplay
                  content: `## ✅ Verification Successful!`
                },
                {
                  type: 14, // Separator
                },
                {
                  type: 9, // Section
                  components: [
                    {
                      type: 10,
                      content: `**Thank you for subscribing to @${targetChannel}!**\n\nYou have been granted the <@&${config.VERIFIED_ROLE_ID}> role.`
                    }
                  ],
                  accessory: {
                    type: 11, // Thumbnail
                    media: {
                      url: message.author.displayAvatarURL({ size: 128 })
                    }
                  }
                },
                {
                  type: 14,
                },
                {
                  type: 10,
                  content: `Welcome to the verified community! 🎉`
                }
              ]
            }
          ]
        };

        await message.reply(successComponents);

        // Optionally delete the original screenshot for cleanliness (optional, comment out if not wanted)
        // await message.delete().catch(() => {});
      } else {
        // Failure message
        const failComponents = {
          flags: MessageFlags.IsComponentsV2,
          components: [
            {
              type: 17,
              accent_color: 0xFF0000,
              components: [
                {
                  type: 10,
                  content: `## ❌ Verification Failed`
                },
                {
                  type: 14,
                },
                {
                  type: 10,
                  content: `We couldn't confirm your subscription to **@${targetChannel}** from the screenshot.\n\n**Tips:**\n• Make sure the screenshot clearly shows the **Subscriptions** tab\n• The channel name/handle should be visible\n• Look for the **"Subscribed"** button or checkmark\n• Try a higher quality screenshot`
                }
              ]
            }
          ]
        };

        await message.reply(failComponents);
      }
    } catch (error) {
      console.error('[messageCreate] Verification error:', error);
      await message.reactions.cache.get('🔄')?.remove().catch(() => {});
      await message.reply('❌ An error occurred while processing your screenshot. Please try again later.');
    }
  }
};