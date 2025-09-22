'use client';

import { useState, useRef } from 'react';
import { storageService } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import ImagePreview from './ImagePreview';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  placeholder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  acceptedTypes = "image/*",
  maxSize = 5,
  placeholder = "Chọn hoặc kéo thả ảnh vào đây"
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Kích thước file không được vượt quá ${maxSize}MB`);
      return;
    }

    // Generate preview
    const preview = storageService.generatePreviewUrl(file);
    setPreviewUrl(preview);

    // Upload to Firebase Storage
    setUploading(true);
    try {
      const result = await storageService.uploadBlogImage(file);
      
      if (result.error) {
        toast.error(result.error);
        setPreviewUrl(null);
      } else if (result.url) {
        onChange(result.url);
        toast.success('Upload ảnh thành công!');
        // Clean up preview URL since we now have the uploaded URL
        URL.revokeObjectURL(preview);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Có lỗi xảy ra khi upload ảnh');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled || uploading) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploading) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (onRemove) {
      onRemove();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  // Show current uploaded image or preview
  const imageToShow = value || previewUrl;

  return (
    <div className="space-y-4">
      {/* Current Image Display */}
      {imageToShow && (
        <div className="relative">
          <ImagePreview
            src={imageToShow}
            alt="Preview"
            onRemove={handleRemove}
            width={400}
            height={240}
            showControls={!uploading}
            className="w-full"
          />
          
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <span className="text-sm">Đang upload...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Area */}
      {!imageToShow && (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${dragOver 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileInputChange}
            disabled={disabled || uploading}
            className="hidden"
          />

          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 text-gray-400">
              <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">
                {uploading ? 'Đang upload...' : placeholder}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF tối đa {maxSize}MB
              </p>
            </div>

            {uploading && (
              <div className="flex items-center justify-center pt-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Replace Button */}
      {imageToShow && !uploading && (
        <button
          type="button"
          onClick={openFileDialog}
          disabled={disabled}
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          Thay đổi ảnh
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileInputChange}
        disabled={disabled || uploading}
        className="hidden"
      />
    </div>
  );
}
