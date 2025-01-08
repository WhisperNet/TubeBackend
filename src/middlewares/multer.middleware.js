import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  //may need to use cb(null,file.orginalname)
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

export const upload = multer({ storage: storage })
