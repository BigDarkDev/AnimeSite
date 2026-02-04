'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { getStreamingOptions } from '@/lib/hianime-links';

function WatchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const title = searchParams.get('title') || 'Unknown Anime';
  
  // Get streaming options
  const streamingOptions = getStreamingOptions(title, 1);

  const handleWatchClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md">
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white">
            {title}
          </h1>
          <p className="text-xl text-gray-400">Choose where to watch</p>
        </div>

        {/* Important Notice */}
        <div className="mx-auto mb-8 max-w-4xl rounded-lg bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">ℹ️</span>
            <div>
              <h3 className="mb-2 text-lg font-bold text-white">How This Works:</h3>
              <ol className="space-y-1 text-sm text-gray-300">
                <li>1. Click "Search & Watch" on your preferred site below</li>
                <li>2. A new tab opens with search results for "<strong className="text-purple-400">{title}</strong>"</li>
                <li>3. Click the correct anime from the results</li>
                <li>4. Select your episode and enjoy!</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Streaming Options */}
        <div className="mx-auto max-w-4xl">
          <div className="space-y-4">
            {streamingOptions.map((option, index) => (
              <div
                key={index}
                className="group rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-800/30 p-6 transition-all hover:from-gray-800 hover:to-gray-700 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-bold text-white">{option.site}</h3>
                      {index === 0 && (
                        <span className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 text-xs font-bold text-white">
                          ⭐ RECOMMENDED
                        </span>
                      )}
                      {option.site === 'Crunchyroll' && (
                        <span className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1 text-xs font-bold text-white">
                          ✓ LEGAL
                        </span>
                      )}
                    </div>
                    
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-sm font-semibold text-purple-400">Quality:</span>
                      <span className="text-sm text-gray-300">{option.quality}</span>
                    </div>
                    
                    <p className="text-sm text-gray-400">{option.notes}</p>
                  </div>
                  
                  <button
                    onClick={() => handleWatchClick(option.url)}
                    className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 md:px-10"
                  >
                    Search & Watch →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Guide */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">📖 Complete Guide</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Step by Step */}
              <div className="rounded-lg bg-black/30 p-6">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-purple-400">
                  <span>🎯</span> Step-by-Step:
                </h3>
                <div className="space-y-4 text-sm text-gray-300">
                  <div className="flex gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500 text-xs font-bold">1</span>
                    <div>
                      <p className="font-semibold text-white">Click "Search & Watch"</p>
                      <p className="text-xs text-gray-400">HiAnime is recommended for best quality</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500 text-xs font-bold">2</span>
                    <div>
                      <p className="font-semibold text-white">Find Your Anime</p>
                      <p className="text-xs text-gray-400">Search results show - usually the first result is correct</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500 text-xs font-bold">3</span>
                    <div>
                      <p className="font-semibold text-white">Click the Anime</p>
                      <p className="text-xs text-gray-400">Opens the anime's page with all episodes</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500 text-xs font-bold">4</span>
                    <div>
                      <p className="font-semibold text-white">Select Episode & Watch!</p>
                      <p className="text-xs text-gray-400">Choose your episode and enjoy HD streaming</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why This Way */}
              <div className="rounded-lg bg-black/30 p-6">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-green-400">
                  <span>✨</span> Why This Approach:
                </h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-green-400">✓</span>
                    <span><strong className="text-white">Accurate:</strong> You see search results and pick the right anime</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400">✓</span>
                    <span><strong className="text-white">Reliable:</strong> Works for all anime, even with different titles</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400">✓</span>
                    <span><strong className="text-white">No Bugs:</strong> No API issues or wrong anime problems</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400">✓</span>
                    <span><strong className="text-white">Updated:</strong> All episodes available immediately</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400">✓</span>
                    <span><strong className="text-white">Free:</strong> 100% free for personal use</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Site Info */}
            <div className="mt-8 grid gap-4 rounded-lg bg-black/30 p-6 md:grid-cols-2">
              <div>
                <p className="mb-2 font-semibold text-purple-400">🏆 Best Choice:</p>
                <p className="text-sm text-gray-300">
                  <strong className="text-white">HiAnime</strong> - Top HD quality, fastest updates, clean UI
                </p>
              </div>
              <div>
                <p className="mb-2 font-semibold text-blue-400">⚖️ Want Legal?</p>
                <p className="text-sm text-gray-300">
                  <strong className="text-white">Crunchyroll</strong> - Official, supports creators, free with ads
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mx-auto mt-8 max-w-4xl">
          <div className="rounded-lg bg-gray-800/30 p-6">
            <h3 className="mb-4 text-lg font-bold text-white">💡 Pro Tips</h3>
            <div className="grid gap-4 text-sm text-gray-300 md:grid-cols-3">
              <div>
                <p className="mb-1 font-semibold text-yellow-400">Multiple Results?</p>
                <p>The first result is usually the correct one. Check the poster image to confirm.</p>
              </div>
              <div>
                <p className="mb-1 font-semibold text-yellow-400">Different Title?</p>
                <p>Some anime have English and Japanese titles. Try both if needed.</p>
              </div>
              <div>
                <p className="mb-1 font-semibold text-yellow-400">Best Quality?</p>
                <p>HiAnime typically has the best HD quality and fastest loading.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    }>
      <WatchPageContent />
    </Suspense>
  );
}