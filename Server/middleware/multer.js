import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  fileName: (req, file, cb) => {
    cb(null, file.originalName);
  },
});

const upload = multer(storage);
export default upload;
    