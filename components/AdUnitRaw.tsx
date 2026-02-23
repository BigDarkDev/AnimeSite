'use client';
import React, { useEffect, useRef } from 'react';

export default function AdUnitRaw({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Inject the raw HTML
    containerRef.current.innerHTML = html;

    // Re-create script tags to ensure they execute
    const scripts = Array.from(containerRef.current.querySelectorAll('script'));
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      if (script.src) newScript.src = script.src;
      if (script.type) newScript.type = script.type;
      if ((script as any).async) newScript.async = (script as any).async;
      if ((script as any).defer) newScript.defer = (script as any).defer;
      if ((script as any).crossOrigin) (newScript as any).crossOrigin = (script as any).crossOrigin;
      // Copy inline script content
      newScript.text = script.textContent || '';
      script.parentNode?.replaceChild(newScript, script);
    });
  }, [html]);

  return <div ref={containerRef} />;
}
