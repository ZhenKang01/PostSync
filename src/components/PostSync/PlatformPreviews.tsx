import { useState } from 'react';

interface PlatformPreviewsProps {
  uploadedImage: string;
}

interface Platform {
  name: string;
  aspectRatio: string;
  dimensions: string;
  color: string;
}

export function PlatformPreviews({ uploadedImage }: PlatformPreviewsProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('Instagram');

  const platforms: Platform[] = [
    { name: 'Instagram', aspectRatio: '1:1', dimensions: '1080x1080', color: 'from-pink-500 to-purple-600' },
    { name: 'LinkedIn', aspectRatio: '1.91:1', dimensions: '1200x627', color: 'from-blue-600 to-blue-700' },
    { name: 'Twitter', aspectRatio: '16:9', dimensions: '1200x675', color: 'from-sky-400 to-sky-600' },
    { name: 'Facebook', aspectRatio: '1.91:1', dimensions: '1200x630', color: 'from-blue-500 to-blue-600' },
  ];

  const currentPlatform = platforms.find(p => p.name === selectedPlatform) || platforms[0];

  const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case '1:1':
        return 'aspect-square';
      case '1.91:1':
        return 'aspect-[1.91/1]';
      case '16:9':
        return 'aspect-video';
      default:
        return 'aspect-square';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Platform Previews</p>
        <span className="text-xs text-gray-500">{currentPlatform.dimensions}px</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => setSelectedPlatform(platform.name)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              selectedPlatform === platform.name
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {platform.name}
          </button>
        ))}
      </div>

      <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-8 h-8 bg-gradient-to-br ${currentPlatform.color} rounded-lg`}></div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{currentPlatform.name}</p>
            <p className="text-xs text-gray-500">Aspect ratio: {currentPlatform.aspectRatio}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden border border-gray-300 shadow-sm">
          <img
            src={uploadedImage}
            alt={`${currentPlatform.name} preview`}
            className={`w-full object-cover ${getAspectRatioClass(currentPlatform.aspectRatio)}`}
          />
        </div>

        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Auto-resized for {currentPlatform.name}
          </span>
        </div>
      </div>
    </div>
  );
}
