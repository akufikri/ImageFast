import { useState, useRef } from "react";
import { ImageIcon, Search, Upload, X, Trash2, Plus } from "lucide-react";

interface GalleryImage {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

interface ImageGalleryProps {
  onImageSelect: (image: GalleryImage) => void;
  onClose: () => void;
}

export default function ImageGallery({ onImageSelect, onClose }: ImageGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load images from localStorage on mount
  useState(() => {
    try {
      const savedImages = localStorage.getItem("uploadedImages");
      if (savedImages) {
        const parsedImages = JSON.parse(savedImages);
        // Convert date strings back to Date objects
        const imagesWithDates = parsedImages.map((img: any) => ({
          ...img,
          uploadedAt: new Date(img.uploadedAt)
        }));
        setImages(imagesWithDates);
      }
    } catch (error) {
      console.error("Error loading saved images:", error);
    }
  });

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newImages: GalleryImage[] = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: GalleryImage = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            file,
            url: e.target?.result as string,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date()
          };
          newImages.push(newImage);

          if (newImages.length === files.length) {
            // All files processed, update state
            const updatedImages = [...images, ...newImages];
            setImages(updatedImages);
            // Save to localStorage
            localStorage.setItem("uploadedImages", JSON.stringify(updatedImages));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleImageUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDeleteImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    setImages(updatedImages);
    localStorage.setItem("uploadedImages", JSON.stringify(updatedImages));
  };

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Upload Images</h2>
                <p className="text-sm text-gray-600">Choose from your uploaded images or upload new ones</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Search and Upload */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <label className="cursor-pointer bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
              <Upload className="w-5 h-5" />
              <span className="font-medium">Upload Images</span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageInputChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredImages.length === 0 ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-orange-400 transition-colors"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? "No images found" : "No images uploaded yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Upload images to get started with editing"
                }
              </p>
              <label className="cursor-pointer bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Upload First Image
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageInputChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div key={image.id} className="relative group">
                  <div
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-gray-200 hover:border-orange-400 transition-colors"
                    onClick={() => {
                      onImageSelect(image);
                      onClose();
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Delete image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-lg">
                    <p className="text-white text-xs font-medium truncate">{image.name}</p>
                    <p className="text-white/80 text-xs">
                      {(image.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-600 text-center">
            {images.length} {images.length === 1 ? 'image' : 'images'} uploaded •
            Supports JPG, PNG, WebP and more formats
          </p>
        </div>
      </div>
    </div>
  );
}