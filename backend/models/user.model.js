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
    }
},{timestamps: true});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if(!this.isModified('password') )return next();
    
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model("User", userSchema);

export default User;

