/**
 * HiAnime Link Generator Service
 * Uses search URLs to ensure correct anime is found
 */

export interface StreamingOption {
  site: string;
  url: string;
  quality: string;
  notes: string;
}

/**
 * Generate search URL for HiAnime
 * This ensures users find the correct anime even if title formatting varies
 */
function generateHiAnimeSearchURL(title: string): string {
  return `https://hianime.to/search?keyword=${encodeURIComponent(title)}`;
}

/**
 * Generate search URL for 9anime
 */
function generate9AnimeSearchURL(title: string): string {
  return `https://9animetv.to/search?keyword=${encodeURIComponent(title)}`;
}

/**
 * Generate search URL for Zoro.to
 */
function generateZoroSearchURL(title: string): string {
  return `https://zoro.to/search?keyword=${encodeURIComponent(title)}`;
}

/**
 * Generate search URL for Crunchyroll
 */
function generateCrunchyrollSearchURL(title: string): string {
  return `https://www.crunchyroll.com/search?q=${encodeURIComponent(title)}`;
}

/**
 * Generate multiple streaming options for an anime
 * All links go to SEARCH pages so users can select the correct anime
 */
export function getStreamingOptions(animeTitle: string, episode: number = 1): StreamingOption[] {
  const options: StreamingOption[] = [];
  
  // HiAnime (Primary - Best Quality)
  options.push({
    site: 'HiAnime',
    url: generateHiAnimeSearchURL(animeTitle),
    quality: 'HD • Sub & Dub',
    notes: 'Search results will show - click your anime and select episode'
  });
  
  // 9anime (Backup Option 1)
  options.push({
    site: '9anime',
    url: generate9AnimeSearchURL(animeTitle),
    quality: 'HD • Multiple Servers',
    notes: 'Multiple streaming servers available after selecting anime'
  });
  
  // Zoro.to (Backup Option 2)
  options.push({
    site: 'Zoro.to',
    url: generateZoroSearchURL(animeTitle),
    quality: 'HD • No Ads',
    notes: 'Clean interface - select your anime from results'
  });
  
  // Crunchyroll (Legal Option)
  options.push({
    site: 'Crunchyroll',
    url: generateCrunchyrollSearchURL(animeTitle),
    quality: 'HD • Official',
    notes: 'Legal streaming (free with ads) - choose from search results'
  });
  
  return options;
}

/**
 * Get direct HiAnime homepage (for general browsing)
 */
export function getHiAnimeHomepage(): string {
  return 'https://hianime.to';
}