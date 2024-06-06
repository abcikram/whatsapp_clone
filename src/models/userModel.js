import mongoose from 'mongoose'
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true,"Please provide your name"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email address"],
        unique: [true, 'This email address already exist'],
        lowercase: true,
        validate: [validator.isEmail,"please provide a valid email address"]
    },
    picture:{
        type: String,
        default:'https://www.vecteezy.com/free-vector/default-profile-picture'
    },
    status: {
        type: String,
        default:"Hey there ! I am usign whatsapp"
    },
    password: {
        type: String,
        required: true,
        minLength: [
            6,
           "Please make sure your password is atleast 6 characters long" 
        ],
        maxLength: [
            128,
            "Please make sure your password is less than 128 characters long"
        ]
    }
}, {
    collection: "users",
    timestamps:true
})

// pre => before , userschema 'save'
userSchema.pre("save", async function (next) {
try {
    if (this.isNew) {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
    }
    next();
} catch (error) {
    next(error);
}
});

const UserModel = mongoose.models.UserModel || mongoose.model("UserModel", userSchema)

export default UserModel


// this.isNew :- is a property of the document being saved.It is true if the document is being created for the first time.This check ensures that the password hashing logic runs only for new documents(i.e., when a new user is being created) and not for updates to existing documents.

// Saving the Hashed Password:
// this.password = hashedPassword;

// The user's password is replaced with the hashed version, ensuring that the actual password is never stored in plain text.
// Calling Next Middleware:
// next();

// next is called to pass control to the next middleware function in the stack.If an error occurs, it is passed to the next middleware by calling next(error).


// userSchema.pre("save", async function (next) { ... })

// The pre method defines a pre - save middleware.This means the function provided will be executed before the save operation.