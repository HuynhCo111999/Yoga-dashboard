'use client';

import { useEffect, useRef } from 'react';
import type QuillType from 'quill';
import 'quill/dist/quill.snow.css';
import { storageService } from '@/lib/firebase';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  disabled = false,
}: RichTextEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillType | null>(null);

  // Khởi tạo Quill một lần trên client
  useEffect(() => {
    if (!containerRef.current || quillRef.current || typeof window === 'undefined') {
      return;
    }

    let cancelled = false;

    const initQuill = async () => {
      const Quill = (await import('quill')).default as typeof QuillType;

      if (cancelled || !containerRef.current) return;

      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'link', 'image'],
        [{ align: [] }],
        ['clean'],
      ];

      const quill = new Quill(containerRef.current, {
        theme: 'snow',
        placeholder: 'Nhập nội dung bài viết...',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              // Custom handler upload ảnh lên Firebase rồi chèn vào editor
              image: function imageHandler(this: any) {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';

                input.onchange = async () => {
                  const file = input.files?.[0];
                  if (!file) return;

                  const maxSizeMb = 5;
                  if (file.size > maxSizeMb * 1024 * 1024) {
                    alert(`Ảnh quá lớn, vui lòng chọn ảnh dưới ${maxSizeMb}MB.`);
                    return;
                  }

                  try {
                    const result = await storageService.uploadBlogImage(file);
                    if (result.error || !result.url) {
                      alert(result.error || 'Upload ảnh thất bại, vui lòng thử lại.');
                      return;
                    }

                    const range = this.quill.getSelection(true);
                    this.quill.insertEmbed(range.index, 'image', result.url);
                    this.quill.setSelection(range.index + 1);
                  } catch (e) {
                    console.error('Image upload error', e);
                    alert('Có lỗi xảy ra khi upload ảnh.');
                  }
                };

                input.click();
              },
            },
          },
        },
        readOnly: disabled,
      });

      quillRef.current = quill;

      // Set initial content từ value (HTML)
      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }

      // Cập nhật onChange khi nội dung thay đổi
      quill.on('text-change', () => {
        const html = quill.root.innerHTML;
        onChange(html);
      });
    };

    void initQuill();

    return () => {
      cancelled = true;
    };
  }, [value, onChange, disabled]);

  // Đồng bộ khi prop value thay đổi từ ngoài vào (ví dụ load bài viết để edit)
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    const currentHtml = quill.root.innerHTML;
    const nextHtml = value || '<p><br/></p>';
    if (currentHtml !== nextHtml) {
      const selection = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(nextHtml);
      if (selection) {
        quill.setSelection(selection);
      }
    }
  }, [value]);

  // Cập nhật trạng thái readOnly khi disabled thay đổi
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;
    quill.enable(!disabled);
  }, [disabled]);

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="bg-white rounded-lg border border-gray-200 quill-container h-[500px]"
      />
    </div>
  );
}

