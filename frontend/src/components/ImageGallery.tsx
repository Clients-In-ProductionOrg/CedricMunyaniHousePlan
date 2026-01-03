import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function ImageGallery({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  console.log('ImageGallery Props:', { isOpen, imagesCount: images.length, title });

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') onClose();
  };

  if (!isOpen) {
    console.log('Gallery not open, returning null');
    return null;
  }

  console.log('Gallery rendering - isOpen:', isOpen, 'currentIndex:', currentIndex, 'images:', images);

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-0"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {/* Full-screen gallery container - NO aspect ratio constraint */}
      <div className="relative w-screen h-screen flex items-center justify-center">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Image Counter */}
        <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Title */}
        {title && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-black/50 text-white px-6 py-2 rounded-full text-sm">
            {title}
          </div>
        )}

        {/* Previous Button */}
        {images.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 z-50 text-white hover:bg-white/20 rounded-full h-12 w-12"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}

        {/* GALLERY IMAGE - FULL SIZE, NO CROPPING */}
        <div 
          className="relative w-full h-full flex items-center justify-center px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="max-w-[95vw] max-h-[95vh] object-contain"
            onError={(e) => {
              console.error('Image failed to load:', images[currentIndex]);
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="16"%3EImage not available%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 z-50 text-white hover:bg-white/20 rounded-full h-12 w-12"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}

        {/* Thumbnail Navigation - SMALL PREVIEW ONLY */}
        {images.length > 1 && (
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-black/70 p-3 rounded-lg max-w-[90vw] overflow-x-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 transition-all border-2',
                  index === currentIndex
                    ? 'border-primary opacity-100'
                    : 'border-transparent opacity-50 hover:opacity-75'
                )}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
