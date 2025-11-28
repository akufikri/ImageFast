import { ArrowLeft } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  comingSoon?: boolean;
}

interface EditorSidebarProps {
  tools: Tool[];
  activeTool: string;
  onToolSelect: (toolId: string) => void;
  onGoBack: () => void;
}

export default function EditorSidebar({ tools, activeTool, onToolSelect, onGoBack }: EditorSidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-screen w-24 bg-white border-r border-gray-200 flex flex-col items-center py-6 z-50">
      <div className="mb-8">
        <button
          onClick={onGoBack}
          className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          title="Back to Home"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => onToolSelect(tool.id)}
              disabled={tool.comingSoon}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${
                activeTool === tool.id
                  ? "bg-orange-500 text-white shadow-lg"
                  : tool.comingSoon
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title={tool.description}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] mt-1 font-medium">
                {tool.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}