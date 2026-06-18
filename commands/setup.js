const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const { saveConfig, normalizeYoutubeChannel, isValidYoutubeChannel, loadConfig } = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configure the YouTube verification system (Admin only)')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel where users will upload verification screenshots')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to assign upon successful verification')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('youtube')
        .setDescription('The YouTube channel handle or name to verify subscriptions for (e.g. @MrBeast or MrBeast)')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const role = interaction.options.getRole('role');
    const youtubeInput = interaction.options.getString('youtube');

    const normalizedYoutube = normalizeYoutubeChannel(youtubeInput);

    if (!isValidYoutubeChannel(normalizedYoutube)) {
      return interaction.reply({
        content: '❌ Invalid YouTube channel. Please provide a valid channel name or handle.',
        ephemeral: true
      });
    }

    const config = saveConfig({
      VERIFY_CHANNEL_ID: channel.id,
      VERIFIED_ROLE_ID: role.id,
      YOUTUBE_CHANNEL: normalizedYoutube
    });

    // Use Components V2 style response (rich message)
    const successMessage = {
      flags: MessageFlags.IsComponentsV2,
      components: [
        {
          type: 17, // Container
          components: [
            {
              type: 10, // TextDisplay
              content: `## ✅ YouTube Verification Setup Complete`
            },
            {
              type: 14, // Separator
            },
            {
              type: 10,
              content: `**Verification Channel:** <#${channel.id}>\n**Verified Role:** <@&${role.id}>\n**Target YouTube Channel:** \`@${config.YOUTUBE_CHANNEL}\``
            },
            {
              type: 14,
            },
            {
              type: 10,
              content: `Users can now upload screenshots of their YouTube Subscriptions page in <#${channel.id}> to get the <@&${role.id}> role.`
            }
          ]
        }
      ]
    };

    await interaction.reply(successMessage);
  }
};