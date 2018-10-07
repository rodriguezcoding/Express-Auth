const cloudinary = require("cloudinary");

// const fileUpload = file => {
//   let result = "";
cloudinary.uploader.upload("file",
  (result, error) => {},
  {
    cloud_name: process.env.SECRET_KEY_CLOUDINARY_CLOUD,
    upload_preset: process.env.SECRET_KEY_CLOUDINARY_UPLOADPRESET,
    api_key: process.env.SECRET_KEY_CLOUDINARY_KEY,
    api_secret: process.env.SECRET_KEY_CLOUDINARY_SECRET,
    overwrite: true,
    phash: true,
    use_filename: true,
    unique_filename: false
  }
);
// };


