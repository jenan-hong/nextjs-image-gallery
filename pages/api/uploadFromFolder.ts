import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
// import cloudinary from '../../utils/cloudinary'
import cloudinary from 'cloudinary'

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const folderPath = './assets';
      const imageFiles = getFilesInFolder(folderPath);

      for (const imageFile of imageFiles) {
        const imagePath = `${folderPath}/${imageFile}`;
        const uploadResult = await uploadImageToCloudinary(imagePath);
        console.log(`Uploaded ${imageFile} to Cloudinary:`, uploadResult);
      }

      res.status(200).json({ message: 'Images uploaded to Cloudinary' });
    } catch (error) {
      console.error('Error reading or uploading images:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

function getFilesInFolder(folderPath: string): string[] {
  try {
    const files = fs.readdirSync(folderPath);
    
    const imageFiles = files.filter((file) => {
      return file.endsWith('.jpg') || file.endsWith('.png');
    });
    
    return imageFiles;
  } catch (error) {
    console.error('Error reading files in folder:', error);
    throw error;
  }
}

async function uploadImageToCloudinary(imagePath: string) {
  try {
    const uploadResult = await cloudinary.v2.uploader.upload(imagePath);
    return uploadResult;
  } catch (error) {
    console.error(`Error uploading ${imagePath} to Cloudinary:`, error);
    throw error;
  }
}



