const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    contents: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: false
    }
  },
  {timestamps: true}
)

module.exports = mongoose.model("POST", PostSchema)