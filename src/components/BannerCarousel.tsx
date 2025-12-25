import { useState, useEffect } from 'react';
import { getNewActiveBanners } from '@/db/api';
import type { SiteBanner } from '@/types/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BannerCarousel() {
  const [banners, setBanners] = useState<SiteBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const loadBanners = async () => {
    try {
      const data = await getNewActiveBanners();
      setBanners(data);
    } catch (error) {
      console.error('Error loading banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (loading || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative h-16 flex items-center justify-center">
          {/* Banner Content */}
          <a
            href={currentBanner.link_url || '#'}
            target={currentBanner.link_url ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full h-full"
          >
            {currentBanner.media_type === 'image' || currentBanner.media_type === 'gif' ? (
              <img
                src={currentBanner.media_url}
                alt={currentBanner.title}
                className="max-h-12 object-contain"
              />
            ) : (
              <span className="text-sm md:text-base font-medium text-foreground">
                {currentBanner.title}
              </span>
            )}
          </a>

          {/* Navigation Arrows - Only show if more than 1 banner */}
          {banners.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 p-1 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
                aria-label="Previous banner"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 p-1 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
                aria-label="Next banner"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {banners.length > 1 && (
          <div className="flex justify-center gap-1 pb-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-primary w-4'
                    : 'bg-muted-foreground/30'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
