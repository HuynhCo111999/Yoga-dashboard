'use client';

import { useState } from 'react';
import ImageUpload from './ImageUpload';
import ImagePreview from './ImagePreview';

interface ImageGalleryProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export default function ImageGallery({
  images = [],
  onChange,
  maxImages = 5,
  disabled = false
}: ImageGalleryProps) {
  const [showUpload, setShowUpload] = useState(false);

  const handleAddImage = (url: string) => {
    if (images.length < maxImages) {
      const newImages = [...images, url];
      onChange(newImages);
      setShowUpload(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleReorderImages = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Gallery ảnh</h3>
          <p className="text-sm text-gray-500">
            {images.length}/{maxImages} ảnh
            {images.length > 0 && ' • Kéo thả để sắp xếp'}
          </p>
        </div>
        
        {canAddMore && !showUpload && (
          <button
            type="button"
            onClick={() => setShowUpload(true)}
            disabled={disabled}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm ảnh
          </button>
        )}
      </div>

      {/* Upload Area */}
      {showUpload && canAddMore && (
        <div className="border border-dashed border-gray-300 rounded-lg p-4">
          <ImageUpload
            onChange={handleAddImage}
            disabled={disabled}
            placeholder="Thêm ảnh vào gallery"
            maxSize={5}
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setShowUpload(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group"
              draggable={!disabled}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', index.toString());
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                handleReorderImages(fromIndex, index);
              }}
            >
              <ImagePreview
                src={image}
                alt={`Gallery image ${index + 1}`}
                onRemove={() => handleRemoveImage(index)}
                width={200}
                height={150}
                showControls={true}
              />
              
              {/* Order indicator */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>

              {/* Drag handle */}
              {!disabled && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move bg-black bg-opacity-70 text-white p-1 rounded">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !showUpload && (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có ảnh nào</h3>
          <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách thêm ảnh đầu tiên.</p>
          {canAddMore && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowUpload(true)}
                disabled={disabled}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm ảnh đầu tiên
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
