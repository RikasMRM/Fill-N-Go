const mongoose = require('mongoose')

const districtSchema = new mongoose.Schema(
  {
    District: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    cloudinary_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
)

const District = mongoose.model('District', districtSchema)

module.exports = District;