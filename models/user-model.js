
const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    friends: {
        type: Array,
        default: [],
    },
    contact: Number,
    picture: String,
})

module.exports = mongoose.model("user", userSchema)