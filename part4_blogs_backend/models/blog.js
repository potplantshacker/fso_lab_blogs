const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true
  },
  likes:
  {
    type: Number,
    default: 0
  },
  likedBy: {
     type: Array,
     "default": []
  },
  // user: String
  user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})



module.exports = mongoose.model('Blog', blogSchema)
