import { useState, useRef } from 'react';
import { UploadCloud, Sparkles, Image as ImageIcon } from 'lucide-react';
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
                <UploadCloud className="w-5 h-5 text-white" />
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
      <div className="max-w-[1200px] mx-auto px-6 md:px-20 py-8 md:py-20">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="relative grid md:grid-cols-2 gap-8">
          {/* Upload Card */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`group relative bg-gray-800 border rounded-2xl p-10 min-h-[400px] flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
              isDragging
                ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] scale-[1.02]'
                : 'border-gray-700 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-[1.02]'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="w-16 h-16 text-blue-500 mb-6" />

            <h3 className="text-2xl font-bold text-white mb-3">
              Upload from Device
            </h3>

            <p className="text-base text-gray-300 text-center mb-2">
              Choose an existing image from your computer
            </p>

            <p className="text-sm text-gray-400 mb-8">
              Supports: JPG, PNG, WebP (Max 10MB)
            </p>

            <button
              type="button"
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:brightness-110 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse Files
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* OR Divider - Desktop */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-[60px] h-[60px] bg-gray-800 rounded-full border-2 border-transparent bg-clip-padding z-10"
               style={{
                 backgroundImage: 'linear-gradient(#1F2937, #1F2937), linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                 backgroundOrigin: 'border-box',
                 backgroundClip: 'padding-box, border-box'
               }}>
            <span className="text-sm font-bold text-white">OR</span>
          </div>

          {/* OR Divider - Mobile */}
          <div className="md:hidden relative flex items-center my-4">
            <div className="flex-grow border-t border-gray-700"></div>
            <div className="flex-shrink-0 mx-4 w-12 h-12 bg-gray-800 rounded-full border-2 border-gray-700 flex items-center justify-center">
              <span className="text-sm font-bold text-white">OR</span>
            </div>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          {/* AI Generation Card */}
          <div
            onClick={() => setShowAIModal(true)}
            className="group relative bg-gray-800 border border-gray-700 rounded-2xl p-10 min-h-[400px] flex flex-col items-center justify-center transition-all duration-300 cursor-pointer hover:border-purple-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-[1.02] bg-gradient-to-br from-gray-800 via-gray-800 to-purple-900/10"
          >
            <Sparkles className="w-16 h-16 text-purple-500 mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 animate-pulse" />

            <h3 className="text-2xl font-bold text-white mb-3">
              Generate with AI
            </h3>

            <p className="text-base text-gray-300 text-center mb-8">
              Describe your vision and let AI create your poster
            </p>

            <button
              type="button"
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-purple-700 text-white text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:brightness-110 shadow-lg flex items-center justify-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                setShowAIModal(true);
              }}
            >
              <Sparkles className="w-4 h-4" />
              Create with AI
            </button>
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
