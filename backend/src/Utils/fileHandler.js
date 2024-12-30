import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

const uploadFileOnCloudinary = async(localFilePath) => {
    try {
        if(localFilePath && typeof(localFilePath) === "string"){
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type : auto
            })
            console.log("file uploaded on cloudinary!")
            fs.unlink(localFilePath, (err) =>{
                if (err) throw err
            }) 
            return response
        }
        else if( typeof(localFilePath) === "object" && localFilePath.length !== 0) {
            const limit = p(10)

            const imagesToUpload = localFilePath.map((filePath) => {
                return limit (async() => {
                    const response = await cloudinary.uploader.upload(filePath, {
                        resource_type : "auto"
                    })
                    
                    return response
                })
            })
            
            const uploads = await Promise.all(imagesToUpload)
            console.log("All files uploaded on cloudinary!")
            
            localFilePath.forEach(filePath => {
                fs.unlink(filePath, (err) =>{
                    if (err) throw err
                }) 
            });
            return uploads
        }
        else{
            return null
        }

    } catch (error) {
        console.log("error while uploading file" , error)
        fs.unlink(localFilePath, (err) =>{
            if (err) throw err
        }) 
    }
}