import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiSave, FiX, FiCheck } from "react-icons/fi";
import { MdOutlineEmail, MdAccessTime } from "react-icons/md";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import cookieManager from "../../utils/cookieManager";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/UserContext";

/* ================= PROFILE CONTENT (OUTSIDE) ================= */

const ProfileContent = React.memo(({
  loading,
  user,
  success,
  error,
  isEditing,
  fullName,
  setFullName,
  inputRef,
  handleSave,
  handleCancel,
  setIsEditing,
  isSaving
}) => {

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block animate-spin h-12 w-12 sm:h-16 sm:w-16 border-4 border-gray-200 border-t-indigo-600 rounded-full"></div>
          <p className="mt-6 text-gray-600 font-medium text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          
          {/* Header with Gradient */}
          <div className="relative h-32 sm:h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
            <div className="absolute inset-0 opacity-10 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-4 sm:px-8 lg:px-10 pt-16 sm:pt-20 pb-8 sm:pb-10 relative">
            
            {/* Avatar - Positioned absolutely above */}
            <div className="flex justify-center absolute -top-14 sm:-top-16 left-0 right-0 z-10">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-5xl sm:text-6xl font-bold rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white ring-4 ring-blue-200">
                {user.fullName?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {user.fullName}
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">Account Settings</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fade-in">
                <div className="flex-shrink-0 text-green-600">
                  <FiCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="font-medium text-green-800 text-sm sm:text-base">{success}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-fade-in">
                <div className="flex-shrink-0 text-red-600">
                  <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="font-medium text-red-800 text-sm sm:text-base">{error}</p>
                </div>
              </div>
            )}

            {/* Fields Grid */}
            <div className="space-y-6 mb-8">
              
              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base sm:text-lg font-medium"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="px-4 py-3 sm:py-4 bg-gray-50 rounded-lg border border-gray-200 text-base sm:text-lg font-medium text-gray-900">
                    {user.fullName}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <MdOutlineEmail className="w-5 h-5" />
                  Email Address
                </label>
                <div className="px-4 py-3 sm:py-4 bg-gray-50 rounded-lg border border-gray-200 text-base sm:text-lg text-gray-900 break-all">
                  {user.email}
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">Email cannot be changed</p>
              </div>

              {/* Member Since Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <MdAccessTime className="w-5 h-5" />
                  Member Since
                </label>
                <div className="px-4 py-3 sm:py-4 bg-gray-50 rounded-lg border border-gray-200 text-base sm:text-lg text-gray-900">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })
                    : "N/A"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-base sm:text-lg hover:scale-105 active:scale-95"
                >
                  <FiEdit2 className="w-5 h-5" /> Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 px-6 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  >
                    <FiSave className="w-5 h-5" />
                    <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save Changes"}</span>
                    <span className="sm:hidden">{isSaving ? "Saving..." : "Save"}</span>
                  </button>

                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1 px-6 py-3 sm:py-4 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  >
                    <FiX className="w-5 h-5" />
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

/* ================= MAIN PROFILE ================= */

const Profile = () => {
  useUserAuth();
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const inputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* FETCH PROFILE */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.USER.GET_PROFILE);

        if (res.data.user) {
          setUser(res.data.user);
          setFullName(res.data.user.fullName);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          cookieManager.delete("token");
          navigate("/login");
        } else setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  /* AUTO FOCUS */
  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [isEditing]);

  /* SAVE */
  const handleSave = async () => {
    if (fullName.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const res = await axiosInstance.put(API_PATHS.USER.UPDATE_PROFILE, {
        fullName: fullName.trim()
      });

      if (res.data.user) {
        setUser(res.data.user);
        // Update global context so SideMenu and other components reflect the change
        updateUser({ user: res.data.user });
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(user?.fullName || "");
    setIsEditing(false);
    setError("");
  };

  return (
    <DashboardLayout activeMenu="Profile">
      <ProfileContent
        loading={loading}
        user={user}
        success={success}
        error={error}
        isEditing={isEditing}
        fullName={fullName}
        setFullName={setFullName}
        inputRef={inputRef}
        handleSave={handleSave}
        handleCancel={handleCancel}
        setIsEditing={setIsEditing}
        isSaving={isSaving}
      />
    </DashboardLayout>
  );
};

export default Profile;
