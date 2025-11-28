import { RotateCw, FlipHorizontal, RotateCcw, FlipVertical } from "lucide-react";

interface EditorTool {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AspectRatio {
  name: string;
  value: number;
}

interface EditorToolsPanelProps {
  activeTool: string;
  activeEditorTool: string;
  editorTools: EditorTool[];
  aspectRatios: AspectRatio[];
  onEditorToolSelect: (toolId: string) => void;
  onCropAspectRatio: (ratio: number) => void;
  onRotateInCrop: (degree: number) => void;
  onFlipInCrop: (direction: "horizontal" | "vertical") => void;
}

export default function EditorToolsPanel({
  activeTool,
  activeEditorTool,
  editorTools,
  aspectRatios,
  onEditorToolSelect,
  onCropAspectRatio,
  onRotateInCrop,
  onFlipInCrop
}: EditorToolsPanelProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6">
      {activeTool === "editor" && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Editor
          </h3>

          {/* Editor Tool Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {editorTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => onEditorToolSelect(tool.id)}
                  className={`px-3 py-2.5 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2 ${
                    activeEditorTool === tool.id
                      ? "bg-orange-500 text-white shadow-md"
                      : "border border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tool.name}
                </button>
              );
            })}
          </div>

          {/* Tool-specific content */}
          {activeEditorTool === "crop" && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Aspect ratio
              </h4>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.name}
                    onClick={() => onCropAspectRatio(ratio.value)}
                    className="px-3 py-2 text-center border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all text-sm font-medium text-gray-700 hover:text-orange-600"
                  >
                    {ratio.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeEditorTool === "rotate" && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Rotate
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => onRotateInCrop(-90)}
                  className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all text-sm font-medium flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-xs">Left 90°</span>
                </button>
                <button
                  onClick={() => onRotateInCrop(90)}
                  className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all text-sm font-medium flex items-center justify-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  <span className="text-xs">Right 90°</span>
                </button>
              </div>
            </div>
          )}

          {activeEditorTool === "flip" && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Flip
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => onFlipInCrop("horizontal")}
                  className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FlipHorizontal className="w-4 h-4" />
                  <span className="text-xs">Horizontal</span>
                </button>
                <button
                  onClick={() => onFlipInCrop("vertical")}
                  className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FlipVertical className="w-4 h-4" />
                  <span className="text-xs">Vertical</span>
                </button>
              </div>
            </div>
          )}

          {activeEditorTool === "resize" && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Resize Presets
              </h4>
              <div className="space-y-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.name}
                    onClick={() => onCropAspectRatio(ratio.value)}
                    className="w-full px-4 py-2.5 text-left border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all text-sm font-medium text-gray-700"
                  >
                    {ratio.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}