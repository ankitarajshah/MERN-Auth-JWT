import userModel from "../models/userModel.js";

export const getUsersData = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized. Login again." });
    }
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
      message: "user",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
