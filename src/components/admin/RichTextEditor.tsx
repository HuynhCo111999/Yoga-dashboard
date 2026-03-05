'use client';

import { useEffect, useRef, useState } from 'react';
import type QuillType from 'quill';
import 'quill/dist/quill.snow.css';

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
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importContent, setImportContent] = useState('');

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
              // Custom handler: chèn ảnh dạng base64, upload lên Firebase khi submit form
              image: function imageHandler(this: any) {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';

                input.onchange = () => {
                  const file = input.files?.[0];
                  if (!file) return;

                  const maxSizeMb = 5;
                  if (file.size > maxSizeMb * 1024 * 1024) {
                    alert(`Ảnh quá lớn, vui lòng chọn ảnh dưới ${maxSizeMb}MB.`);
                    return;
                  }

                  const reader = new FileReader();
                  reader.onload = () => {
                    const base64 = reader.result;
                    if (typeof base64 !== 'string') return;

                    const range = this.quill.getSelection(true);
                    this.quill.insertEmbed(range.index, 'image', base64);
                    this.quill.setSelection(range.index + 1);
                  };
                  reader.readAsDataURL(file);
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
      <div className="flex justify-end mb-1">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setImportContent(value || '');
            setIsImportModalOpen(true);
          }}
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Import HTML
        </button>
      </div>

      <div
        ref={containerRef}
        className="bg-white rounded-lg border border-gray-200 quill-container h-[500px]"
      />

      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Import nội dung HTML vào bài viết
              </h3>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-xs text-gray-500">
                Dán nội dung HTML vào đây. Khi bấm <span className="font-semibold">OK</span>, toàn bộ nội dung hiện tại trong trình soạn thảo sẽ được thay thế bằng đoạn HTML này.
              </p>
              <textarea
                value={importContent}
                onChange={(e) => setImportContent(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="<p>Ví dụ: &lt;strong&gt;Tiêu đề&lt;/strong&gt;...</p>"
              />
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-1.5 text-xs font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  const quill = quillRef.current;
                  if (quill) {
                    const html = importContent || '<p><br/></p>';
                    quill.clipboard.dangerouslyPasteHTML(html);
                    onChange(html);
                  }
                  setIsImportModalOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold rounded-md bg-primary-600 text-white hover:bg-primary-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

