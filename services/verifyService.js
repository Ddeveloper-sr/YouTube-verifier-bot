const Tesseract = require('tesseract.js');
const Jimp = require('jimp');
const { loadConfig } = require('../config');

async function verifyYoutubeScreenshot(imageUrl, targetChannel) {
  const config = loadConfig();
  const debug = config.OCR_DEBUG;

  try {
    // Download image using Jimp for preprocessing
    const image = await Jimp.read(imageUrl);
    
    // Preprocess: convert to grayscale, increase contrast for better OCR
    image
      .greyscale()
      .contrast(0.5)
      .normalize();

    const processedBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

    // Run Tesseract OCR
    const { data: { text } } = await Tesseract.recognize(
      processedBuffer,
      config.OCR_LANG || 'eng',
      {
        logger: debug ? m => console.log('[OCR]', m) : undefined
      }
    );

    const ocrText = text.toLowerCase();
    const normalizedTarget = targetChannel.toLowerCase().replace(/^@/, '');

    if (debug) {
      console.log('[OCR] Extracted text preview:', ocrText.substring(0, 500));
    }

    // Check if target channel appears in OCR text
    const channelMentioned = ocrText.includes(normalizedTarget) || 
                             ocrText.includes(normalizedTarget.replace(/\s/g, ''));

    // Common YouTube subscription indicators
    const hasSubscribed = ocrText.includes('subscribed') || 
                          ocrText.includes('subscribe') ||
                          ocrText.includes('following') ||
                          ocrText.includes('sub') ||  // sometimes abbreviated
                          ocrText.includes('✓') ||     // checkmark
                          ocrText.includes('✔');

    // Additional heuristic: look for typical subscription page words
    const hasSubscriptionContext = ocrText.includes('subscriptions') || 
                                   ocrText.includes('your subscriptions') ||
                                   ocrText.includes('channels');

    const isVerified = channelMentioned && (hasSubscribed || hasSubscriptionContext);

    return {
      success: isVerified,
      confidence: isVerified ? 'high' : 'low',
      extractedText: debug ? ocrText : undefined,
      reasons: {
        channelMentioned,
        hasSubscribed,
        hasSubscriptionContext
      }
    };
  } catch (error) {
    console.error('[verifyService] OCR Error:', error);
    return {
      success: false,
      confidence: 'error',
      error: error.message
    };
  }
}

module.exports = { verifyYoutubeScreenshot };