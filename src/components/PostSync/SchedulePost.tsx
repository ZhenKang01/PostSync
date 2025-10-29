import { useState } from 'react';
import { Calendar, Clock, Send, CheckCircle2 } from 'lucide-react';

interface SchedulePostProps {
  scheduledDate: string;
  onScheduleChange: (date: string) => void;
  uploadedImage: string | null;
  caption: string;
}

interface SelectedPlatform {
  name: string;
  icon: any;
  color: string;
  selected: boolean;
}

export function SchedulePost({ scheduledDate, onScheduleChange, uploadedImage, caption }: SchedulePostProps) {
  const [selectedTime, setSelectedTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [platforms, setPlatforms] = useState<SelectedPlatform[]>([
    { name: 'X', icon: '/image.png', color: 'bg-black', selected: true },
    { name: 'LinkedIn', icon: '/linkedin-logo.svg', color: 'bg-blue-600', selected: true },
    { name: 'Facebook', icon: '/facebook-logo.svg', color: 'bg-blue-500', selected: true },
    { name: 'Instagram', icon: '/instagram-logo.png', color: 'bg-white', selected: true },
  ]);

  const togglePlatform = (platformName: string) => {
    setPlatforms(platforms.map(p =>
      p.name === platformName ? { ...p, selected: !p.selected } : p
    ));
  };

  const handleSchedule = () => {
    if (scheduledDate && selectedTime) {
      const fullDateTime = `${scheduledDate}T${selectedTime}`;
      onScheduleChange(fullDateTime);
      setIsScheduled(true);

      setTimeout(() => setIsScheduled(false), 3000);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const selectedPlatformCount = platforms.filter(p => p.selected).length;
  const canSchedule = uploadedImage && caption && scheduledDate && selectedTime && selectedPlatformCount > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit sticky top-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Schedule Post</h3>
          <p className="text-sm text-gray-500">Choose when and where to publish</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Platforms ({selectedPlatformCount})
          </label>
          <div className="grid grid-cols-2 gap-3">
            {platforms.map((platform) => {
              return (
                <button
                  key={platform.name}
                  onClick={() => togglePlatform(platform.name)}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    platform.selected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                    <img src={platform.icon} alt={platform.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{platform.name}</span>
                  {platform.selected && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date
          </label>
          <input
            type="date"
            value={scheduledDate}
            min={getMinDate()}
            onChange={(e) => onScheduleChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
          />
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Time
          </label>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
          />
        </div>

        {/* Preview Summary */}
        {uploadedImage && caption && (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-lg p-4 border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Post Preview
            </p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <img
                  src={uploadedImage}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 line-clamp-3">{caption}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">Publishing to:</span>
                <div className="flex gap-1">
                  {platforms.filter(p => p.selected).map((platform) => {
                    return (
                      <div key={platform.name} className={`w-6 h-6 ${platform.color} rounded flex items-center justify-center overflow-hidden`}>
                        <img src={platform.icon} alt={platform.name} className="w-full h-full object-cover" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Button */}
        <button
          onClick={handleSchedule}
          disabled={!canSchedule || isScheduled}
          className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            isScheduled
              ? 'bg-green-600 text-white'
              : canSchedule
              ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isScheduled ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Post Scheduled!
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Schedule Post
            </>
          )}
        </button>

        {!canSchedule && (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              {!uploadedImage && '📸 Upload an image • '}
              {!caption && '✍️ Write a caption • '}
              {!scheduledDate && '📅 Pick a date • '}
              {!selectedTime && '🕐 Set a time • '}
              {selectedPlatformCount === 0 && '🌐 Select platforms'}
            </p>
          </div>
        )}

        {scheduledDate && selectedTime && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm text-green-800">
              <span className="font-semibold">Scheduled for:</span> {new Date(`${scheduledDate}T${selectedTime}`).toLocaleString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
