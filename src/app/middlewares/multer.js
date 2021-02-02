const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/public/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now().toString()}-${file.originalname}`)
  }
})

const fileFilter = (req, file, cb) => {
  const isAccepted = ['image/png', 'image/jpeg', 'image/jpg',]
    .find(acceptedFormat => acceptedFormat = file.mimetype)

  if (!isAccepted) {
    cb(null, false)
  return cb(new Error('Apenas imagens png/jpeg e jpg'))
  
    
  }
  return cb(null, true)
  
  
}

module.exports = multer({
  storage,
  fileFilter
})