import { useState, useRef } from 'react';
import { Upload, Loader2, Trash2, Recycle } from 'lucide-react';
import { addPoints, getUserData } from '../utils/pointsSystem';

type Screen = 'upload' | 'processing' | 'result';

interface ClassificationResult {
  category: string;
  disposal: string;
  reuse: string;
  imagePreview: string;
  localRule?: string;
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('upload');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [userPoints, setUserPoints] = useState(getUserData().points);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const classifyWaste = () => {
    setCurrentScreen('processing');
    
    // Simulate AI processing with mock data
    setTimeout(() => {
      const mockResults: ClassificationResult[] = [
        {
          category: 'Plastic',
          disposal: 'Recycle in the plastic/glass bin.',
          reuse: 'Cut in half to use as a small plant pot!',
          imagePreview,
          localRule: 'Local Rule: All plastic bottles must be rinsed before recycling. Remove caps and place in blue bins.'
        },
        {
          category: 'Organic',
          disposal: 'Compost in your green waste bin.',
          reuse: 'Use as compost for your garden or plants!',
          imagePreview,
          localRule: 'Local Rule: Food waste accepted in green bins. No meat or dairy products allowed.'
        },
        {
          category: 'Metal',
          disposal: 'Recycle in the metal recycling bin.',
          reuse: 'Clean and repurpose as a storage container!',
          imagePreview,
          localRule: 'Local Rule: Metal cans should be flattened. Aluminum and steel accepted in yellow bins.'
        },
        {
          category: 'Glass',
          disposal: 'Recycle in the glass recycling bin.',
          reuse: 'Use as a decorative vase or storage jar!',
          imagePreview,
          localRule: 'Local Rule: Separate glass by color if possible. Remove lids and rinse before recycling.'
        },
        {
          category: 'Paper',
          disposal: 'Recycle in the paper recycling bin.',
          reuse: 'Shred for packaging material or compost!',
          imagePreview,
          localRule: 'Local Rule: Keep paper dry and clean. Shredded paper accepted. No waxed or glossy paper.'
        }
      ];
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(randomResult);
      setCurrentScreen('result');
      
      // Add points for classification
      const updatedUser = addPoints();
      setUserPoints(updatedUser.points);
    }, 2500);
  };

  const resetApp = () => {
    setCurrentScreen('upload');
    setSelectedImage(null);
    setImagePreview('');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Points Display */}
      <div className="mb-6 flex justify-end">
        <div className="bg-[#4CAF50] text-white px-4 py-2 rounded-full shadow-md">
          <span className="font-semibold">🏆 {userPoints} Points</span>
        </div>
      </div>

      {currentScreen === 'upload' && (
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Classify Waste with AI
            </h2>
            <p className="text-lg text-gray-600">
              Upload an image to get instant disposal and upcycling ideas.
            </p>
          </div>

          {/* Upload Box */}
          <div
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 md:p-16 flex flex-col items-center justify-center cursor-pointer hover:border-[#4CAF50] transition-colors bg-gray-50 hover:bg-green-50"
          >
            <Upload className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-lg text-gray-700 font-medium mb-2">
              {selectedImage ? selectedImage.name : 'Click to Choose an Image'}
            </p>
            <p className="text-sm text-gray-500">or drag and drop</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Preview */}
          {imagePreview && (
            <div className="flex justify-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-xs rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Classify Button */}
          <div className="flex justify-center">
            <button
              onClick={classifyWaste}
              disabled={!selectedImage}
              className="px-8 py-4 bg-[#4CAF50] text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-[#45a049] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
            >
              Classify Waste
            </button>
          </div>
        </div>
      )}

      {currentScreen === 'processing' && (
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Classify Waste with AI
            </h2>
            <p className="text-lg text-gray-600">
              Upload an image to get instant disposal and upcycling ideas.
            </p>
          </div>

          {/* Upload Box - Disabled State */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 md:p-16 flex flex-col items-center justify-center bg-gray-50 opacity-60">
            <Upload className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-lg text-gray-700 font-medium mb-2">
              {selectedImage?.name}
            </p>
          </div>

          {/* Disabled Button */}
          <div className="flex justify-center">
            <button
              disabled
              className="px-8 py-4 bg-gray-300 text-white text-lg font-semibold rounded-lg shadow-lg cursor-not-allowed"
            >
              Classify Waste
            </button>
          </div>

          {/* Loading State */}
          <div className="flex items-center justify-center gap-3 text-orange-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-lg font-medium">
              ⏳ Analyzing image using YOLO AI model... please wait.
            </p>
          </div>
        </div>
      )}

      {currentScreen === 'result' && result && (
        <div className="space-y-8">
          {/* Points Earned Banner */}
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white text-center py-3 rounded-lg shadow-md">
            <p className="text-xl font-bold">🎉 +10 Points Earned!</p>
          </div>

          {/* Result Title */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Classification Result
            </h2>
          </div>

          {/* Image Thumbnail */}
          <div className="flex justify-center">
            <img
              src={result.imagePreview}
              alt="Classified item"
              className="w-48 h-48 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Result Card */}
          <div className="bg-green-50 border-l-4 border-[#4CAF50] rounded-lg p-6 md:p-8 shadow-md space-y-6">
            {/* Category */}
            <div>
              <h3 className="text-2xl font-bold text-[#2E7D32] mb-2">
                Category: {result.category}
              </h3>
            </div>

            {/* Local Recycling Rule */}
            {result.localRule && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h4 className="font-semibold text-blue-900 text-lg mb-1">📍 Local Recycling Rules</h4>
                <p className="text-blue-800">{result.localRule}</p>
              </div>
            )}

            {/* Disposal */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Trash2 className="w-6 h-6 text-gray-700 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">Disposal</h4>
                  <p className="text-gray-700">{result.disposal}</p>
                </div>
              </div>
            </div>

            {/* Reuse */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Recycle className="w-6 h-6 text-[#4CAF50] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">Reuse Idea</h4>
                  <p className="text-gray-700">{result.reuse}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-center">
            <button
              onClick={resetApp}
              className="px-8 py-4 bg-white text-[#4CAF50] text-lg font-semibold rounded-lg shadow-md border-2 border-[#4CAF50] hover:bg-green-50 transition-all transform hover:scale-105"
            >
              Classify Another Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
