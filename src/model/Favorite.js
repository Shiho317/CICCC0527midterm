const mongoose = require('mongoose')

const FavouriteSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true
    },
    user: {
      type: String,
      required: true
    }
  }
)

module.exports = mongoose.model("Favorite", FavouriteSchema)