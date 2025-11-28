import { type LegacyRef } from "react";
import { Download } from "lucide-react";

interface UploadedImage {
  file: File;
  url: string;
  name: string;
  size: number;
  type: string;
}

interface ImageCanvasProps {
  currentImage: UploadedImage | null;
  processedImage: string | null;
  imageRef: LegacyRef<HTMLImageElement>;
  isCropping: boolean;
  onCancelCrop: () => void;
  onApplyCrop: () => void;
  onDownload: () => void;
}

export default function ImageCanvas({
  currentImage,
  processedImage,
  imageRef,
  isCropping,
  onCancelCrop,
  onApplyCrop,
  onDownload
}: ImageCanvasProps) {
  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            ref={imageRef}
            src={
              processedImage ||
              currentImage?.url ||
              "/placeholder-image.jpg"
            }
            alt={currentImage?.name || "Preview"}
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="font-medium">{currentImage?.name || "No image"}</span>
          <span className="text-gray-400">•</span>
          <span>{currentImage ? (currentImage.size / 1024 / 1024).toFixed(2) : "0"} MB</span>
        </div>

        <div className="flex items-center gap-3">
          {isCropping && (
            <>
              <button
                onClick={onCancelCrop}
                className="px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={onApplyCrop}
                className="px-6 py-2.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all text-sm font-medium shadow-md"
              >
                Apply
              </button>
            </>
          )}
          {!isCropping && (
            <button
              onClick={onDownload}
              className="px-6 py-2.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all text-sm font-medium shadow-md flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
}