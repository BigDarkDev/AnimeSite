'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AdSense, { AdPlaceholder } from '@/components/AdSense';

interface Character {
  id: number;
  name: {
    full: string;
  };
  image: {
    large: string;
  };
  role: string;
}

interface VoiceActor {
  id: number;
  name: {
    full: string;
  };
  image: {
    large: string;
  };
  language: string;
}

interface CharacterEdge {
  role: string;
  node: Character;
  voiceActors: VoiceActor[];
}

interface AnimeDetails {
  id: number;
  title: {
    romaji: string;
    english: string | null;
    native: string;
  };
  coverImage: {
    extraLarge: string;
    large: string;
  };
  bannerImage: string | null;
  description: string;
  genres: string[];
  averageScore: number | null;
  episodes: number | null;
  duration: number | null;
  status: string;
  season: string | null;
  seasonYear: number | null;
  format: string;
  source: string;
  startDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  endDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  studios: {
    nodes: { name: string }[];
  };
  characters: {
    edges: CharacterEdge[];
  };
  recommendations: {
    nodes: {
      mediaRecommendation: {
        id: number;
        title: {
          romaji: string;
          english: string | null;
        };
        coverImage: {
          large: string;
        };
        averageScore: number | null;
      };
    }[];
  };
}

export default function AnimeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const animeId = params.id;
  
  const [animeData, setAnimeData] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (animeId) {
      fetchAnimeDetails(animeId as string);
    }
  }, [animeId]);

  const fetchAnimeDetails = async (id: string) => {
    setLoading(true);
    setError(null);
    
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            extraLarge
            large
          }
          bannerImage
          description
          genres
          averageScore
          episodes
          duration
          status
          season
          seasonYear
          format
          source
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          studios {
            nodes {
              name
            }
          }
          characters(perPage: 8, sort: ROLE) {
            edges {
              role
              node {
                id
                name {
                  full
                }
                image {
                  large
                }
              }
              voiceActors(language: JAPANESE, sort: RELEVANCE) {
                id
                name {
                  full
                }
                image {
                  large
                }
                language
              }
            }
          }
          recommendations(perPage: 6, sort: RATING_DESC) {
            nodes {
              mediaRecommendation {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                averageScore
              }
            }
          }
        }
      }
    `;

    try {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query, 
          variables: { id: parseInt(id) } 
        })
      });

      const data = await response.json();
      
      if (data.errors) {
        throw new Error('Failed to fetch anime details');
      }
      
      setAnimeData(data.data.Media);
    } catch (err) {
      console.error('Error fetching anime details:', err);
      setError('Failed to load anime details');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchClick = () => {
    if (animeData) {
      const title = animeData.title.english || animeData.title.romaji;
      router.push(`/watch?title=${encodeURIComponent(title)}&id=${animeData.id}`);
    }
  };

  const handleRecommendationClick = (id: number, title: string) => {
    router.push(`/anime/${id}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-white">Loading anime details...</p>
        </div>
      </div>
    );
  }

  if (error || !animeData) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-xl text-red-400">Failed to load anime</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 rounded-full bg-purple-500 px-6 py-2 text-white hover:bg-purple-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const displayTitle = animeData.title.english || animeData.title.romaji;
  const cleanDescription = animeData.description?.replace(/<[^>]*>/g, '') || 'No description available.';
  
  const formatDate = (date: { year: number | null; month: number | null; day: number | null }) => {
    if (!date.year) return 'N/A';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = date.month ? months[date.month - 1] : '';
    const day = date.day || '';
    return `${month} ${day}, ${date.year}`.trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white transition-colors hover:text-purple-400"
          >
            <span className="text-2xl">←</span>
            <span className="font-semibold">Back to Home</span>
          </button>
        </div>
      </header>

      {/* Banner Section */}
      {animeData.bannerImage && (
        <div className="relative h-64 md:h-96">
          <img
            src={animeData.bannerImage}
            alt={displayTitle}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-4 space-y-6">
              {/* Poster */}
              <div className="overflow-hidden rounded-lg shadow-2xl">
                <img
                  src={animeData.coverImage.extraLarge || animeData.coverImage.large}
                  alt={displayTitle}
                  className="w-full"
                />
              </div>

              {/* Info Box */}
              <div className="space-y-3 rounded-lg bg-gray-800/50 p-4">
                <h3 className="text-lg font-bold text-white">Information</h3>
                
                <div>
                  <p className="text-sm text-gray-400">Format</p>
                  <p className="font-semibold text-white">{animeData.format || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Episodes</p>
                  <p className="font-semibold text-white">{animeData.episodes || 'Unknown'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Episode Duration</p>
                  <p className="font-semibold text-white">{animeData.duration ? `${animeData.duration} min` : 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="font-semibold text-white capitalize">{animeData.status?.toLowerCase() || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Start Date</p>
                  <p className="font-semibold text-white">{formatDate(animeData.startDate)}</p>
                </div>

                {animeData.endDate?.year && (
                  <div>
                    <p className="text-sm text-gray-400">End Date</p>
                    <p className="font-semibold text-white">{formatDate(animeData.endDate)}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-400">Season</p>
                  <p className="font-semibold text-white">
                    {animeData.season && animeData.seasonYear 
                      ? `${animeData.season} ${animeData.seasonYear}`
                      : 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Source</p>
                  <p className="font-semibold text-white capitalize">{animeData.source?.toLowerCase().replace('_', ' ') || 'N/A'}</p>
                </div>

                {animeData.studios?.nodes && animeData.studios.nodes.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400">Studios</p>
                    <p className="font-semibold text-white">{animeData.studios.nodes.map(s => s.name).join(', ')}</p>
                  </div>
                )}
              </div>

              {/* Ad Space 1 */}
              <AdSense adSlot="6304608648" />
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            {/* Title & Rating */}
            <div className="mb-6">
              <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl">
                {displayTitle}
              </h1>
              
              {animeData.title.romaji !== displayTitle && (
                <p className="mb-2 text-xl text-gray-400">{animeData.title.romaji}</p>
              )}

              <p className="mb-3 text-lg text-gray-500">{animeData.title.native}</p>

              {animeData.averageScore && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2">
                    <span className="text-2xl">⭐</span>
                    <span className="text-2xl font-bold text-black">
                      {(animeData.averageScore / 10).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-400">Score: {animeData.averageScore}/100</span>
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-white">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {animeData.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            <div className="mb-8">
              <h2 className="mb-3 text-2xl font-bold text-white">Synopsis</h2>
              <div className="rounded-lg bg-gray-800/30 p-6">
                <p className="leading-relaxed text-gray-300">{cleanDescription}</p>
              </div>
            </div>

            {/* Characters & Voice Actors */}
            {animeData.characters?.edges && animeData.characters.edges.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold text-white">Characters & Voice Actors</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {animeData.characters.edges.slice(0, 6).map((edge) => (
                    <div key={edge.node.id} className="flex gap-4 rounded-lg bg-gray-800/30 p-4">
                      {/* Character */}
                      <div className="flex flex-1 items-center gap-3">
                        <img
                          src={edge.node.image.large}
                          alt={edge.node.name.full}
                          className="h-20 w-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-white">{edge.node.name.full}</p>
                          <p className="text-sm text-gray-400">{edge.role}</p>
                        </div>
                      </div>

                      {/* Voice Actor */}
                      {edge.voiceActors && edge.voiceActors[0] && (
                        <div className="flex flex-1 items-center justify-end gap-3">
                          <div className="flex-1 text-right">
                            <p className="font-semibold text-white">{edge.voiceActors[0].name.full}</p>
                            <p className="text-sm text-gray-400">Japanese</p>
                          </div>
                          <img
                            src={edge.voiceActors[0].image.large}
                            alt={edge.voiceActors[0].name.full}
                            className="h-20 w-16 rounded object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {animeData.recommendations?.nodes && animeData.recommendations.nodes.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold text-white">You Might Also Like</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {animeData.recommendations.nodes
                    .filter(node => node.mediaRecommendation)
                    .slice(0, 6)
                    .map((node) => {
                      const rec = node.mediaRecommendation;
                      const recTitle = rec.title.english || rec.title.romaji;
                      return (
                        <div
                          key={rec.id}
                          onClick={() => handleRecommendationClick(rec.id, recTitle)}
                          className="group cursor-pointer overflow-hidden rounded-lg bg-gray-800 transition-all hover:scale-105"
                        >
                          <div className="aspect-[2/3]">
                            <img
                              src={rec.coverImage.large}
                              alt={recTitle}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="p-2">
                            <p className="truncate text-sm font-semibold text-white group-hover:text-purple-400">
                              {recTitle}
                            </p>
                            {rec.averageScore && (
                              <p className="text-xs text-yellow-400">★ {rec.averageScore / 10}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Watch Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-black/95 pb-safe backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={handleWatchClick}
            className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 text-xl font-bold text-white transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50"
          >
            ▶ Watch Now
          </button>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-24"></div>

      {/* Ad Space 2 - Bottom */}
      <div className="container mx-auto px-4 pb-8">
        <AdSense adSlot="6304608648" />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>Data from AniList • Links to external streaming sites</p>
        </div>
      </footer>
    </div>
  );
}