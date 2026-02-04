'use client';

import { Anime } from '@/lib/anilist';
import { useRouter } from 'next/navigation';

interface TrendingCardProps {
  anime: Anime;
  rank: number;
}

export default function TrendingCard({ anime, rank }: TrendingCardProps) {
  const router = useRouter();
  
  const title = anime.title.english || anime.title.romaji;
  
  const handleClick = () => {
    // Navigate to anime details page
    router.push(`/anime/${anime.id}?title=${encodeURIComponent(title)}`);
  };
  
  return (
    <div
      onClick={handleClick}
      className="group flex cursor-pointer gap-3 rounded-lg p-3 transition-all hover:bg-gray-800"
    >
      {/* Rank Number */}
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
        <span className="text-2xl font-bold text-purple-500">#{rank}</span>
      </div>
      
      {/* Cover Image */}
      <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded">
        <img
          src={anime.coverImage.medium}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      
      {/* Info */}
      <div className="flex-1 overflow-hidden">
        <h3 className="mb-1 truncate text-sm font-semibold text-white group-hover:text-purple-400">
          {title}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {anime.averageScore && (
            <span className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              {(anime.averageScore / 10).toFixed(1)}
            </span>
          )}
          {anime.format && (
            <span>• {anime.format}</span>
          )}
        </div>
      </div>
    </div>
  );
}