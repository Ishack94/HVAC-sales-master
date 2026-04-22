export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const { image, mode } = req.body || {};
  if (!image || !mode) {
    return res.status(400).json({ error: 'Missing required fields: image, mode' });
  }

  const VALID_FAMILIES = 'nortek_nordyne, bosch_york, carrier_global, trane_technologies, lennox_allied, daikin_goodman, rheem_ruud';

  const nameplatePrompt = `You are an HVAC equipment nameplate reader. Analyze this image of an HVAC equipment nameplate or data plate.

Extract and return ONLY valid JSON (no markdown, no code fences, no explanation):
{
  "brand": "detected brand name or null",
  "model": "full model number or null",
  "serial": "serial number or null",
  "brand_family_id": "one of: ${VALID_FAMILIES}, or null if uncertain",
  "confidence": "high, medium, or low"
}

If the image is not a nameplate or is unreadable, return all null values with confidence "low".`;

  const displayPrompt = `You are an HVAC control board display reader. Analyze this image of an HVAC furnace or air handler control board display, LED pattern, or 7-segment readout.

Extract and return ONLY valid JSON (no markdown, no code fences, no explanation):
{
  "code": "the fault code shown on the display, or LED flash count as a number, or null",
  "display_type": "one of: led_flash, 7_segment, alphanumeric_lcd, or null",
  "confidence": "high, medium, or low"
}

If the image is not an HVAC display or is unreadable, return all null values with confidence "low".`;

  const prompt = mode === 'nameplate' ? nameplatePrompt : displayPrompt;

  // Parse base64 — handle both raw and data-URI formats
  let mediaType = 'image/jpeg';
  let base64Data = image;
  if (image.startsWith('data:')) {
    const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (match) {
      mediaType = match[1];
      base64Data = match[2];
    }
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 400,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: mediaType, data: base64Data },
              },
              { type: 'text', text: prompt },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: 'Claude API error', detail: errText });
    }

    const data = await response.json();
    const raw = data.content?.[0]?.text || '';

    // Strip markdown code fences if present
    const cleaned = raw.replace(/```(?:json)?\s*/g, '').replace(/```\s*/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({ error: 'Failed to parse Claude response', raw });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(502).json({ error: 'Request to Claude API failed', detail: err.message });
  }
}
