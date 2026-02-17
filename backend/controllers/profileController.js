const User = require("../models/User");

const profileController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({
        message: "Error fetching profile",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const userId = req.user?.id;
      const { fullName } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Validate input
      if (!fullName || !fullName.trim()) {
        return res.status(400).json({ message: "Full name is required" });
      }

      // Check if name length is valid
      if (fullName.trim().length < 2 || fullName.trim().length > 100) {
        return res.status(400).json({ message: "Name must be between 2 and 100 characters" });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { fullName: fullName.trim() },
        { new: true, runValidators: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({
        message: "Error updating profile",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  }
};

module.exports = profileController;
