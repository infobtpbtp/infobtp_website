import { v2 as cloudinary } from 'cloudinary';

const CLOUDINARY_CLOUD_NAME = "dbdv62r1j"
const CLOUDINARY_API_KEY = "982947356891989"
const CLOUDINARY_API_SECRET = "_DSrRbzN-6KwD-nr4F1DmLWhTco"

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export default cloudinary;
