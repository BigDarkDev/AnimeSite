'use client';

import { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto',
  fullWidthResponsive = true,
  style,
  className = ''
}: AdSenseProps) {
  useEffect(() => {
    try {
      // Push ad to AdSense
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-3463527483851601" // REPLACE WITH YOUR ADSENSE ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      ></ins>
    </div>
  );
}

// Placeholder Ad Component (for development/testing)
export function AdPlaceholder({ 
  height = '250px',
  label = 'Advertisement'
}: { 
  height?: string;
  label?: string;
}) {
  return (
    <div 
      className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/30"
      style={{ height }}
    >
      <div className="text-center">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-1 text-xs text-gray-600">
          Replace with your AdSense code
        </p>
      </div>
    </div>
  );
}