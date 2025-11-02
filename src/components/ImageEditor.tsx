import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCw, Download, Loader2 } from 'lucide-react';

interface ImageEditorProps {
  imageUrl: string;
  onBack: () => void;
}

interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
  zoom: number;
  filter: string;
}

interface PlatformSize {
  name: string;
  width: number;
  height: number;
  enabled: boolean;
}

type ExportFormat = 'png' | 'jpg' | 'webp';

export function ImageEditor({ imageUrl, onBack }: ImageEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'platforms' | 'download'>('edit');
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    rotation: 0,
    zoom: 1,
    filter: 'none',
  });

  const [platforms, setPlatforms] = useState<PlatformSize[]>([
    { name: 'Instagram Post', width: 1080, height: 1080, enabled: false },
    { name: 'Instagram Story', width: 1080, height: 1920, enabled: false },
    { name: 'Facebook', width: 1200, height: 630, enabled: false },
    { name: 'Twitter', width: 1200, height: 675, enabled: false },
    { name: 'LinkedIn', width: 1200, height: 627, enabled: false },
    { name: 'Pinterest', width: 1000, height: 1500, enabled: false },
  ]);

  const [customSize, setCustomSize] = useState({ width: '', height: '' });
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [quality, setQuality] = useState(90);
  const [isDownloading, setIsDownloading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      imageRef.current = img;
      drawImage();
    };
  }, [imageUrl]);

  useEffect(() => {
    drawImage();
  }, [adjustments]);

  const drawImage = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((adjustments.rotation * Math.PI) / 180);
    ctx.scale(adjustments.zoom, adjustments.zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    const filters = [
      `brightness(${100 + adjustments.brightness}%)`,
      `contrast(${100 + adjustments.contrast}%)`,
      `saturate(${100 + adjustments.saturation}%)`,
    ];

    if (adjustments.filter !== 'none') {
      switch (adjustments.filter) {
        case 'vivid':
          filters.push('saturate(150%) contrast(110%)');
          break;
        case 'bw':
          filters.push('grayscale(100%)');
          break;
        case 'vintage':
          filters.push('sepia(50%) contrast(90%)');
          break;
        case 'cool':
          filters.push('hue-rotate(180deg) saturate(120%)');
          break;
      }
    }

    ctx.filter = filters.join(' ');
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  };

  const handleReset = () => {
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      rotation: 0,
      zoom: 1,
      filter: 'none',
    });
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setAdjustments(prev => ({
      ...prev,
      zoom: direction === 'in' ? Math.min(prev.zoom + 0.1, 3) : Math.max(prev.zoom - 0.1, 0.5),
    }));
  };

  const handleRotate = () => {
    setAdjustments(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  };

  const togglePlatform = (index: number) => {
    setPlatforms(prev =>
      prev.map((p, i) => (i === index ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const toggleSelectAll = () => {
    const allEnabled = platforms.every(p => p.enabled);
    setPlatforms(prev => prev.map(p => ({ ...p, enabled: !allEnabled })));
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;

    setIsDownloading(true);

    try {
      const selectedPlatforms = platforms.filter(p => p.enabled);

      if (selectedPlatforms.length === 0 && !customSize.width && !customSize.height) {
        const dataUrl = canvasRef.current.toDataURL(`image/${exportFormat}`, quality / 100);
        const link = document.createElement('a');
        link.download = `edited-image.${exportFormat}`;
        link.href = dataUrl;
        link.click();
      } else {
        for (const platform of selectedPlatforms) {
          await downloadResizedImage(platform.name, platform.width, platform.height);
        }

        if (customSize.width && customSize.height) {
          await downloadResizedImage('custom', parseInt(customSize.width), parseInt(customSize.height));
        }
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadResizedImage = async (name: string, width: number, height: number) => {
    if (!canvasRef.current) return;

    const resizeCanvas = document.createElement('canvas');
    const ctx = resizeCanvas.getContext('2d');
    if (!ctx) return;

    resizeCanvas.width = width;
    resizeCanvas.height = height;

    ctx.drawImage(canvasRef.current, 0, 0, width, height);

    const dataUrl = resizeCanvas.toDataURL(`image/${exportFormat}`, quality / 100);
    const link = document.createElement('a');
    link.download = `${name.toLowerCase().replace(/\s+/g, '-')}-${width}x${height}.${exportFormat}`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 overflow-hidden">
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Mobile Tabs */}
      <div className="lg:hidden bg-gray-800 border-b border-gray-700 flex">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'edit'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setActiveTab('platforms')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'platforms'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Platforms
        </button>
        <button
          onClick={() => setActiveTab('download')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'download'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Download
        </button>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-120px)] lg:h-[calc(100vh-72px)]">
        {/* Left Sidebar - Editing Tools */}
        <div className={`${activeTab === 'edit' ? 'block' : 'hidden'} lg:block w-full lg:w-1/5 bg-gray-800 border-r border-gray-700 overflow-y-auto p-6`}>
          <h3 className="text-lg font-semibold text-white mb-6">Editing Tools</h3>

          <div className="space-y-6">
            {/* Brightness */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Brightness
              </label>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.brightness}
                onChange={e => setAdjustments(prev => ({ ...prev, brightness: Number(e.target.value) }))}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">{adjustments.brightness}</div>
            </div>

            {/* Contrast */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Contrast
              </label>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.contrast}
                onChange={e => setAdjustments(prev => ({ ...prev, contrast: Number(e.target.value) }))}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">{adjustments.contrast}</div>
            </div>

            {/* Saturation */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Saturation
              </label>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.saturation}
                onChange={e => setAdjustments(prev => ({ ...prev, saturation: Number(e.target.value) }))}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">{adjustments.saturation}</div>
            </div>

            {/* Filters */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Filter Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['none', 'vivid', 'bw', 'vintage', 'cool'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setAdjustments(prev => ({ ...prev, filter }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      adjustments.filter === filter
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Reset All
            </button>
          </div>
        </div>

        {/* Center - Image Preview */}
        <div className={`${activeTab === 'edit' || activeTab === 'download' ? 'block' : 'hidden'} lg:block flex-1 bg-gray-900 flex flex-col items-center justify-center p-6 overflow-auto`}>
          <div className="relative max-h-[80vh]">
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
              style={{
                filter: `brightness(${100 + adjustments.brightness}%) contrast(${100 + adjustments.contrast}%) saturate(${100 + adjustments.saturation}%)`,
                transform: `rotate(${adjustments.rotation}deg) scale(${adjustments.zoom})`,
                transition: 'transform 0.3s ease',
              }}
            />
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => handleZoom('out')}
              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-400 font-medium min-w-[60px] text-center">
              {Math.round(adjustments.zoom * 100)}%
            </span>
            <button
              onClick={() => handleZoom('in')}
              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleRotate}
              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors ml-4"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Sidebar - Platform Sizes */}
        <div className={`${activeTab === 'platforms' ? 'block' : 'hidden'} lg:block w-full lg:w-1/5 bg-gray-800 border-l border-gray-700 overflow-y-auto p-6`}>
          <h3 className="text-lg font-semibold text-white mb-4">Select Platform Sizes</h3>

          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={platforms.every(p => p.enabled)}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-gray-600"
              />
              <span className="font-medium">Select All</span>
            </label>
          </div>

          <div className="space-y-3">
            {platforms.map((platform, index) => (
              <label key={platform.name} className="flex items-start gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={platform.enabled}
                  onChange={() => togglePlatform(index)}
                  className="w-4 h-4 rounded border-gray-600 mt-0.5"
                />
                <div className="flex-1">
                  <div className="font-medium">{platform.name}</div>
                  <div className="text-xs text-gray-500">
                    {platform.width}x{platform.height}
                  </div>
                </div>
              </label>
            ))}

            {/* Custom Size */}
            <div className="pt-4 border-t border-gray-700">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Custom Size</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Width"
                  value={customSize.width}
                  onChange={e => setCustomSize(prev => ({ ...prev, width: e.target.value }))}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                />
                <input
                  type="number"
                  placeholder="Height"
                  value={customSize.height}
                  onChange={e => setCustomSize(prev => ({ ...prev, height: e.target.value }))}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={`${activeTab === 'download' ? 'block' : 'hidden'} lg:block bg-gray-800 border-t border-gray-700 px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300">Format:</label>
              <select
                value={exportFormat}
                onChange={e => setExportFormat(e.target.value as ExportFormat)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="webp">WebP</option>
              </select>
            </div>

            {exportFormat === 'jpg' && (
              <div className="flex items-center gap-2 flex-1 lg:flex-initial">
                <label className="text-sm text-gray-300">Quality:</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={e => setQuality(Number(e.target.value))}
                  className="flex-1 lg:w-32"
                />
                <span className="text-sm text-gray-400 min-w-[40px]">{quality}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onBack}
              className="flex-1 lg:flex-initial px-6 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 lg:flex-initial px-8 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-base font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
