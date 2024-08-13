const { User } = require("../models");
const { signToken } = require("../utils/auth");

module.exports = {
  // Get a single user by id or username
  async getSingleUser({ user = null, params }, res) {
    try {
      const foundUser = await User.findOne({
        $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
      })
        .select("-__v")
        .populate("cardio")
        .populate("resistance");

      if (!foundUser) {
        return res.status(404).json({ message: 'Cannot find a user with this id!' });
      }

      res.json(foundUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  },

  // Create a user, sign a token, and send it back to the sign-up page
  async createUser({ body }, res) {
    try {
      // Check if username or email already exists
      const existingUser = await User.findOne({
        $or: [{ username: body.username }, { email: body.email }],
      });

      if (existingUser) {
        return res.status(409).json({ message: "Username or email already exists." });
      }

      const user = await User.create(body);

      if (!user) {
        return res.status(400).json({ message: "Failed to create user." });
      }

      const token = signToken(user);
      res.json({ token, user });
    } catch (error) {
      // Handle validation errors
      if (error.name === "ValidationError") {
        let message = "Validation failed: ";

        // Customize the error message based on the specific field
        if (error.errors.password) {
          message += "Password must be at least 6 characters long.";
        } else if (error.errors.email) {
          message += "Invalid email format.";
        } else if (error.errors.username) {
          message += "Username is required.";
        } else {
          message += "Please check the input fields.";
        }

        return res.status(400).json({ message });
      }

      // Handle duplicate key errors
      if (error.code === 11000) {
        return res.status(409).json({ message: "Username or email already exists." });
      }

      console.error(error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  },

  // Login a user, sign a token, and send it back to the login page
  async login({ body }, res) {
    try {
      const user = await User.findOne({
        $or: [{ username: body.username }, { email: body.email }],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const correctPw = await user.isCorrectPassword(body.password);

      if (!correctPw) {
        return res.status(401).json({ message: "Incorrect password." });
      }

      const token = signToken(user);
      res.json({ token, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  },
};
