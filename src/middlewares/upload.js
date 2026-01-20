import Path from "react-router-dom";;
import multer from "multer";    


// this file is for file storages to the database | cloud
//define our file storage 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  //folder name
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
})

//filter images to be allowed 
const fileFilter = (req, file, cb) => {
    let allowedTypes = /png|jpeg|jpg|gif/;
    const ext = Path.extname(file.originalname).toLowerCase();
    if(allowedTypes.test(ext)){
        cb(null, true);
    } else {
        cb(new Error(`only images are allowed ${allowedTypes}`), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, //5MB limit
    fileFilter: fileFilter,
});

export default upload;