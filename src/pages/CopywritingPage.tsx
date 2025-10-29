import { useState } from 'react';
import { CopywritingCheck } from '../components/PostSync/CopywritingCheck';
import { Sparkles } from 'lucide-react';

export function CopywritingPage() {
  const [caption, setCaption] = useState('');

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Copywriting Check</h1>
            <p className="text-gray-600">Get instant feedback and optimize your captions</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl">
        <CopywritingCheck caption={caption} onCaptionChange={setCaption} />

        <div className="mt-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">AI Writing Tips</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                <strong>Keep it concise:</strong> Aim for 15-40 words for maximum engagement
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                <strong>Add a CTA:</strong> Include clear call-to-action words like "Try", "Get", "Learn"
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                <strong>Use hashtags:</strong> Include 2-3 relevant hashtags for better reach
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                <strong>Add personality:</strong> Use emojis strategically to make your post engaging
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
