import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// TODO: optimize url 
export const uplaodOnCloudinary = async(uri)=>{
    try {
        if(!uri) return null
        const response = await cloudinary.uploader
        .upload(
            uri,{resource_type:"auto"}
        );
        fs.unlinkSync(uri)
        return response
    } catch (error) {
        fs.unlinkSync(uri)
        return null;
    }
}

export {uplaodOnCloudinary}