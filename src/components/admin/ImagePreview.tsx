'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImagePreviewProps {
  src: string;
  alt: string;
  onRemove?: () => void;
  className?: string;
  width?: number;
  height?: number;
  showControls?: boolean;
}

export default function ImagePreview({
  src,
  alt,
  onRemove,
  className = '',
  width = 300,
  height = 200,
  showControls = true
}: ImagePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showFullSize, setShowFullSize] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const openFullSize = () => {
    setShowFullSize(true);
  };

  const closeFullSize = () => {
    setShowFullSize(false);
  };

  return (
    <>
      <div className={`relative group overflow-hidden rounded-lg border border-gray-200 ${className}`}>
        {/* Loading State */}
        {isLoading && (
          <div 
            className="flex items-center justify-center bg-gray-100"
            style={{ width, height }}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div 
            className="flex items-center justify-center bg-gray-100"
            style={{ width, height }}
          >
            <div className="text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">Không thể tải ảnh</p>
            </div>
          </div>
        )}

        {/* Image */}
        {!hasError && (
          <div className="relative" style={{ width, height }}>
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Controls Overlay */}
            {showControls && !isLoading && !hasError && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* View Full Size */}
                  <button
                    type="button"
                    onClick={openFullSize}
                    className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                    title="Xem ảnh đầy đủ"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  {/* Remove */}
                  {onRemove && (
                    <button
                      type="button"
                      onClick={onRemove}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Xóa ảnh"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full Size Modal */}
      {showFullSize && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={closeFullSize}
              className="absolute top-4 right-4 z-10 p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative max-h-[90vh] max-w-[90vw]">
              <Image
                src={src}
                alt={alt}
                width={1200}
                height={800}
                className="object-contain max-h-[90vh] max-w-[90vw] w-auto h-auto"
                onClick={closeFullSize}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
