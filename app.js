const express = require('express');
const mutler = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const upload = require('./middleware/multerConfig.js');

const app = express();
const PORT = process.env.PORT || 9999;


// api for image upload
app.post('/upload', upload.single('image'), (req, res)=>{
    const {file} = req;
    if(!file) return res.status(400).send('No image uploaded');

    res.status(201).json({message : "Image uploaded successfully", filename: file.filename});
});


// api for download and process (rotate) image

app.get("/download/:filename", async(req,res)=>{
    const {filename} = req.params;
    const inputImgPath = path.join(__dirname, 'uploads', filename);
    const processedImgPath = path.join(__dirname, 'processed', `processed_${filename}`);

    try{
        if(!fs.existsSync(inputImgPath)){
            return res.status(404).send("Image not found");
        }

        if(!fs.existsSync('./processed')){
            fs.mkdirSync('./processed');
        }

        await sharp(inputImgPath)
        .rotate(90)
        .toFile(processedImgPath);

        res.download(processedImgPath, `processed_${filename}`);
    }catch(error){
        console.error(error);
        res.status(500).send("Error processing image");
    }
});

app.listen(PORT, ()=>{
    console.log(`Server running on port${PORT}`);
});