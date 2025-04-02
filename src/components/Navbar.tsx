import { useState } from "react";
import { Link } from "react-router";
import { LogIn, LogOut, MenuIcon, XIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithGithub, signOut, user } = useAuth();

  const displayName = user?.user_metadata.user_name || user?.email;
  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 relative flex justify-between items-center">
        <div className="flex justify-between items-center h-16">
          <Link to={"/"} className="font-mono text-xl font-bold text-white">
            social<span className="text-purple-500">.media</span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to={"/"}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            to={"/create"}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Create Post
          </Link>
          <Link
            to={"/communities"}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Communities
          </Link>
          <Link
            to={"/community/create"}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Create Community
          </Link>
        </div>

        <div className="hidden md:flex items-center">
          {user ? (
            <div className="flex items-center space-x-4">
              {user.user_metadata.avatar_url && (
                <img
                  className="h-6 w-6 rounded-full"
                  src={user.user_metadata.avatar_url}
                  alt="avatar"
                />
              )}
              <span className="font-mono">{displayName}</span>
              <button
                className="bg-red-500 px-3 py-1 rounded cursor-pointer hover:bg-red-700"
                onClick={signOut}
              >
                <LogOut />
              </button>
            </div>
          ) : (
            <button
              className="bg-blue-500 px-3 py-1 rounded"
              onClick={signInWithGithub}
            >
              <LogIn />
            </button>
          )}
        </div>

        {/* Mobile Menu Btn */}
        <div className="md:hidden relative">
          <button
            className="text-gray-300 focus:outline-none"
            aria-label="Toggle Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {!menuOpen ? <MenuIcon size={24} /> : <XIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className={`md:hidden absolute top-16 flex flex-col justify-between w-full h-[925px] bg-gray-900 z-50 transform ${
            menuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          } transition-all duration-300 ease-in-out`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to={"/"}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-gray-700"
            >
              Home
            </Link>
            <Link
              to={"/create"}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
            >
              Create Post
            </Link>
            <Link
              to={"/communities"}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
            >
              Communities
            </Link>
            <Link
              to={"/community/create"}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
            >
              Create Community
            </Link>
          </div>
          <div className=" md:flex items-center px-3 py-2">
            {user ? (
              <div className="flex items-center justify-between space-x-4">
                <div className="flex gap-2">
                  {user.user_metadata.avatar_url && (
                    <img
                      className="h-6 w-6 rounded-full"
                      src={user.user_metadata.avatar_url}
                      alt="avatar"
                    />
                  )}
                  <span className="font-mono">{displayName}</span>
                </div>
                <button
                  className="bg-red-500 px-3 py-1 rounded"
                  onClick={signOut}
                >
                  <LogOut />
                </button>
              </div>
            ) : (
              <button
                className="bg-blue-500 px-3 py-1 rounded"
                onClick={signInWithGithub}
              >
                <LogIn />
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
