import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import {
  Crop,
  Palette,
  Sun,
  Image as ImageIcon,
  Zap,
  SlidersHorizontal,
  Type,
  Sparkles,
  RotateCw,
  FlipHorizontal,
} from "lucide-react";

import EditorHeader from "../components/layout/EditorHeader";
import EditorSidebar from "../components/layout/EditorSidebar";
import EditorToolsPanel from "../components/editor/EditorToolsPanel";
import ImageCanvas from "../components/editor/ImageCanvas";
import SidebarGallery from "../components/editor/SidebarGallery";

interface UploadedImage {
  file: File;
  url: string;
  name: string;
  size: number;
  type: string;
}

interface GalleryImage {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  comingSoon?: boolean;
}

interface CropperInstance {
  destroy(): void;
  rotate(degree: number): void;
  scaleX(value: number): void;
  scaleY(value: number): void;
  getImageData(): {
    scaleX: number;
    scaleY: number;
  };
  getCroppedCanvas(): HTMLCanvasElement | null;
  setAspectRatio(aspectRatio: number | undefined): void;
  reset(): void;
}

export default function Editor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string>("editor");
  const [activeEditorTool, setActiveEditorTool] = useState<string>("crop");
  const [galleryImage, setGalleryImage] = useState<GalleryImage | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<CropperInstance | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const tools: Tool[] = [
    {
      id: "upload",
      name: "Upload",
      icon: ImageIcon,
      description: "Upload new image",
    },
    {
      id: "editor",
      name: "Editor",
      icon: Crop,
      description: "Edit your image",
    },
    {
      id: "templates",
      name: "Templates",
      icon: SlidersHorizontal,
      description: "Social media templates",
      comingSoon: true,
    },
    {
      id: "filters",
      name: "Filters",
      icon: Palette,
      description: "Apply filters",
      comingSoon: true,
    },
    {
      id: "adjust",
      name: "Adjust",
      icon: Sun,
      description: "Brightness & contrast",
      comingSoon: true,
    },
    {
      id: "text",
      name: "Text",
      icon: Type,
      description: "Add text",
      comingSoon: true,
    },
    {
      id: "effects",
      name: "Effects",
      icon: Sparkles,
      description: "Special effects",
      comingSoon: true,
    },
  ];

  // Sub-tools for Editor
  const editorTools = [
    { id: "crop", name: "Crop", icon: Crop },
    { id: "rotate", name: "Rotate", icon: RotateCw },
    { id: "flip", name: "Flip", icon: FlipHorizontal },
    { id: "resize", name: "Resize", icon: SlidersHorizontal },
  ];

  const aspectRatios = [
    { name: "Free", value: NaN },
    { name: "1:1", value: 1 },
    { name: "16:9", value: 16 / 9 },
    { name: "4:3", value: 4 / 3 },
    { name: "3:2", value: 3 / 2 },
    { name: "9:16", value: 9 / 16 },
  ];

  useEffect(() => {
    if (location.state?.image) {
      setCurrentImage(location.state.image);
    }

    const savedImage = localStorage.getItem("editorImage");
    if (savedImage) {
      try {
        const imageData = JSON.parse(savedImage);
        if (!currentImage) {
          setCurrentImage(imageData);
        }
      } catch (error) {
        console.error("Error loading saved image:", error);
        localStorage.removeItem("editorImage");
      }
    }
  }, [location.state]);

  useEffect(() => {
    // Initialize or destroy cropper based on active tool and image
    if (
      activeTool === "editor" &&
      activeEditorTool === "crop" &&
      imageRef.current &&
      currentImage &&
      !isCropping
    ) {
      // Destroy existing cropper if any
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }

      // Initialize new cropper
      cropperRef.current = new Cropper(imageRef.current, {
        viewMode: 1,
        autoCropArea: 0.8,
        responsive: true,
        background: false,
        guides: true,
        center: true,
        highlight: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
      }) as CropperInstance;
      setIsCropping(true);
    } else if (
      (activeTool !== "editor" || activeEditorTool !== "crop") &&
      cropperRef.current
    ) {
      cropperRef.current.destroy();
      cropperRef.current = null;
      setIsCropping(false);
    }

    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
    };
  }, [activeTool, activeEditorTool, currentImage, isCropping]);

  const handleToolSelect = (toolId: string) => {
    if (tools.find((t) => t.id === toolId)?.comingSoon) return;

    setActiveTool(toolId);
  };

  const handleGalleryImageSelect = (selectedGalleryImage: GalleryImage) => {
    const image: UploadedImage = {
      file: selectedGalleryImage.file,
      url: selectedGalleryImage.url,
      name: selectedGalleryImage.name,
      size: selectedGalleryImage.size,
      type: selectedGalleryImage.type
    };
    setCurrentImage(image);
    setProcessedImage(null);
    setGalleryImage(selectedGalleryImage);
    localStorage.setItem("editorImage", JSON.stringify(image));
  };

  const handleEditorToolSelect = (toolId: string) => {
    setActiveEditorTool(toolId);
  };

  const handleCropAspectRatio = (ratio: number) => {
    if (!imageRef.current) return;

    // Destroy existing cropper if any
    if (cropperRef.current) {
      cropperRef.current.destroy();
      cropperRef.current = null;
    }

    // Create new cropper with aspect ratio
    cropperRef.current = new Cropper(imageRef.current, {
      aspectRatio: isNaN(ratio) ? undefined : ratio, // NaN for Free aspect ratio
      viewMode: 1,
      autoCropArea: 0.8,
      responsive: true,
      background: false,
      guides: true,
      center: true,
      highlight: true,
      cropBoxMovable: true,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: false,
    }) as CropperInstance;

    setIsCropping(true);
    setActiveTool("editor");
    setActiveEditorTool("crop");
  };

  const handleApplyCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current;
      const canvas = cropper.getCroppedCanvas();
      if (canvas) {
        const croppedImage = canvas.toDataURL();
        setProcessedImage(croppedImage);

        // Destroy cropper after applying
        cropperRef.current.destroy();
        cropperRef.current = null;
        setIsCropping(false);
      }
    }
  };

  const handleCancelCrop = () => {
    if (cropperRef.current) {
      cropperRef.current.destroy();
      cropperRef.current = null;
      setIsCropping(false);
    }
    setActiveTool("crop");
  };

  const handleRotateInCrop = (degree: number) => {
    // Initialize cropper if not already active
    if (!cropperRef.current && imageRef.current) {
      cropperRef.current = new Cropper(imageRef.current, {
        viewMode: 1,
        autoCropArea: 0.8,
        responsive: true,
        background: false,
        guides: true,
        center: true,
        highlight: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
      }) as CropperInstance;
      setIsCropping(true);
    }

    if (cropperRef.current) {
      cropperRef.current.rotate(degree);
    }
  };

  const handleFlipInCrop = (direction: "horizontal" | "vertical") => {
    // Initialize cropper if not already active
    if (!cropperRef.current && imageRef.current) {
      cropperRef.current = new Cropper(imageRef.current, {
        viewMode: 1,
        autoCropArea: 0.8,
        responsive: true,
        background: false,
        guides: true,
        center: true,
        highlight: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
      }) as CropperInstance;
      setIsCropping(true);
    }

    if (cropperRef.current) {
      const cropper = cropperRef.current;
      if (direction === "horizontal") {
        const imageData = cropper.getImageData();
        cropper.scaleX(imageData.scaleX === -1 ? 1 : -1);
      } else {
        const imageData = cropper.getImageData();
        cropper.scaleY(imageData.scaleY === -1 ? 1 : -1);
      }
    }
  };

  const handleDownload = () => {
    const imageUrl = processedImage || currentImage?.url;
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `edited_${currentImage?.name || "image"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGoBack = () => {
    localStorage.removeItem("editorImage");
    navigate("/");
  };

  const handleImageUpload = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const image: UploadedImage = {
        file,
        url: e.target?.result as string,
        name: file.name,
        size: file.size,
        type: file.type,
      };
      setCurrentImage(image);
      setProcessedImage(null);
      localStorage.setItem("editorImage", JSON.stringify(image));
    };
    reader.readAsDataURL(file);
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files?.[0]);
  };

  if (!currentImage) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ImageIcon className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              No Image Selected
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Upload an image to start editing
            </p>

            <label className="cursor-pointer group">
              <div className="bg-orange-500 text-white px-8 py-4 rounded-xl hover:bg-orange-600 transition-all duration-300 inline-flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <Zap className="w-6 h-6" />
                <span className="font-semibold text-lg">Choose Image</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageInputChange}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-4">
              Supports JPG, PNG, WebP and more
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex">
        <EditorSidebar
          tools={tools}
          activeTool={activeTool}
          onToolSelect={handleToolSelect}
          onGoBack={handleGoBack}
        />

        <div className="flex-1 ml-24 flex flex-col">
          <EditorHeader onGoBack={handleGoBack} />

          <div className="flex-1 flex">
            {activeTool === "upload" ? (
              <SidebarGallery
                onImageSelect={handleGalleryImageSelect}
                currentImage={galleryImage}
              />
            ) : (
              <EditorToolsPanel
                activeTool={activeTool}
                activeEditorTool={activeEditorTool}
                editorTools={editorTools}
                aspectRatios={aspectRatios}
                onEditorToolSelect={handleEditorToolSelect}
                onCropAspectRatio={handleCropAspectRatio}
                onRotateInCrop={handleRotateInCrop}
                onFlipInCrop={handleFlipInCrop}
              />
            )}

            <ImageCanvas
              currentImage={currentImage}
              processedImage={processedImage}
              imageRef={imageRef}
              isCropping={isCropping}
              onCancelCrop={handleCancelCrop}
              onApplyCrop={handleApplyCrop}
              onDownload={handleDownload}
            />
          </div>
        </div>

        {/* Hidden file input for direct file upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageInputChange}
          className="hidden"
          id="editor-upload"
        />
      </div>
    </>
  );
}
