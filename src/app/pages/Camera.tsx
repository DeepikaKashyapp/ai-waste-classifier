import { useState, useRef, useEffect } from 'react';
import { Camera as CameraIcon, X, Loader2, Trash2, Recycle, FlipHorizontal } from 'lucide-react';
import { addPoints, getUserData } from '../utils/pointsSystem';

type CameraScreen = 'camera' | 'processing' | 'result';

interface ClassificationResult {
  category: string;
  disposal: string;
  reuse: string;
  imagePreview: string;
  localRule?: string;
}

export default function Camera() {
  const [cameraActive, setCameraActive] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<CameraScreen>('camera');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [userPoints, setUserPoints] = useState(getUserData().points);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup camera stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
        stopCamera();

        // Base64 image data ko actual file/blob mein convert karna API ko bhejne ke liye
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "capture.png", { type: "image/png" });
            classifyImage(file, imageData);
          }
        }, 'image/png');
      }
    }
  };

  // Real ML Model integration with Flask API Backend
  const classifyImage = async (imageFile: File, imagePreviewUrl: string) => {
    setCurrentScreen('processing');

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      // Python local server par hit karna
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Backend server failed to respond');
      }

      const data = await response.json();

      if (data.status === 'success' && data.predictions.length > 0) {
        // YOLO ne jo pehla object detect kiya use pick karo
        const detectedObject = data.predictions[0].toLowerCase();

        // Dynamic Waste Category Assignment Rule base mapping
        let category = 'General Waste';
        let disposal = 'Dispose of in the general landfills bin.';
        let reuse = 'Can it be upcycled or repaired? Try to find creative uses!';
        let localRule = 'Local Rule: Ensure general waste is tightly bagged before disposal.';

        // Custom triage for materials
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

        // Final layout result display content populate karna
        setResult({
          category: `${category} (${data.predictions[0]})`,
          disposal: disposal,
          reuse: reuse,
          imagePreview: imagePreviewUrl,
          localRule: localRule
        });

      } else {
        // Agar YOLO model ko waste item samajh nahi aaya
        setResult({
          category: 'Unclassified Item',
          disposal: 'Drop in the general waste bin if unsure.',
          reuse: 'Look at the item carefully; can it be repurposed instead of thrown away?',
          imagePreview: imagePreviewUrl,
          localRule: 'Local Rule: If an item cannot be detected, look up the material type locally before discarding.'
        });
      }

      setCurrentScreen('result');

      // Update points dynamically
      const updatedUser = addPoints();
      setUserPoints(updatedUser.points);

    } catch (error) {
      console.error('Error connecting to ML backend:', error);
      alert('Backend Server is not running! Make sure your Python terminal is active on port 5000.');
      setCurrentScreen('camera');
    }
  };

  const resetCamera = () => {
    setCurrentScreen('camera');
    setCapturedImage('');
    setResult(null);
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    if (cameraActive) {
      stopCamera();
      setTimeout(startCamera, 100);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Points Display */}
      <div className="mb-6 flex justify-end">
        <div className="bg-[#4CAF50] text-white px-4 py-2 rounded-full shadow-md">
          <span className="font-semibold">🏆 {userPoints} Points</span>
        </div>
      </div>

      {currentScreen === 'camera' && (
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Scan Waste Item
            </h2>
            <p className="text-lg text-gray-600">
              Use your camera to instantly classify waste items using Real YOLO AI
            </p>
          </div>

          <div className="relative bg-black rounded-xl overflow-hidden shadow-lg" style={{ aspectRatio: '3/4', maxHeight: '500px' }}>
            {!cameraActive && !capturedImage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-8">
                <CameraIcon className="w-24 h-24 mb-4 text-gray-400" />
                <p className="text-xl font-semibold mb-2">Camera Ready</p>
                <p className="text-gray-400 text-center mb-6">
                  Point your camera at a waste item to classify it
                </p>
                <button
                  onClick={startCamera}
                  className="px-6 py-3 bg-[#4CAF50] text-white font-semibold rounded-lg hover:bg-[#45a049] transition-all"
                >
                  Start Camera
                </button>
                <div className="mt-4 flex flex-col items-center justify-center w-full">
                  <p className="text-gray-400 mb-2">─ OR ─</p>
                  <label className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all cursor-pointer shadow-md text-center">
                    📁 Upload Image File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const previewUrl = URL.createObjectURL(file);
                          setCapturedImage(previewUrl);
                          classifyImage(file, previewUrl);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
            />

            <canvas ref={canvasRef} className="hidden" />

            {cameraActive && (
              <div className="absolute inset-0 flex flex-col">
                <div className="p-4 flex justify-between items-start">
                  <button
                    onClick={stopCamera}
                    className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={toggleCamera}
                    className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <FlipHorizontal className="w-6 h-6 text-white" />
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div className="w-48 h-48 border-4 border-[#4CAF50] rounded-lg relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
                  </div>
                </div>

                <div className="p-8 flex justify-center">
                  <button
                    onClick={capturePhoto}
                    className="w-16 h-16 bg-white rounded-full shadow-lg hover:scale-110 transition-transform relative"
                  >
                    <div className="absolute inset-2 bg-[#4CAF50] rounded-full" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-green-50 border-l-4 border-[#4CAF50] p-4 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">📸 Camera Tips</h3>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>• Position the waste item within the frame</li>
              <li>• Ensure good lighting for best results</li>
              <li>• Hold steady and tap capture when ready</li>
            </ul>
          </div>
        </div>
      )}

      {currentScreen === 'processing' && (
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Analyzing Image
            </h2>
          </div>

          {capturedImage && (
            <div className="flex justify-center">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-64 h-64 object-cover rounded-lg shadow-md opacity-60"
              />
            </div>
          )}

          <div className="flex items-center justify-center gap-3 text-orange-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-lg font-medium">
              ⏳ Running real-time object detection via Python YOLOv8 model... please wait.
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
              Scan Complete!
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
              onClick={resetCamera}
              className="px-8 py-4 bg-[#4CAF50] text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-[#45a049] transition-all transform hover:scale-105"
            >
              Scan Another Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
