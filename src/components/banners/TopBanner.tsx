import { useEffect, useState } from 'react';
import { getActiveBanners } from '@/db/api';
import type { Banner } from '@/types/types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TopBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000); // Auto-rotate every 5 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const loadBanners = async () => {
    try {
      const data = await getActiveBanners();
      setBanners(data);
    } catch (error) {
      console.error('Failed to load banners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleClose = () => {
    setIsVisible(false);
    // Store in session storage so it stays closed during the session
    sessionStorage.setItem('banner_closed', 'true');
  };

  // Check if banner was closed in this session
  useEffect(() => {
    const wasClosed = sessionStorage.getItem('banner_closed');
    if (wasClosed === 'true') {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible || isLoading || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: currentBanner.background_color,
        color: currentBanner.text_color,
      }}
    >
      <div className="container mx-auto px-4">

      </div>
      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1.5">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{
                backgroundColor:
                  index === currentIndex
                    ? currentBanner.text_color
                    : `${currentBanner.text_color}40`,
              }}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
