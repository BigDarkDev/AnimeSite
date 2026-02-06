'use client';

import { useState, useEffect } from 'react';
import { getRecentEpisodes, getTrendingAnime, searchAnime, Anime, RecentEpisode } from '@/lib/anilist';
import AnimeCard from '@/components/AnimeCard';
import TrendingCard from '@/components/TrendingCard';
import AdSense, { AdPlaceholder } from '@/components/AdSense';

export default function HomePage() {
  const [recentEpisodes, setRecentEpisodes] = useState<RecentEpisode[]>([]);
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'recent' | 'search'>('recent');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    const [recent, trending] = await Promise.all([
      getRecentEpisodes(1, 18),
      getTrendingAnime(1, 10)
    ]);
    setRecentEpisodes(recent);
    setTrendingAnime(trending);
    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setActiveTab('recent');
      return;
    }

    setIsSearching(true);
    setActiveTab('search');
    const results = await searchAnime(searchTerm);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setActiveTab('recent');
    setSearchResults([]);
  };

  const displayAnime = activeTab === 'recent' ? recentEpisodes : searchResults;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Logo */}
            <div className="flex items-center justify-between">
              <h1 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-3xl font-bold text-transparent">
                AnimeStream
              </h1>
              <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white lg:hidden">
                HiAnime Style
              </span>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 lg:max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search anime..."
                  className="w-full rounded-full bg-gray-800 px-6 py-3 text-white placeholder-gray-400 outline-none ring-2 ring-gray-700 transition-all focus:ring-purple-500"
                />
                
                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-2">
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="rounded-full bg-gray-700 px-4 py-1.5 text-sm text-white transition-colors hover:bg-gray-600"
                    >
                      Clear
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-1.5 font-semibold text-white transition-all hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50"
                  >
                    {isSearching ? '...' : 'Search'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Section Title */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {activeTab === 'recent' 
                  ? '🔥 Recent Episodes' 
                  : `Search Results for "${searchTerm}"`}
              </h2>
              
              {activeTab === 'recent' && (
                <span className="rounded-full bg-purple-600/20 px-4 py-1 text-sm text-purple-400">
                  Updated Daily
                </span>
              )}
            </div>
            
            {/* Loading State */}
            {loading && (
              <div className="flex h-96 items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
              </div>
            )}

            {/* No Results */}
            {!loading && displayAnime.length === 0 && (
              <div className="flex h-96 flex-col items-center justify-center text-gray-400">
                <p className="text-xl">No anime found</p>
                <p className="mt-2 text-sm">Try a different search term</p>
              </div>
            )}
            
            {/* Anime Grid */}
            {!loading && displayAnime.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {displayAnime.map((anime) => (
                  <AnimeCard 
                    key={anime.id} 
                    anime={anime} 
                    showEpisodeInfo={activeTab === 'recent'}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Trending Sidebar (Desktop) */}
          <aside className="w-full lg:w-80 xl:w-96">
            <div className="sticky top-24 space-y-6">
              {/* Trending Header */}
              <div className="mb-4 flex items-center justify-between rounded-lg bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-4">
                <h2 className="text-xl font-bold text-white">📈 Trending Now</h2>
                <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white">
                  TOP 10
                </span>
              </div>

              {/* Trending List */}
              {loading ? (
                <div className="flex h-96 items-center justify-center">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="space-y-2 rounded-lg bg-gray-800/30 p-3">
                  {trendingAnime.map((anime, index) => (
                    <TrendingCard key={anime.id} anime={anime} rank={index + 1} />
                  ))}
                </div>
              )}

              {/* Ad Space 1 - Below Trending */}
              <div className="rounded-lg overflow-hidden">
                <AdSense adSlot="6304608648" />
                {/* 
                  Replace AdPlaceholder with:
                  <AdSense adSlot="YOUR_AD_SLOT_SIDEBAR" />
                */}
              </div>

              {/* Info Card */}
              <div className="rounded-lg bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6">
                <h3 className="mb-3 font-bold text-white">ℹ️ About</h3>
                <p className="mb-4 text-sm text-gray-300">
                  Watch anime from multiple streaming sites. All content is linked to external sources.
                </p>
                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Daily episode updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>HD quality streaming</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Multiple streaming options</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>100% free</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Ad Space 2 - Bottom of Page */}
      <div className="container mx-auto px-4 pb-8">
        <AdSense adSlot="6304608648"  />
        {/* 
          Replace AdPlaceholder with:
          <AdSense adSlot="YOUR_AD_SLOT_BOTTOM" />
        */}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p className="mb-2">AnimeStream • HiAnime Style Layout</p>
          <p>Data from AniList • Links to external streaming sites</p>
          <p className="mt-2 text-xs">For educational and personal use only</p>
        </div>
      </footer>
    </div>
  );
}