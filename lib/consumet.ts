/**
 * Consumet API Service with Multiple Backup Endpoints
 * Fetches streaming links for anime episodes
 */

export interface Episode {
  id: string;
  number: number;
  title: string | null;
  url: string;
}

export interface StreamingLink {
  url: string;
  quality: string;
  isM3U8: boolean;
}

export interface AnimeSearchResult {
  id: string;
  title: string;
  url: string;
  image: string;
  releaseDate: string | null;
  subOrDub: string;
}

// Multiple API endpoints as backup
const API_ENDPOINTS = [
  'https://api.consumet.org/anime/gogoanime',
  'https://consumet-api.vercel.app/anime/gogoanime',
  'https://api-consumet-org.vercel.app/anime/gogoanime',
];

let currentEndpointIndex = 0;

/**
 * Get the current API endpoint
 */
function getAPIEndpoint(): string {
  return API_ENDPOINTS[currentEndpointIndex];
}

/**
 * Try next API endpoint if current one fails
 */
function tryNextEndpoint(): boolean {
  currentEndpointIndex = (currentEndpointIndex + 1) % API_ENDPOINTS.length;
  return currentEndpointIndex !== 0; // Return false if we've tried all endpoints
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Search for anime on Gogoanime with retry logic
 */
export async function searchAnimeOnGogoanime(title: string): Promise<AnimeSearchResult[]> {
  const encodedTitle = encodeURIComponent(title);
  let attempts = 0;
  const maxAttempts = API_ENDPOINTS.length;
  
  while (attempts < maxAttempts) {
    try {
      const apiBase = getAPIEndpoint();
      console.log(`Attempting to search using: ${apiBase}`);
      
      const response = await fetchWithTimeout(`${apiBase}/${encodedTitle}`, 15000);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Search successful!');
      return data.results || [];
      
    } catch (error) {
      console.error(`Error with ${getAPIEndpoint()}:`, error);
      attempts++;
      
      if (attempts < maxAttempts) {
        tryNextEndpoint();
        console.log('Trying next endpoint...');
      }
    }
  }
  
  console.error('All API endpoints failed');
  return [];
}

/**
 * Get episodes for a specific anime
 */
export async function getAnimeEpisodes(animeId: string): Promise<Episode[]> {
  let attempts = 0;
  const maxAttempts = API_ENDPOINTS.length;
  
  while (attempts < maxAttempts) {
    try {
      const apiBase = getAPIEndpoint();
      const response = await fetchWithTimeout(`${apiBase}/info/${animeId}`, 15000);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch episodes: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.episodes || [];
      
    } catch (error) {
      console.error(`Error fetching episodes:`, error);
      attempts++;
      
      if (attempts < maxAttempts) {
        tryNextEndpoint();
      }
    }
  }
  
  return [];
}

/**
 * Get streaming links for a specific episode
 */
export async function getStreamingLinks(episodeId: string): Promise<StreamingLink[]> {
  let attempts = 0;
  const maxAttempts = API_ENDPOINTS.length;
  
  while (attempts < maxAttempts) {
    try {
      const apiBase = getAPIEndpoint();
      const response = await fetchWithTimeout(`${apiBase}/watch/${episodeId}`, 15000);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch streaming links: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.sources || [];
      
    } catch (error) {
      console.error(`Error fetching streaming links:`, error);
      attempts++;
      
      if (attempts < maxAttempts) {
        tryNextEndpoint();
      }
    }
  }
  
  return [];
}

/**
 * Helper function: Get the streaming link for the first episode of an anime
 */
export async function getFirstEpisodeStream(animeTitle: string): Promise<string | null> {
  try {
    console.log(`Searching for: ${animeTitle}`);
    
    // Step 1: Search for the anime
    const searchResults = await searchAnimeOnGogoanime(animeTitle);
    
    if (searchResults.length === 0) {
      console.log('No anime found with that title');
      return null;
    }
    
    console.log(`Found ${searchResults.length} results`);
    
    // Step 2: Get the first result's ID
    const firstResult = searchResults[0];
    console.log(`Selected: ${firstResult.title}`);
    
    // Step 3: Get episodes for this anime
    const episodes = await getAnimeEpisodes(firstResult.id);
    
    if (episodes.length === 0) {
      console.log('No episodes found for this anime');
      return null;
    }
    
    console.log(`Found ${episodes.length} episodes`);
    
    // Step 4: Get streaming links for the first episode
    const streamingLinks = await getStreamingLinks(episodes[0].id);
    
    if (streamingLinks.length === 0) {
      console.log('No streaming links found');
      return null;
    }
    
    console.log(`Found ${streamingLinks.length} streaming links`);
    
    // Step 5: Return the first M3U8 link (best quality)
    const m3u8Link = streamingLinks.find(link => link.isM3U8);
    const streamUrl = m3u8Link ? m3u8Link.url : streamingLinks[0].url;
    
    console.log('Stream URL obtained successfully');
    return streamUrl;
    
  } catch (error) {
    console.error('Error in getFirstEpisodeStream:', error);
    return null;
  }
}

/**
 * Check API health
 */
export async function checkAPIHealth(): Promise<{ endpoint: string; status: string }[]> {
  const results = [];
  
  for (const endpoint of API_ENDPOINTS) {
    try {
      const response = await fetchWithTimeout(`${endpoint}/naruto`, 5000);
      results.push({
        endpoint,
        status: response.ok ? 'Online ✅' : 'Error ❌'
      });
    } catch (error) {
      results.push({
        endpoint,
        status: 'Offline ❌'
      });
    }
  }
  
  return results;
}