/**
 * client/src/utils/formatters.js
 * Utility functions for formatting data in the UI.
 */

/**
 * Formats a date string into a readable format.
 * @param {string} dateString - ISO date string from the API
 * @returns {string} Formatted date like "Oct 6, 2026"
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats a date to relative time (e.g., "2 hours ago").
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
export function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

/**
 * Returns a color class based on a suitability score (0-100).
 * @param {number} score
 * @returns {string} Tailwind color class string
 */
export function getScoreColor(score) {
  if (score >= 80) return 'text-brand-400';
  if (score >= 60) return 'text-earth-400';
  return 'text-red-400';
}

/**
 * Returns a progress bar fill color class based on score.
 * @param {number} score
 * @returns {string}
 */
export function getScoreBarClass(score) {
  if (score >= 80) return 'bg-gradient-to-r from-brand-600 to-brand-400';
  if (score >= 60) return 'bg-gradient-to-r from-earth-600 to-earth-400';
  return 'bg-gradient-to-r from-red-700 to-red-500';
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Returns the initials of a name (up to 2 characters).
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '??';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * Gets a soil type emoji/icon label.
 * @param {string} soilType
 * @returns {string}
 */
export function getSoilEmoji(soilType) {
  const map = {
    Clay: '🏺',
    Sandy: '🏜️',
    Loamy: '🌱',
    Silt: '💧',
  };
  return map[soilType] || '🌍';
}

/**
 * Gets a season emoji.
 * @param {string} season
 * @returns {string}
 */
export function getSeasonEmoji(season) {
  const map = {
    Spring: '🌸',
    Summer: '☀️',
    Fall: '🍂',
    Winter: '❄️',
    Kharif: '🌧️',
    Rabi: '🌾',
    Zaid: '🌡️',
  };
  return map[season] || '🌿';
}
