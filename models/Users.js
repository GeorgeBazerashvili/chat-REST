const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide username"],
    unique: [true, "Username already exists"],
    minLength: [4, "Name's too short"],
    maxLength: [20, "Name's too long"],
    validate: {
      validator: async function (value) {
        const name = await this.constructor.findOne({ username: value });
        return !name;
      },
      message: "Username already exists",
    },
  },
  email: {
    type: String,
    required: [true, "Please provide email address"],
    unique: [true, "Email address already in use"],
    minLength: [10, "Email's too short"],
    maxLength: [40, "Email's too long"],
    validate: {
      validator: async function (value) {
        const email = await this.constructor.findOne({ email: value });
        return !email;
      },
      message: "Email address already in use",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: [6, "Email's too short"],
    maxLength: [20, "Email's too long"],
    validate: {
      validator: async function (value) {
        if (/[A-Z]/.test(value) && /[0-9]/.test(value)) {
          return true;
        }
        return false;
      },
      message: "Password must include uppercase characters and numbers",
    },
  },
  role: {
    type: String,
    default: "USER",
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
  next();
});

module.exports = new mongoose.model("User", UserSchema);
