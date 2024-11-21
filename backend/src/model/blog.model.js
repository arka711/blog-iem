const mongoose = require('mongoose');

//TODO: Modify this after user created
const BlogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,

    },
     description: String,
     content: String,
     coverImg: String,
     category: String,
     author: String,
     rating: Number,
     creatdAt: {
        type: Date,
        default: Date.now
     }
})

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;