import { X } from "lucide-react";

interface EditorHeaderProps {
  onGoBack: () => void;
}

export default function EditorHeader({ onGoBack }: EditorHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-900">Edit image</h1>
      <button
        onClick={onGoBack}
        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
      >
        <X className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
}