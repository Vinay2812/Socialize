const express = require("express")
const router = express.Router();

const multer = require("multer")

const image_storage = multer.diskStorage({
    destination:  (req, file, cb) => {
        cb(null, "public/images")
    },
    filename: (req, file, cb)=>{
        cb(null, req.body.name);
    }
});

const video_storage = multer.diskStorage({
    destination:  (req, file, cb) => {
        cb(null, "public/videos")
    },
    filename: (req, file, cb)=>{
        cb(null, req.body.name);
    }
}); 

const upload_image = multer({storage: image_storage});
const upload_video = multer({storage: video_storage});


router.post("/image", upload_image.single("file"), (req, res)=>{
    try {
        return res.status(200).json("File uploaded successfully");
    } catch (err) {
        console.log("uploadRoute -> " + err);
    }
});

router.post("/video", upload_video.single("file"), (req, res)=>{
    try {
        return res.status(200).json("File uploaded successfully");
    } catch (err) {
        console.log("uploadRoute -> " + err);
    }
})

module.exports = router