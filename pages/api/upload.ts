import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from 'cloudinary';
const upload = require('../../utils/multer'); // Adjust the path to your multer configuration

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const formData = await req.formData(); // Parse the FormData from the request

      // Access individual fields from the FormData
      const image = formData.get('image'); // 'image' should match the field name in your form

      // Check if the 'image' field is not empty
      if (!image) {
        return res.status(400).json({ error: 'No image provided' });
      }

      // Ensure 'image' is a Stream
      if (!(image instanceof Stream)) {
        return res.status(400).json({ error: 'Invalid image data' });
      }

      const uploadResponse = await uploadImageToCloudinary(image);

      if (uploadResponse) {
        res.status(200).json({
          message: 'Image uploaded to Cloudinary',
          result: uploadResponse,
        });
      } else {
        res.status(500).json({ error: 'Error uploading image to Cloudinary' });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

async function uploadImageToCloudinary(image: Stream) {
  try {
    const uploadResult = await cloudinary.v2.uploader.upload_stream(
      {
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
        } else {
          console.log('Uploaded image to Cloudinary:', result);
        }
      }
    );

    // Pipe the image Stream to the uploadResult Stream
    image.pipe(uploadResult);

    return new Promise((resolve) => {
      uploadResult.on('finish', () => {
        resolve(uploadResult);
      });
    });
  } catch (error) {
    console.error('Error during image upload to Cloudinary:', error);
    return null;
  }
}