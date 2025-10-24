import { useState } from 'react';
import { Upload, Sparkles, Calendar, Zap } from 'lucide-react';
import { PosterUpload } from './components/PostSync/PosterUpload';
import { CopywritingCheck } from './components/PostSync/CopywritingCheck';
import { SchedulePost } from './components/PostSync/SchedulePost';

function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [scheduledDate, setScheduledDate] = useState<string>('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PostSync</h1>
                <p className="text-xs text-gray-500">Design once. Post everywhere.</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                MVP Demo
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Multi-Platform Post
          </h2>
          <p className="text-gray-600">
            Upload your poster, optimize your copy, and schedule across all platforms
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${uploadedImage ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">Upload</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${caption ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Copy</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${scheduledDate ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Schedule</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <PosterUpload
              uploadedImage={uploadedImage}
              onImageUpload={setUploadedImage}
            />
            <CopywritingCheck
              caption={caption}
              onCaptionChange={setCaption}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <SchedulePost
              scheduledDate={scheduledDate}
              onScheduleChange={setScheduledDate}
              uploadedImage={uploadedImage}
              caption={caption}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
