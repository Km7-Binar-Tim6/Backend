const ImageKit = require("imagekit");

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadImage = async (imageFile) => {
  const result = await imageKit.upload({
    file: imageFile.buffer, // Use buffer for memory storage
    fileName: imageFile.originalname,
  });
  return result.url; // Return the URL of the uploaded image
};

module.exports = {
  uploadImage,
};
