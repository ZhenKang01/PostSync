import { useState } from 'react';
import { PosterUpload } from '../components/PostSync/PosterUpload';
import { CopywritingCheck } from '../components/PostSync/CopywritingCheck';
import { SchedulePost } from '../components/PostSync/SchedulePost';
import { Upload, Sparkles, Calendar } from 'lucide-react';

export function CreatePost() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [scheduledDate, setScheduledDate] = useState<string>('');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create Your Multi-Platform Post
        </h1>
        <p className="text-gray-600 dark:text-[#D1D5DB]">
          Upload your poster, optimize your copy, and schedule across all platforms
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${uploadedImage ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Upload</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-700"></div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${caption ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Copy</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-700"></div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${scheduledDate ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Schedule</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
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

        <div className="space-y-6">
          <SchedulePost
            scheduledDate={scheduledDate}
            onScheduleChange={setScheduledDate}
            uploadedImage={uploadedImage}
            caption={caption}
          />
        </div>
      </div>
    </div>
  );
}
