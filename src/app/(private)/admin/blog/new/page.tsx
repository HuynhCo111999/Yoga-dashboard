'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { blogApi, type BlogPostCreateRequest } from '@/lib/api/blog';
import { toast } from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import AdminLayout from '@/components/admin/AdminLayout';
import { storageService } from '@/lib/firebase';

function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState<BlogPostCreateRequest>({
    title: '',
    content: '',
    excerpt: '',
    metaTitle: '',
    metaDescription: '',
    author: user?.name || '',
    tags: [],
    isPublished: false,
    featuredImage: '',
    slug: '',
  });
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.name && !formData.author) {
      setFormData(prev => ({ ...prev, author: user.name || prev.author }));
    }
  }, [user, formData.author]);

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const dataUrlToFile = (dataUrl: string, filename: string): File | null => {
    try {
      const matches = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
      if (!matches) return null;

      const mime = matches[1];
      const b64Data = matches[2];
      const byteString = atob(b64Data);
      const len = byteString.length;
      const u8arr = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        u8arr[i] = byteString.charCodeAt(i);
      }

      return new File([u8arr], filename, { type: mime });
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Vui lòng nhập tiêu đề và nội dung');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload các ảnh base64 trong nội dung (Quill) nếu có và replace sang URL thật
      let finalContent = formData.content;
      if (finalContent.includes('data:image')) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(finalContent, 'text/html');
        const images = Array.from(doc.querySelectorAll('img'));

        for (const img of images) {
          const src = img.getAttribute('src') || '';
          if (!src.startsWith('data:image')) continue;

          const file = dataUrlToFile(src, `blog-content-${Date.now()}.png`);
          if (!file) continue;

          // Upload lên Firebase
          const uploadResult = await storageService.uploadBlogImage(file);
          if (uploadResult.error || !uploadResult.url) {
            toast.error(uploadResult.error || 'Không upload được ảnh trong nội dung');
            setLoading(false);
            return;
          }

          img.setAttribute('src', uploadResult.url);
        }

        finalContent = doc.body.innerHTML;
      }

      // 2. Upload ảnh đại diện nếu có
      let featuredImageUrl = formData.featuredImage;
      if (featuredImageFile) {
        const uploadResult = await storageService.uploadBlogImage(featuredImageFile);
        if (uploadResult.error || !uploadResult.url) {
          toast.error(uploadResult.error || 'Không upload được ảnh đại diện');
          setLoading(false);
          return;
        }
        featuredImageUrl = uploadResult.url;
      }

      const payload: BlogPostCreateRequest = {
        ...formData,
        content: finalContent,
        featuredImage: featuredImageUrl,
      };

      const result = await blogApi.createPost(payload);
      if (result.success && result.data) {
        toast.success('Tạo bài viết thành công!');
        router.push('/admin/blog');
      } else {
        toast.error(result.error || 'Có lỗi xảy ra khi tạo bài viết');
      }
    } catch {
      toast.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const slugPreview = formData.slug || generateSlugFromTitle(formData.title || '');

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="w-full py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-primary-100 px-3 py-1 mb-3 shadow-sm">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary-500" />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-primary-700">
                Trình soạn thảo Blog
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Tạo bài viết mới
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-xl">
              Soạn thảo nội dung bằng Quill, tối ưu SEO và xem trước bài viết ở dạng thẻ blog và kết quả tìm kiếm.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => router.push('/admin/blog')}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Quay lại danh sách
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-primary-700 hover:to-accent-600 disabled:opacity-60"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                💾
              </span>
              {loading ? 'Đang lưu...' : 'Lưu bài viết'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Form bên trái */}
          <div className="space-y-6">
            <div className="bg-white/90 rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-5">
              {/* Title + slug */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Tiêu đề bài viết *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        title: e.target.value,
                        metaTitle: prev.metaTitle || e.target.value,
                        slug: prev.slug || generateSlugFromTitle(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ví dụ: 5 lợi ích tuyệt vời của yoga buổi sáng"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Đường dẫn (slug)
                  </label>
                  <p className="text-xs text-gray-500 mb-1 truncate">
                    https://yenyoga.vn/blog/
                    <span className="font-mono text-gray-800">{slugPreview || 'tieu-de-bai-viet'}</span>
                  </p>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        slug: generateSlugFromTitle(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="tieu-de-bai-viet"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Có thể chỉnh sửa slug. Hệ thống tự chuẩn hóa bỏ dấu và ký tự đặc biệt.
                  </p>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Mô tả ngắn
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Mô tả này sẽ hiển thị ở trang blog và phần preview."
                />
              </div>

              {/* SEO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Tiêu đề SEO (meta title)
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle || ''}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        metaTitle: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Nếu bỏ trống sẽ dùng tiêu đề bài viết"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Mô tả SEO (meta description)
                  </label>
                  <textarea
                    value={formData.metaDescription || ''}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        metaDescription: e.target.value,
                      }))
                    }
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Tối đa ~150–160 ký tự để hiển thị đẹp trên Google."
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white/90 rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-800">
                  Nội dung bài viết *
                </label>
                <span className="text-xs text-gray-400">
                  Sử dụng các nút trên thanh công cụ để định dạng, chèn ảnh, trích dẫn...
                </span>
              </div>
              <RichTextEditor
                value={formData.content}
                onChange={(html) =>
                  setFormData(prev => ({
                    ...prev,
                    content: html,
                  }))
                }
                disabled={loading}
              />
            </div>

            {/* Author, tags, publish */}
            <div className="bg-white/90 rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Tác giả
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Tên tác giả"
                  />
                </div>
                <div className="flex items-center mt-1">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        isPublished: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublished" className="ml-2 text-sm text-gray-800">
                    Xuất bản ngay sau khi lưu
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Nhập tag và nhấn Enter (ví dụ: yoga, sức khỏe)"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2.5 rounded-lg bg-primary-600 text-xs font-semibold text-white hover:bg-primary-700"
                  >
                    Thêm
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-primary-500 hover:text-primary-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview bên phải */}
          <div className="space-y-6 lg:sticky lg:top-24 self-start">
            {/* Featured image & status */}
            <div className="bg-white/90 rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-gray-800">
                  Ảnh đại diện & trạng thái
                </h2>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                  Preview
                </span>
              </div>

              <ImageUpload
                value={formData.featuredImage}
                // Chỉ lưu file tạm, upload khi submit form
                uploadOnSelect={false}
                onFileSelect={(file) => setFeaturedImageFile(file)}
                // Nhận URL preview (blob:) để hiển thị ở card preview bên phải
                onChange={(url) =>
                  setFormData(prev => ({
                    ...prev,
                    featuredImage: url,
                  }))
                }
                onRemove={() => {
                  setFeaturedImageFile(null);
                  setFormData(prev => ({
                    ...prev,
                    featuredImage: '',
                  }));
                }}
                disabled={loading}
                placeholder="Chọn ảnh đại diện nổi bật cho bài viết"
                maxSize={5}
              />

              <div className="flex items-center justify-between pt-2 text-xs text-gray-600">
                <div>
                  <span className="font-semibold">Trạng thái:</span>{' '}
                  {formData.isPublished ? (
                    <span className="text-green-600">Sẽ xuất bản sau khi lưu</span>
                  ) : (
                    <span className="text-yellow-600">Lưu dưới dạng bản nháp</span>
                  )}
                </div>
              </div>
            </div>

            {/* Card preview */}
            <div className="bg-white/95 rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">
                Xem trước thẻ bài viết trên trang blog
              </h2>
              <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="relative h-40 bg-gray-100">
                  {formData.featuredImage ? (
                    <Image
                      src={formData.featuredImage}
                      alt={formData.title || 'Ảnh đại diện'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                      <span className="mb-1">Chưa chọn ảnh đại diện</span>
                      <span>Ảnh sẽ hiển thị tại đây</span>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>{formData.author || 'Tác giả'}</span>
                    <span>{formData.tags[0] || 'Chủ đề'}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {formData.title || 'Tiêu đề bài viết sẽ hiển thị ở đây'}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {formData.excerpt ||
                      'Mô tả ngắn của bài viết sẽ hiển thị ở đây. Hãy viết nội dung hấp dẫn để thu hút người đọc click vào bài.'}
                  </p>
                </div>
              </div>
            </div>

            {/* SEO preview */}
            <div className="bg-white/95 rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">
                Xem trước đoạn hiển thị trên Google
              </h2>
              <div className="rounded-xl bg-gray-900 text-xs text-gray-100 p-4 space-y-1">
                <p className="text-[#4e9af1] text-[13px] truncate">
                  {formData.metaTitle || formData.title || 'Tiêu đề SEO của bài viết'}
                </p>
                <p className="text-[#0f9d58] truncate">
                  https://yenyoga.vn/blog/{slugPreview || 'tieu-de-bai-viet'}
                </p>
                <p className="text-gray-200 text-[11px] leading-snug">
                  {formData.metaDescription ||
                    formData.excerpt ||
                    'Mô tả SEO sẽ hiển thị tại đây. Đây là đoạn nội dung ngắn gọn, hấp dẫn nhằm thu hút người dùng click vào bài viết của bạn.'}
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    </AdminLayout>
  );
}

