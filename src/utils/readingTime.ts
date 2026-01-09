/**
 * Calculate reading time for a given text
 * Average reading speed: 200-250 words per minute
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 225;
  const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}
