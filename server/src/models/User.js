import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      default: "",
      validate: {
        validator(value) {
          if (!value) return true;
          return /^\+?[0-9]{7,15}$/.test(value);
        },
        message: "Phone number must be 7-15 digits and may start with +",
      },
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    headline: {
      type: String,
      default: "",
      maxlength: 180,
      trim: true,
    },
    location: {
      type: String,
      default: "",
      maxlength: 120,
      trim: true,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 2000,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "editor"],
      default: "editor",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password") || !this.password) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(inputPassword) {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
