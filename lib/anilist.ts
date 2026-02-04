/**
 * Enhanced AniList GraphQL API Service
 * Fetches anime metadata including recent episodes and trending
 */

export interface Anime {
  duration: any;
  studios: any;
  id: number;
  title: {
    romaji: string;
    english: string | null;
  };
  coverImage: {
    extraLarge: string;
    large: string;
    medium: string;
  };
  bannerImage: string | null;
  description: string;
  genres: string[];
  averageScore: number | null;
  episodes: number | null;
  status: string;
  season: string | null;
  seasonYear: number | null;
  format: string | null;
}

export interface RecentEpisode extends Anime {
  nextAiringEpisode: {
    episode: number;
    airingAt: number;
  } | null;
}

const ANILIST_API_URL = 'https://graphql.anilist.co';

/**
 * Fetches currently airing anime (recent episodes)
 */
export async function getRecentEpisodes(page = 1, perPage = 12): Promise<RecentEpisode[]> {
  const query = `
    query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
      Page(page: $page, perPage: $perPage) {
        media(
          type: ANIME, 
          status: RELEASING,
          sort: UPDATED_AT_DESC,
          season: $season,
          seasonYear: $seasonYear
        ) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            medium
          }
          bannerImage
          description
          genres
          averageScore
          episodes
          status
          season
          seasonYear
          format
          nextAiringEpisode {
            episode
            airingAt
          }
        }
      }
    }
  `;

  // Get current season
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  
  let season = 'WINTER';
  if (month >= 3 && month <= 5) season = 'SPRING';
  else if (month >= 6 && month <= 8) season = 'SUMMER';
  else if (month >= 9 && month <= 11) season = 'FALL';

  const variables = { 
    page, 
    perPage,
    season,
    seasonYear: year
  };

  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    return data.data.Page.media;
  } catch (error) {
    console.error('Error fetching recent episodes:', error);
    return [];
  }
}

/**
 * Fetches trending anime
 */
export async function getTrendingAnime(page = 1, perPage = 10): Promise<Anime[]> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: TRENDING_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            medium
          }
          bannerImage
          description
          genres
          averageScore
          episodes
          status
          season
          seasonYear
          format
        }
      }
    }
  `;

  const variables = { page, perPage };

  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    return data.data.Page.media;
  } catch (error) {
    console.error('Error fetching trending anime:', error);
    return [];
  }
}

/**
 * Search for anime by title
 */
export async function searchAnime(searchTerm: string): Promise<Anime[]> {
  const query = `
    query ($search: String) {
      Page(perPage: 20) {
        media(type: ANIME, search: $search, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            medium
          }
          bannerImage
          description
          genres
          averageScore
          episodes
          status
          season
          seasonYear
          format
        }
      }
    }
  `;

  const variables = { search: searchTerm };

  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    return data.data.Page.media;
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
}

/**
 * Get popular anime of current season
 */
export async function getPopularThisSeason(page = 1, perPage = 12): Promise<Anime[]> {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  
  let season = 'WINTER';
  if (month >= 3 && month <= 5) season = 'SPRING';
  else if (month >= 6 && month <= 8) season = 'SUMMER';
  else if (month >= 9 && month <= 11) season = 'FALL';

  const query = `
    query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
      Page(page: $page, perPage: $perPage) {
        media(
          type: ANIME,
          season: $season,
          seasonYear: $seasonYear,
          sort: POPULARITY_DESC
        ) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            medium
          }
          bannerImage
          description
          genres
          averageScore
          episodes
          status
          season
          seasonYear
          format
        }
      }
    }
  `;

  const variables = { 
    page, 
    perPage,
    season,
    seasonYear: year
  };

  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    return data.data.Page.media;
  } catch (error) {
    console.error('Error fetching popular anime:', error);
    return [];
  }
}