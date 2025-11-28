import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="h-16 w-full border-b border-slate-200 sticky top-0 z-50 bg-white">
      <div className="flex items-center justify-between h-full max-w-[1080px] mx-auto px-4">
        
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <img src="/assets/images/icon.png" alt="Logo" className="w-10" />

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex items-center gap-4 font-medium text-sm">
            <li><Link to="/resizer" className="hover:underline">Resize</Link></li>
            <li><Link to="/remove/bg" className="hover:underline">Remove Bg</Link></li>
            <li><Link to="/hd/images" className="hover:underline">HD Images</Link></li>
            <li><Link to="/pricing" className="hover:underline">Pricing</Link></li>
          </ul>
        </div>

        {/* RIGHT BUTTONS (Desktop only) */}
        <div className="hidden md:flex items-center gap-3">
          <button className="btn btn-dash rounded-lg">Login</button>
          <button className="btn bg-gray-900 text-slate-50 hover:bg-gray-950 rounded-lg">
            Register
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4">
          <ul className="flex flex-col gap-4 font-medium text-base">
            <li><Link to="/resizer" onClick={() => setOpen(false)}>Resize</Link></li>
            <li><Link to="/remove/bg" onClick={() => setOpen(false)}>Remove Bg</Link></li>
            <li><Link to="/hd/images" onClick={() => setOpen(false)}>HD Images</Link></li>
            <li><Link to="/pricing" onClick={() => setOpen(false)}>Pricing</Link></li>
          </ul>

          <div className="flex flex-col gap-3 mt-4">
            <button className="btn btn-dash rounded-lg">Login</button>
            <button className="btn bg-gray-900 text-slate-50 hover:bg-gray-950 rounded-lg">
              Register
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
