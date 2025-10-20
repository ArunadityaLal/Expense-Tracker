import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ProfileModal from "../modals/ProfileModal";
import SettingsModal from "../modals/SettingsModal";

const ProfileDropdown = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const dropdownRef = useRef(null);

  // Get user profile data
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const profileImage = user?.user_metadata?.profile_image || null;
  const firstLetter = displayName.charAt(0).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Profile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 transition-all duration-200 group"
        >
          {/* Profile Image or Initial */}
          <div className="relative">
            {profileImage ? (
              <img
                src={profileImage}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover border-2 border-white/30 group-hover:border-white/50 transition-all duration-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center border-2 border-white/30 group-hover:border-white/50 transition-all duration-200">
                <span className="text-white font-bold text-sm">{firstLetter}</span>
              </div>
            )}
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </div>

          {/* Name and Arrow */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-white font-medium text-sm max-w-[120px] truncate">
              {displayName}
            </span>
            <ChevronDown 
              className={`w-4 h-4 text-white/80 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Info Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={displayName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/50">
                    <span className="text-white font-bold">{firstLetter}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{displayName}</div>
                  <div className="text-xs text-white/80 truncate">{user?.email}</div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {/* Profile Option */}
              <button
                onClick={() => {
                  setShowProfileModal(true);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900">Profile</div>
                  <div className="text-xs text-gray-500">View and edit your profile</div>
                </div>
              </button>

              {/* Settings Option */}
              <button
                onClick={() => {
                  setShowSettingsModal(true);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900">Settings</div>
                  <div className="text-xs text-gray-500">Account settings</div>
                </div>
              </button>

              {/* Divider */}
              <div className="h-px bg-gray-200 my-2"></div>

              {/* Quick Logout (also in settings) */}
              <div className="px-4 py-2">
                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  Quick Actions
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </>
  );
};

export default ProfileDropdown;