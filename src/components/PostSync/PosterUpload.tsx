import { useState, useRef } from 'react';
import { Upload, Sparkles, Image as ImageIcon, X } from 'lucide-react';
import { PlatformPreviews } from './PlatformPreviews';
import { AIGenerationModal } from './AIGenerationModal';

interface PosterUploadProps {
  uploadedImage: string | null;
  onImageUpload: (image: string | null) => void;
}

type UploadMethod = 'selection' | 'upload' | 'ai';

export function PosterUpload({ uploadedImage, onImageUpload }: PosterUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>('selection');
  const [showAIModal, setShowAIModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please upload JPG, PNG, or WebP images only.';
    }

    if (file.size > maxSize) {
      return 'File size exceeds 10MB. Please upload a smaller image.';
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(null), 5000);
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      onImageUpload(event.target?.result as string);
      setUploadMethod('upload');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(null), 5000);
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      onImageUpload(event.target?.result as string);
      setUploadMethod('upload');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onImageUpload(null);
    setUploadMethod('selection');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAIGenerate = (imageUrl: string) => {
    onImageUpload(imageUrl);
    setUploadMethod('ai');
    setShowAIModal(false);
  };

  if (uploadedImage) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              uploadMethod === 'ai'
                ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                : 'bg-gradient-to-br from-blue-500 to-blue-600'
            }`}>
              {uploadMethod === 'ai' ? (
                <Sparkles className="w-5 h-5 text-white" />
              ) : (
                <Upload className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {uploadMethod === 'ai' ? 'AI Generated Image' : 'Uploaded Image'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Resize for all platforms below
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveImage}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Remove
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <img
              src={uploadedImage}
              alt="Uploaded poster"
              className="w-full h-64 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
            />
          </div>

          <PlatformPreviews uploadedImage={uploadedImage} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Your Poster</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload an image or generate one with AI
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`group relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  Upload from Device
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Choose an existing image from your computer
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  JPG, PNG, WebP • Max 10MB
                </p>
              </div>
              <button
                type="button"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Browse Files
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-700 z-10">
              <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">OR</span>
            </div>

            <div
              onClick={() => setShowAIModal(true)}
              className="group relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer border-purple-300 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                    Generate with AI
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Describe your vision and let AI create it
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Powered by AI • Unlimited generations
                  </p>
                </div>
                <button
                  type="button"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm group-hover:shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAIModal(true);
                  }}
                >
                  Create with AI
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAIModal && (
        <AIGenerationModal
          onClose={() => setShowAIModal(false)}
          onGenerate={handleAIGenerate}
        />
      )}
    </>
  );
}
