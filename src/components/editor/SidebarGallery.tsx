import { useState, useEffect, useRef } from "react";
import { Search, Upload, Plus, Trash2, Image as ImageIcon } from "lucide-react";

interface GalleryImage {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

interface SidebarGalleryProps {
  onImageSelect: (image: GalleryImage) => void;
  currentImage: GalleryImage | null;
}

export default function SidebarGallery({ onImageSelect, currentImage }: SidebarGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load images from localStorage on mount
  useEffect(() => {
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
  }, []);

  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Take only the first file
    const file = files[0];
    if (!file.type.startsWith("image/")) return;

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

      // Update state with single image
      const updatedImages = [...images, newImage];
      setImages(updatedImages);
      // Save to localStorage
      localStorage.setItem("uploadedImages", JSON.stringify(updatedImages));
    };
    reader.readAsDataURL(file);
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
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Upload</h3>
            <p className="text-sm text-gray-600">Choose an image to edit</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Upload Button */}
        <label className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm font-medium">
          <Upload className="w-4 h-4" />
          Upload Image
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageInputChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Image Gallery */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredImages.length === 0 ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors"
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              {searchQuery ? "No images found" : "No images yet"}
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              {searchQuery
                ? "Try adjusting your search"
                : "Drag images here or upload to get started"
              }
            </p>
            <label className="cursor-pointer bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-xs hover:bg-gray-200 transition-colors inline-flex items-center gap-1">
              <Plus className="w-3 h-3" />
              Upload First Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageInputChange}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredImages.map((image) => (
              <div key={image.id} className="relative group">
                <div
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    currentImage?.id === image.id
                      ? "border-orange-500 shadow-md"
                      : "border-gray-200 hover:border-orange-400"
                  }`}
                  onClick={() => onImageSelect(image)}
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
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Delete image"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 rounded-b-lg">
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
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 text-center">
          {images.length} {images.length === 1 ? 'image' : 'images'} •
          Supports JPG, PNG, WebP
        </p>
      </div>
    </div>
  );
}