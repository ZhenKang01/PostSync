import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Lightbulb, RefreshCw, Edit3 } from 'lucide-react';

interface AIGenerationModalProps {
  onClose: () => void;
  onGenerate: (imageUrl: string) => void;
}

const STYLE_PRESETS = [
  'Modern & Clean',
  'Vintage Retro',
  'Bold & Colorful',
  'Minimalist',
  'Professional',
  'Artistic',
];

const EXAMPLE_PROMPTS = [
  "A motivational poster with 'Never Give Up' in bold white typography on a gradient background from deep blue to purple, with subtle geometric patterns",
  'A product launch announcement for a tech gadget with futuristic blue and cyan tones, featuring holographic effects and clean modern design',
  'A summer music festival flyer with vibrant yellow and pink colors, palm trees, and energetic typography in a retro 80s style',
];

const STATUS_MESSAGES = [
  "Creating your image...",
  "Adding details...",
  "Almost there...",
];

const FUN_FACTS = [
  "Did you know? AI can generate thousands of variations",
  "Fun fact: Each generation is completely unique",
  "Pro tip: More details = better results",
  "Amazing: AI learns from millions of images",
];

export function AIGenerationModal({ onClose, onGenerate }: AIGenerationModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState(STATUS_MESSAGES[0]);
  const [progress, setProgress] = useState(0);
  const [funFact, setFunFact] = useState(FUN_FACTS[0]);

  const charCount = prompt.length;
  const isValidLength = charCount >= 50 && charCount <= 500;

  useEffect(() => {
    if (!isGenerating) return;

    const statusInterval = setInterval(() => {
      const elapsed = progress / 18;
      if (elapsed < 2) {
        setStatusMessage(STATUS_MESSAGES[0]);
      } else if (elapsed < 4) {
        setStatusMessage(STATUS_MESSAGES[1]);
      } else {
        setStatusMessage(STATUS_MESSAGES[2]);
      }
    }, 100);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 1.8;
      });
    }, 100);

    const factInterval = setInterval(() => {
      setFunFact(prev => {
        const currentIndex = FUN_FACTS.indexOf(prev);
        return FUN_FACTS[(currentIndex + 1) % FUN_FACTS.length];
      });
    }, 3000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(progressInterval);
      clearInterval(factInterval);
    };
  }, [isGenerating, progress]);

  const handleStyleClick = (style: string) => {
    const styleText = ` in a ${style.toLowerCase()} style`;
    if (!prompt.includes(styleText)) {
      setPrompt(prev => prev + styleText);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  const generateWithAI = async (promptText: string) => {
    await new Promise(resolve => setTimeout(resolve, 5000));

    return {
      imageUrl: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1080',
      prompt: promptText,
      timestamp: Date.now()
    };
  };

  const handleGenerate = async () => {
    if (!isValidLength) return;

    setIsGenerating(true);
    setProgress(0);
    setStatusMessage(STATUS_MESSAGES[0]);

    try {
      const result = await generateWithAI(prompt.trim());

      setProgress(100);
      setTimeout(() => {
        setGeneratedImage(result.imageUrl);
        setIsGenerating(false);
      }, 500);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedImage(null);
    handleGenerate();
  };

  const handleEditPrompt = () => {
    setGeneratedImage(null);
  };

  const handleUseImage = () => {
    if (generatedImage) {
      onGenerate(generatedImage);
    }
  };

  const handleStartOver = () => {
    setGeneratedImage(null);
    setPrompt('');
  };

  if (isGenerating) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0F] bg-opacity-95 backdrop-blur-md flex items-center justify-center z-[100]">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin mb-6"
               style={{
                 background: 'conic-gradient(from 0deg, #3B82F6, #8B5CF6, #EC4899, #3B82F6)',
                 maskImage: 'radial-gradient(circle, transparent 35%, black 36%)',
                 WebkitMaskImage: 'radial-gradient(circle, transparent 35%, black 36%)'
               }}>
          </div>

          <p className="text-xl text-white font-medium mb-6">
            {statusMessage}
          </p>

          <div className="w-[300px] h-1 bg-gray-800 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-gray-400 mt-2">
            {funFact}
          </p>
        </div>
      </div>
    );
  }

  if (generatedImage) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0F] backdrop-blur-md flex items-center justify-center z-50 p-6 md:p-10">
        <div className="bg-[#0A0A0F] max-w-[900px] w-full max-h-[90vh] overflow-y-auto px-6 md:px-10 py-6 md:py-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
            Your Generated Image
          </h2>

          <div className="mb-6 rounded-xl overflow-hidden border-2 border-gray-700">
            <img
              src={generatedImage}
              alt="AI Generated"
              className="w-full h-auto object-contain max-h-[500px]"
            />
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 mb-8">
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-gray-300">Your prompt: </span>
              "{prompt}"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleRegenerate}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 border border-gray-700 text-white hover:border-blue-500 rounded-xl font-medium transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Regenerate
            </button>

            <button
              onClick={handleEditPrompt}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 border border-gray-700 text-white hover:border-blue-500 rounded-xl font-medium transition-all"
            >
              <Edit3 className="w-5 h-5" />
              Edit Prompt & Retry
            </button>

            <button
              onClick={handleUseImage}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30"
            >
              <Sparkles className="w-5 h-5" />
              Use This Image
            </button>

            <button
              onClick={handleStartOver}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-gray-700 text-gray-300 hover:border-white rounded-xl font-medium transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0A0A0F] backdrop-blur-md flex items-center justify-center z-50 p-6 md:p-10">
      <div className="bg-[#0A0A0F] max-w-[800px] w-full max-h-[90vh] overflow-y-auto px-6 md:px-10 py-6 md:py-10">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Upload Options
        </button>

        <div className="flex flex-col items-center mb-10">
          <div className="mb-4 animate-pulse">
            <Sparkles className="w-12 h-12 text-blue-500" style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' }} />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-3">
            Describe Your Vision
          </h1>

          <p className="text-lg text-gray-400 text-center max-w-xl">
            Tell us what you want to create, and our AI will generate it
          </p>
        </div>

        <div className="mb-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
            placeholder={`Describe the image you want to create...

Example: 'A vibrant sunset over mountains with an inspirational quote overlay about success. Use warm orange and purple colors with a modern minimalist style.'

Be specific about:
• Style and mood (modern, vintage, minimalist, bold)
• Colors and tones
• Main subjects or elements
• Text or quotes (if any)
• Composition and layout`}
            className="w-full min-h-[200px] bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white text-base leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
          />
          <div className="flex justify-end mt-2">
            <span className={`text-sm ${
              charCount < 50
                ? 'text-red-500'
                : 'text-gray-400'
            }`}>
              {charCount}/500 characters
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-300 mb-3">Quick Style Presets</h3>
          <div className="flex flex-wrap gap-2">
            {STYLE_PRESETS.map((style) => (
              <button
                key={style}
                onClick={() => handleStyleClick(style)}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-sm text-gray-300 hover:border-blue-500 hover:bg-gray-800 transition-all"
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-300 mb-3">Need inspiration? Try these:</h3>
          <div className="grid gap-3">
            {EXAMPLE_PROMPTS.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-left bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-300 hover:border-blue-500 hover:scale-[1.02] transition-all"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-300 mb-2">Pro Tips for Better Results:</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Be specific about colors, style, and mood</li>
                <li>• Mention any text you want included</li>
                <li>• Describe the layout and composition</li>
                <li>• Reference visual styles (e.g., 'like a magazine cover')</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={onClose}
            className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 hover:border-white rounded-xl text-base font-medium transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={!isValidLength}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 shadow-lg shadow-blue-500/30"
            style={{ filter: isValidLength ? 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.4))' : 'none' }}
          >
            <Sparkles className="w-5 h-5" />
            Generate Image
          </button>
        </div>
      </div>
    </div>
  );
}
