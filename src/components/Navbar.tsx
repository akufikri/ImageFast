import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <nav className="h-16 w-full border-b border-slate-200 sticky top-0 z-50 bg-white">
        <div className="flex items-center justify-between h-full max-w-[1080px] mx-auto">
          <div className="flex items-center gap-4">
            <div>
              <img src="/assets/images/icon.png" alt="Logo" className="w-10" />
            </div>
            <ul className="flex items-center gap-3 font-medium text-sm">
              <li>
                <Link to={"/resizer"} className="hover:underline">
                  Resize
                </Link>
              </li>
              <li>
                <Link to={"/remove/bg"} className="hover:underline">
                  Remove Bg
                </Link>
              </li>
              <li>
                <Link to={"/hd/images"} className="hover:underline">
                  Hd Images
                </Link>
              </li>
              <li>
                <Link to={"/hd/images"} className="hover:underline">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-dash rounded-lg">Login</button>
            <button className="btn bg-gray-900 text-slate-50 hover:bg-gray-950 rounded-lg">
              Register
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
