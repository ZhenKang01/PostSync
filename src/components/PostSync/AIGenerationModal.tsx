import { useState } from 'react';
import { ArrowLeft, Sparkles, Loader2, Lightbulb } from 'lucide-react';

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

export function AIGenerationModal({ onClose, onGenerate }: AIGenerationModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const charCount = prompt.length;
  const isValidLength = charCount >= 50 && charCount <= 500;

  const handleStyleClick = (style: string) => {
    const styleText = ` in a ${style.toLowerCase()} style`;
    if (!prompt.includes(styleText)) {
      setPrompt(prev => prev + styleText);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  const handleGenerate = async () => {
    if (!isValidLength) return;

    setIsGenerating(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/pixlr-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
          'apikey': anonKey,
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      const imageUrl = data.image_url || data.url || data.output_url || data.result;

      if (imageUrl) {
        onGenerate(imageUrl);
      } else {
        throw new Error('No image URL returned');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0F] backdrop-blur-md flex items-center justify-center z-50 p-6 md:p-10">
      <div className="bg-[#0A0A0F] max-w-[800px] w-full max-h-[90vh] overflow-y-auto px-6 md:px-10 py-6 md:py-10">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Upload Options
        </button>

        {/* Header */}
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

        {/* Prompt Input */}
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
            disabled={isGenerating}
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

        {/* Style Presets */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-300 mb-3">Quick Style Presets</h3>
          <div className="flex flex-wrap gap-2">
            {STYLE_PRESETS.map((style) => (
              <button
                key={style}
                onClick={() => handleStyleClick(style)}
                disabled={isGenerating}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-sm text-gray-300 hover:border-blue-500 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Example Prompts */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-300 mb-3">Need inspiration? Try these:</h3>
          <div className="grid gap-3">
            {EXAMPLE_PROMPTS.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                disabled={isGenerating}
                className="text-left bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-300 hover:border-blue-500 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Tips Callout */}
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

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="px-8 py-4 bg-transparent border border-gray-700 text-gray-300 hover:border-white rounded-xl text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !isValidLength}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 shadow-lg shadow-blue-500/30"
            style={{ filter: !isGenerating && isValidLength ? 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.4))' : 'none' }}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Image
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
