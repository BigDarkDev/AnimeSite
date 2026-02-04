'use client';

import { Anime } from '@/lib/anilist';
import { useRouter } from 'next/navigation';

interface AnimeCardProps {
  anime: Anime & {
    nextAiringEpisode?: {
      episode: number;
      airingAt: number;
    } | null;
  };
  showEpisodeInfo?: boolean;
}

export default function AnimeCard({ anime, showEpisodeInfo = false }: AnimeCardProps) {
  const router = useRouter();
  
  const title = anime.title.english || anime.title.romaji;
  
  const cleanDescription = anime.description
    ? anime.description.replace(/<[^>]*>/g, '').substring(0, 120) + '...'
    : 'No description available.';
  
  const handleClick = () => {
    // Navigate to anime details page
    router.push(`/anime/${anime.id}?title=${encodeURIComponent(title)}`);
  };

  // Calculate latest episode number
  const latestEpisode = anime.nextAiringEpisode 
    ? anime.nextAiringEpisode.episode - 1 
    : anime.episodes || 1;
  
  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer overflow-hidden rounded-lg bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    >
      {/* Anime Cover Image */}
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img
          src={anime.coverImage.large}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      
      {/* Episode Badge (for recent episodes) */}
      {showEpisodeInfo && (
        <div className="absolute left-2 top-2 rounded bg-purple-600 px-2 py-1 text-xs font-bold text-white shadow-lg">
          EP {latestEpisode}
        </div>
      )}
      
      {/* Score badge (always visible) */}
      {anime.averageScore && (
        <div className="absolute right-2 top-2 rounded bg-black/80 px-2 py-1 text-sm font-bold text-yellow-400">
          ★ {anime.averageScore / 10}
        </div>
      )}
      
      {/* Overlay that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute bottom-0 p-4">
          <h3 className="mb-2 text-lg font-bold text-white line-clamp-2">
            {title}
          </h3>
          
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {anime.averageScore && (
              <span className="rounded bg-yellow-500 px-2 py-1 text-xs font-semibold text-black">
                ★ {anime.averageScore / 10}
              </span>
            )}
            {anime.status === 'RELEASING' && (
              <span className="rounded bg-green-500 px-2 py-1 text-xs font-semibold text-white">
                Airing
              </span>
            )}
            {anime.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-200"
              >
                {genre}
              </span>
            ))}
          </div>
          
          <p className="text-sm text-gray-300 line-clamp-2">
            {cleanDescription}
          </p>
        </div>
      </div>
    </div>
  );
}