# whatsapp_clone


## Middleware Hook:
userSchema.pre("save", async function (next) { ... })

The pre method defines a pre-save middleware. This means the function provided will be executed before the save operation.
Asynchronous Function:
async function (next) { ... }

The middleware function is asynchronous, allowing the use of await for asynchronous operations within it.
Checking if Document is New:
if (this.isNew) { ... }

this.isNew is a property of the document being saved. It is true if the document is being created for the first time. This check ensures that the password hashing logic runs only for new documents (i.e., when a new user is being created) and not for updates to existing documents.
Generating Salt:
const salt = await bcrypt.genSalt(12);

bcrypt.genSalt(12) generates a salt for hashing the password. The number 12 is the salt rounds (cost factor), determining the complexity of the hashing process. Higher values are more secure but slower.
Hashing the Password:
const hashedPassword = await bcrypt.hash(this.password, salt);

bcrypt.hash(this.password, salt) hashes the user's password using the generated salt. this.password refers to the password provided by the user.
Saving the Hashed Password:
this.password = hashedPassword;

The user's password is replaced with the hashed version, ensuring that the actual password is never stored in plain text.
Calling Next Middleware:
next();

next is called to pass control to the next middleware function in the stack. If an error occurs, it is passed to the next middleware by calling next(error).