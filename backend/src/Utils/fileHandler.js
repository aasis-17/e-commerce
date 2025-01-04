import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import pLimit from 'p-limit';

const deleteMultipleFileFromServer = (localFilePath) => {

    return Promise.all(localFilePath.map(filePath => {
        return  new Promise((res, rej) => {
            try {
                fs.unlink(filePath, (err) => {
                    if(err) throw err
                    res()
                })
            } catch (error) {
                rej(error)
            }
        })
    }))
}

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadFileOnCloudinary = async(localFilePath, type) => {
    try {
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type : type
            })
            console.log("file uploaded on cloudinary!")
            fs.unlinkSync(localFilePath)
            return response
        
    } catch (error) {
        console.log("error while uploading file" , error)
        fs.unlinkSync(localFilePath)
    }
}

export const uploadMultipleFileOnCloudinary = async (localFilePath, type) => {
    try {
        const limit =  pLimit(10)
        const imagesToUpload = localFilePath.map(filePath => {
            return limit(async () => {
                try {
                    const response = await cloudinary.uploader.upload(filePath, {
                        resource_type : type
                    })
                    return response
                    
                } catch (error) {
                    throw error
                }
            })           
        })
        const uploads = await Promise.all(imagesToUpload)
        console.log("All files uploaded on cloudinary!")
        deleteMultipleFileFromServer(localFilePath)
        return uploads
        
    } catch (error) {
        console.log("Error while uploading files!")
        deleteMultipleFileFromServer(localFilePath)
    }
}

export const removeFileFromCloudinary = async(publicId, type) => {
    try {
        if(typeof(publicId) === "string" && !publicId ){
        const response = await cloudinary.uploader.destroy(localFilePath, {
            resource_type: type
        })
        console.log("file has been removed successfully!!")
        return response;
    }
        else if(typeof(publicId === "object") && publicId.length > 0){
            const response = await cloudinary.api.delete_resources(publicId,{
                    resource_type : type
                })
            console.log("file has been removed successfully!!")
            return response;
        }
    } catch (error) {
        console.log("Error while removing file from cloudinary!", error)
        throw error
    }
}

