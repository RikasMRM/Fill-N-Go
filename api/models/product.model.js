const mongoose = require('mongoose')

const shedSchema = mongoose.Schema(
  {
    Name: {
        type: String,
        required: true,
    },
    FuelArTime: {
        type: String,
        required: true,
    },
    FuelFhTime: {
      type: String,
      required: true,
    },
    FuelType: {
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
    Quantity: {
        type: String,
        required: true,
    },
 
    District: [
        {
          type: mongoose.Schema.Types.ObjectId,
          trim: true,
          ref: "District",
        },
    ],
    isAvailable:{
      type: Boolean,
      required: true,
    }
  },
  {
    timestamps: false,
    versionKey: false,
  }
)

const Shed = mongoose.model('Shed', shedSchema)

module.exports = Shed;