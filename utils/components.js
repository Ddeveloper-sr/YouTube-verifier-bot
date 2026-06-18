const { MessageFlags } = require('discord.js');

/**
 * YouTube Verifier - Reusable Discord Components V2 Helpers
 * Makes creating beautiful modern messages much easier and cleaner.
 */

function createContainer({ accentColor = 0x5865F2, components = [] }) {
  return {
    flags: MessageFlags.IsComponentsV2,
    components: [
      {
        type: 17, // Container
        accent_color: accentColor,
        components: components
      }
    ]
  };
}

function text(content) {
  return { type: 10, content };
}

function separator(spacing = 1) {
  return { type: 14, spacing };
}

function section({ content, thumbnail = null }) {
  const items = Array.isArray(content) ? content : [content];
  
  const sectionComponents = items.map(item => 
    typeof item === 'string' ? text(item) : item
  );

  const sectionObj = {
    type: 9,
    components: sectionComponents
  };

  if (thumbnail) {
    sectionObj.accessory = {
      type: 11, // Thumbnail
      media: { url: thumbnail }
    };
  }

  return sectionObj;
}

/**
 * Success message (green accent)
 */
function createSuccessMessage({ 
  title = '✅ Verification Successful!', 
  description = '', 
  thumbnail = null,
  footer = 'Welcome to the verified community! 🎉'
}) {
  const components = [
    text(`## ${title}`),
    separator()
  ];

  if (description) {
    components.push(section({ content: description, thumbnail }));
    components.push(separator());
  }

  if (footer) {
    components.push(text(footer));
  }

  return createContainer({
    accentColor: 0x00C853, // Nice green
    components
  });
}

/**
 * Error / Failure message (red accent)
 */
function createErrorMessage({ 
  title = '❌ Verification Failed', 
  description = 'We could not verify your subscription from the screenshot.' 
}) {
  return createContainer({
    accentColor: 0xE53935, // Red
    components: [
      text(`## ${title}`),
      separator(),
      text(description)
    ]
  });
}

/**
 * Info / Setup message (blurple accent)
 */
function createInfoMessage({ 
  title = 'ℹ️ Information', 
  description = '' 
}) {
  const components = [
    text(`## ${title}`),
    separator()
  ];

  if (description) {
    components.push(text(description));
  }

  return createContainer({
    accentColor: 0x5865F2, // Blurple
    components
  });
}

/**
 * Warning message (orange accent)
 */
function createWarningMessage({ 
  title = '⚠️ Warning', 
  description = '' 
}) {
  const components = [
    text(`## ${title}`),
    separator()
  ];

  if (description) {
    components.push(text(description));
  }

  return createContainer({
    accentColor: 0xFF9800, // Orange
    components
  });
}

module.exports = {
  createContainer,
  text,
  separator,
  section,
  createSuccessMessage,
  createErrorMessage,
  createInfoMessage,
  createWarningMessage
};
