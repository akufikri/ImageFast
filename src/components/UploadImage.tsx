import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X } from "lucide-react";

interface UploadImageProps {
  onFileSelect?: (files: File[]) => void;
  maxFileSize?: number; // in MB
  maxFiles?: number;
  acceptedTypes?: string[];
}

const UploadImage = ({
  onFileSelect,
  maxFileSize = 10,
  maxFiles = 1,
  acceptedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ],
}: UploadImageProps) => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const validateFiles = useCallback(
    (files: FileList | null): File[] => {
      if (!files) return [];

      const validFiles: File[] = [];
      const errors: string[] = [];

      Array.from(files).forEach((file) => {
        // Check file type
        if (!acceptedTypes.includes(file.type)) {
          errors.push(`${file.name} is not a valid image format`);
          return;
        }

        // Check file size
        if (file.size > maxFileSize * 1024 * 1024) {
          errors.push(`${file.name} exceeds ${maxFileSize}MB limit`);
          return;
        }

        validFiles.push(file);
      });

      // Check max files limit
      if (selectedFiles.length + validFiles.length > maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        return [];
      }

      if (errors.length > 0) {
        setError(errors.join(", "));
        return [];
      }

      setError("");
      return validFiles;
    },
    [acceptedTypes, maxFileSize, maxFiles, selectedFiles.length]
  );

  const createPreviews = useCallback((files: File[]) => {
    const promises = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((urls) => {
      setPreviewUrls((prev) => [...prev, ...urls]);
    });
  }, []);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
        // For single file upload, redirect directly to editor
        if (validFiles.length === 1) {
          const file = validFiles[0];
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageData = {
              file,
              url: e.target?.result as string,
              name: file.name,
              size: file.size,
              type: file.type,
            };

            // Navigate to editor with image data
            navigate("/editor", { state: { image: imageData } });
          };
          reader.readAsDataURL(file);
        } else {
          // For multiple files, show previews and call original handler
          const newFiles = [...selectedFiles, ...validFiles];
          setSelectedFiles(newFiles);
          createPreviews(validFiles);
          onFileSelect?.(newFiles);
        }
      }
    },
    [selectedFiles, validateFiles, createPreviews, onFileSelect, navigate]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      const newPreviews = previewUrls.filter((_, i) => i !== index);
      setSelectedFiles(newFiles);
      setPreviewUrls(newPreviews);
      onFileSelect?.(newFiles);
    },
    [selectedFiles, previewUrls, onFileSelect]
  );

  return (
    <div className="w-full max-w-2xl">
      {/* Upload Area */}
      <div
        className={`card card-border border-2 border-dashed rounded-2xl bg-slate-50 shadow h-[200px] w-full transition-colors duration-200 cursor-pointer
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <div className="card-body flex flex-col items-center justify-center h-full">
          <Upload className="w-12 h-12 text-gray-400 mb-3" />
          <span className="font-semibold text-gray-700 mb-1">
            {isDragging
              ? "Drop images here"
              : "Click to upload or drag and drop"}
          </span>
          <span className="text-sm text-gray-500">
            PNG, JPG, GIF, WebP up to {maxFileSize}MB
          </span>
          <span className="text-sm text-gray-500">
            Max {maxFiles} file{maxFiles > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        id="file-input"
        type="file"
        multiple={maxFiles > 1}
        accept={acceptedTypes.join(",")}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Preview Area */}
      {previewUrls.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Selected Images ({previewUrls.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                  {selectedFiles[index]?.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
