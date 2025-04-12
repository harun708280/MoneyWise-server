import User from "../models/User.js"


// ✅ User Create or Update (POST)
export const createUser = async (req, res) => {
  try {
      const {clerkId, username, email, photo  } = req.body; // Extract data from req.body

      let user = await User.findOne({ email });

      if (user) {
          return res.status(200).json({ message: "User already exists" });
      }

      user = new User({  username, email, photo });
      await user.save();

      return res.status(201).json({ message: "User saved successfully!", user });
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
};


// ✅ Get Single User by Clerk ID (GET)
export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        console.log("Fetching user with email:", email); 

       
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ✅ Delete User by Clerk ID (DELETE)
export const deleteUser = async (email) => {
  try {
   
    const user = await User.findOneAndDelete({ email });
    if (!user) return { status: 404, error: "User not found" };
    return { status: 200, data: "User deleted successfully" };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};
