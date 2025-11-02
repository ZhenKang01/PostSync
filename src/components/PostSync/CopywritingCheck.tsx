import { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';

interface CopywritingCheckProps {
  caption: string;
  onCaptionChange: (caption: string) => void;
}

interface Feedback {
  tone: string;
  sentiment: string;
  suggestions: string[];
  ctaSuggestion: string;
  score: number;
}

export function CopywritingCheck({ caption, onCaptionChange }: CopywritingCheckProps) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCopy = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const wordCount = caption.trim().split(/\s+/).length;
      const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(caption);
      const hasHashtag = caption.includes('#');
      const hasCTA = /check|try|get|learn|discover|join|sign up|download|start/i.test(caption);

      const suggestions: string[] = [];
      if (wordCount > 50) suggestions.push('Consider shortening for better engagement');
      if (!hasEmoji && wordCount > 10) suggestions.push('Add an emoji to make it more engaging');
      if (!hasHashtag) suggestions.push('Include relevant hashtags for better reach');
      if (!hasCTA) suggestions.push('Add a clear call-to-action');
      if (wordCount < 10) suggestions.push('Add more context to your message');

      const score = Math.min(100, 60 + (hasCTA ? 15 : 0) + (hasHashtag ? 10 : 0) + (hasEmoji ? 10 : 0) + (wordCount >= 15 && wordCount <= 40 ? 15 : 0));

      setFeedback({
        tone: caption.includes('!') ? 'Energetic & Enthusiastic' : 'Professional & Informative',
        sentiment: score >= 80 ? 'Positive' : score >= 60 ? 'Neutral' : 'Needs Improvement',
        suggestions: suggestions.length > 0 ? suggestions : ['Great caption! Well balanced and engaging.'],
        ctaSuggestion: hasCTA ? 'CTA detected: Good!' : 'Try: "Check it out →" or "Learn more"',
        score,
      });

      setIsAnalyzing(false);
    }, 1500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-sm border border-gray-200 dark:border-[#374151] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Copywriting Check</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Get instant feedback on your caption</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#D1D5DB] mb-2">
            Your Caption
          </label>
          <textarea
            value={caption}
            onChange={(e) => onCaptionChange(e.target.value)}
            placeholder="Write your post caption here... Make it engaging!"
            className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-[#374151] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white dark:bg-[#0A0A0F] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {caption.length} characters • {caption.trim().split(/\s+/).filter(w => w).length} words
            </span>
          </div>
        </div>

        <button
          onClick={analyzeCopy}
          disabled={!caption.trim() || isAnalyzing}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-800 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Check Copy
            </>
          )}
        </button>

        {feedback && (
          <div className="space-y-4 mt-6 pt-6 border-t border-gray-200 dark:border-[#374151]">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 dark:text-white">AI Feedback</h4>
              <div className={`px-4 py-2 rounded-lg ${getScoreBgColor(feedback.score)}`}>
                <span className={`text-lg font-bold ${getScoreColor(feedback.score)}`}>
                  {feedback.score}/100
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-[#0A0A0F] rounded-lg p-4 border border-gray-100 dark:border-[#374151]">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tone</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{feedback.tone}</p>
              </div>
              <div className="bg-gray-50 dark:bg-[#0A0A0F] rounded-lg p-4 border border-gray-100 dark:border-[#374151]">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sentiment</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{feedback.sentiment}</p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">CTA Suggestion</p>
                  <p className="text-sm text-blue-700 dark:text-blue-400">{feedback.ctaSuggestion}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Suggestions</p>
              {feedback.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2">
                  {suggestion.includes('Great') ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-500 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
