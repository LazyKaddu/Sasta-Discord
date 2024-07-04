const ownerSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    products: {
        type: Array,
        default: [],
    },
    picture: String,
})

module.exports = mongoose.model("owner", ownerSchema)