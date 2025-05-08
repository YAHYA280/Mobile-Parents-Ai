/**
 * Lightens a hex color by the specified amount
 * @param color - Hex color code (e.g. "#FF0000")
 * @param amount - Amount to lighten (0-100)
 * @returns Lightened hex color
 */
export const lightenColor = (color: string, amount: number): string => {
  // Remove the # if it exists
  let hex = color.replace("#", "");

  // Handle shorthand hex (e.g. #FFF)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Convert to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Lighten each channel
  r = Math.min(255, Math.round(r + (255 - r) * (amount / 100)));
  g = Math.min(255, Math.round(g + (255 - g) * (amount / 100)));
  b = Math.min(255, Math.round(b + (255 - b) * (amount / 100)));

  // Convert back to hex
  const rHex = r.toString(16).padStart(2, "0");
  const gHex = g.toString(16).padStart(2, "0");
  const bHex = b.toString(16).padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
};

/**
 * Darkens a hex color by the specified amount
 * @param color - Hex color code (e.g. "#FF0000")
 * @param amount - Amount to darken (0-100)
 * @returns Darkened hex color
 */
export const darkenColor = (color: string, amount: number): string => {
  // Remove the # if it exists
  let hex = color.replace("#", "");

  // Handle shorthand hex (e.g. #FFF)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Convert to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Darken each channel
  r = Math.max(0, Math.round(r * (1 - amount / 100)));
  g = Math.max(0, Math.round(g * (1 - amount / 100)));
  b = Math.max(0, Math.round(b * (1 - amount / 100)));

  // Convert back to hex
  const rHex = r.toString(16).padStart(2, "0");
  const gHex = g.toString(16).padStart(2, "0");
  const bHex = b.toString(16).padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
};
