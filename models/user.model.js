import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String
    },
    followers: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    savedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    loops: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Loop"
        }
    ],
    story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story"
    },
    resetOtp:{
        type: String
    },
    otpExpires:{
        type: Date,
    },
    isOtpVerified: {
        type: Boolean,
        default: false      
    }
},{timestamps: true});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if(!this.isModified('password') )return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
// compare entered password with hashed password in the database
userSchema.methods.comparePassword  = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;

