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

  // Real Integration with Flask API Backend via Axios/Fetch
  const classifyWaste = async () => {
    if (!selectedImage) return;

    setCurrentScreen('processing');

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      // Connecting backend on safer IP channel
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Backend failed to respond');
      }

      const data = await response.json();

      if (data.status === 'success' && data.predictions.length > 0) {
        const detectedObject = data.predictions[0].toLowerCase();

        // Rule base structural triage mapping system
        let category = 'General Waste';
        let disposal = 'Dispose of in the general landfills bin.';
        let reuse = 'Can it be upcycled or repaired? Try to find creative uses!';
        let localRule = 'Local Rule: Ensure general waste is tightly bagged before disposal.';

        if (['bottle', 'wine glass', 'cup', 'glass'].some(el => detectedObject.includes(el))) {
          category = 'Glass / Plastic';
          disposal = 'Rinse and recycle in the designated recycling bin.';
          reuse = 'Clean thoroughly and use as a small indoor plant pot, decorative vase, or storage jar!';
          localRule = 'Local Rule: Remove caps and separate glass items by color if possible.';
        } else if (['can', 'knife', 'fork', 'spoon', 'bowl'].some(el => detectedObject.includes(el))) {
          category = 'Metal';
          disposal = 'Recycle in the yellow metal recycling bin.';
          reuse = 'Clean, paint, and repurpose as an aesthetic desktop pen stand or tool organizer!';
          localRule = 'Local Rule: Metal cans should be flattened. Aluminum and steel are accepted.';
        } else if (['apple', 'banana', 'orange', 'sandwich', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake'].some(el => detectedObject.includes(el))) {
          category = 'Organic Waste';
          disposal = 'Compost in your home compost pit or drop in the green waste bin.';
          reuse = 'Excellent source for organic compost manure to nourish your backyard garden or plants!';
          localRule = 'Local Rule: Food waste accepted in green bins. Ensure no plastic wrappers are mixed.';
        } else if (['book', 'newspaper', 'cardboard'].some(el => detectedObject.includes(el))) {
          category = 'Paper / Cardboard';
          disposal = 'Flatten and place in the blue paper recycling bin.';
          reuse = 'Use for DIY crafts, scrapbooking, or shred for home composting layers.';
          localRule = 'Local Rule: Keep paper dry. Wet paper or pizza boxes with oil stains go to general waste.';
        }

        setResult({
          category: `${category} (${data.predictions[0]})`,
          disposal: disposal,
          reuse: reuse,
          imagePreview: imagePreview,
          localRule: localRule
        });

      } else {
        setResult({
          category: 'Unclassified Item',
          disposal: 'Drop in the general waste bin if unsure.',
          reuse: 'Look at the item carefully; can it be repurposed instead of thrown away?',
          imagePreview: imagePreview,
          localRule: 'Local Rule: If an item cannot be detected, look up the material type locally before discarding.'
        });
      }

      setCurrentScreen('result');

      // Update points dynamically
      const updatedUser = addPoints();
      setUserPoints(updatedUser.points);

    } catch (error) {
      console.error('Error connecting to ML backend:', error);
      alert('Backend Server is not running on port 5000! Make sure your Python terminal is active.');
      setCurrentScreen('upload');
    }
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
              Upload an image to get instant disposal and upcycling ideas via Real YOLOv8 AI.
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
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Classify Waste with AI
            </h2>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 md:p-16 flex flex-col items-center justify-center bg-gray-50 opacity-60">
            <Upload className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-lg text-gray-700 font-medium mb-2">
              {selectedImage?.name}
            </p>
          </div>

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
              ⏳ Running real-time AI object detection on Python layer... please wait.
            </p>
          </div>
        </div>
      )}

      {currentScreen === 'result' && result && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white text-center py-3 rounded-lg shadow-md">
            <p className="text-xl font-bold">🎉 +10 Points Earned!</p>
          </div>

          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Classification Result
            </h2>
          </div>

          <div className="flex justify-center">
            <img
              src={result.imagePreview}
              alt="Classified item"
              className="w-48 h-48 object-cover rounded-lg shadow-md"
            />
          </div>

          <div className="bg-green-50 border-l-4 border-[#4CAF50] rounded-lg p-6 md:p-8 shadow-md space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-[#2E7D32] mb-2">
                Category: {result.category}
              </h3>
            </div>

            {result.localRule && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h4 className="font-semibold text-blue-900 text-lg mb-1">📍 Local Recycling Rules</h4>
                <p className="text-blue-800">{result.localRule}</p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Trash2 className="w-6 h-6 text-gray-700 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">Disposal</h4>
                  <p className="text-gray-700">{result.disposal}</p>
                </div>
              </div>
            </div>

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