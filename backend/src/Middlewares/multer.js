import multer from "multer"
import { fileTypeFromBuffer } from "file-type";
import fs from "fs";

// // Middleware to validate file type by magic number (file signatures)
 export const fileValidation = async (req,res,next) => {
  try {
    // get the file path
    const filePath = req.file?.path
    // read the file and return buffer
    const buffer = fs.readFileSync(filePath);
    // get the file type
    const type = await fileTypeFromBuffer(buffer);
    console.log(type)
    // validate
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!type || !allowedTypes.includes(type.mime)){
      fs.unlinkSync(filePath)
      return next(new Error("Invalid file type"));
    }
    return next() ;

  } catch (error) {
    console.log(error)
    fs.unlinkSync(filePath)
    return next(new Error("Internal server error"));
  }
};

const validateFile = (req, file, cd) => {
    const allowedTypes = ["image/jpeg", "image/png"]
    console.log(file)
    if(!allowedTypes.includes(file.mimetype)) return cd(new Error("File type is not allowed!", false))
    return cd(null, true)
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/Public/temp')
    },
    filename: function (req, file, cb) {
      console.log(req.file)
      cb(null, `${ Date.now()}-${file.originalname}` )
    }
  })
  
  export const upload = multer({ storage: storage, fileFilter : validateFile })