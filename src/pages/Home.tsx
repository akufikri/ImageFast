import UploadImage from "../components/UploadImage";
import {
  Zap,
  Shield,
  Smartphone,
  Palette,
  Crop,
  RotateCw,
  Sun,
  Download,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <div className="pt-10 min-h-screen w-full">
        {/* Hero Section */}
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-4xl font-semibold text-black mb-3">
              ImageFast
            </h1>

            <p className="text-base md:text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              Fast, simple and powerful image editing tools — resize, crop,
              rotate, enhance and convert images instantly.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                "No watermark",
                "Original quality preserved",
                "100% free",
                "Secure processing",
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 text-xs md:text-sm text-gray-600"
                >
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Section */}
          <div className="mb-14 flex items-center justify-center">
            <UploadImage />
          </div>

          {/* Key Features (simplified, no card heavy UI) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Optimized real-time processing",
              },
              {
                icon: Shield,
                title: "Privacy First",
                desc: "Processed locally, never stored",
              },
              {
                icon: Smartphone,
                title: "Mobile Friendly",
                desc: "Smooth on any device",
              },
              {
                icon: Palette,
                title: "Multiple Formats",
                desc: "Supports JPG, PNG, WebP & more",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-white/70 hover:bg-white transition border border-gray-400 cursor-pointer"
              >
                <f.icon className="w-6 h-6 mb-3 text-black" />
                <h3 className="font-medium text-base text-black mb-1">
                  {f.title}
                </h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Tools Section */}
          <h2 className="text-xl md:text-2xl font-semibold text-center mb-10 text-black">
            Editing Tools
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {[
              {
                icon: Crop,
                title: "Resize Images",
                desc: "Resize to any dimensions",
                tags: ["Custom size", "Presets"],
              },
              {
                icon: RotateCw,
                title: "Rotate & Flip",
                desc: "Rotate or flip images",
                tags: ["Rotate", "Flip"],
              },
              {
                icon: Palette,
                title: "Filters",
                desc: "Apply filters & effects",
                tags: ["Brightness", "Contrast"],
              },
              {
                icon: Sun,
                title: "Adjust",
                desc: "Tune brightness & colors",
                tags: ["Exposure", "Vibrance"],
              },
              {
                icon: Crop,
                title: "Crop",
                desc: "Cut to any aspect ratio",
                tags: ["16:9", "1:1"],
              },
              {
                icon: Download,
                title: "Format Convert",
                desc: "Convert image formats",
                tags: ["JPG→PNG", "Optimize"],
              },
            ].map((tool, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-white hover:shadow-md transition cursor-pointer border border-gray-400"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 flex items-center justify-center rounded-md bg-black text-white">
                    <tool.icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium text-base">{tool.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-2">{tool.desc}</p>

                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag, t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="rounded-2xl p-8 mb-20 bg-black text-white">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              {[
                ["10M+", "Images Processed"],
                ["500K+", "Users"],
                ["99.9%", "Uptime"],
              ].map(([num, label], i) => (
                <div key={i}>
                  <div className="text-2xl md:text-3xl font-bold">{num}</div>
                  <div className="text-gray-300 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
