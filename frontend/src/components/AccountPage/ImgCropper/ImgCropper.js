import React, {useState} from 'react';
import classes from './ImgCropper.module.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImgCropper = ({imgHash, sendCrop, handleNewImage}) => {

    let [newImg, setNewImg] = useState(undefined);

    const fileToDataUri = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result)
        };
        reader.readAsDataURL(file);
        })

    const handleNewImg = (e) => {
        console.log("HANDLING NEW IMAGE")
        const file = e.target.files[0];
        handleNewImage(e.target.files[0]);
        fileToDataUri(file)
            .then(dataUri => {
                setNewImg(dataUri);
            });
    }

    return(
        <div className={classes.ImageUploadContainer}>
            {newImg
                ? (
                    <Crop src={newImg} sendCrop={sendCrop}/>
                )
                : (
                    <img className={classes.ExistingImage} src={`https://ipfs.infura.io/ipfs/${imgHash}`}/>
                )
             }
            <div className={classes.ImageUpload}>
                <input
                    type='file'
                    accept=".jpg, .jpeg, .png, .bmp, .gif"
                    onChange={handleNewImg}
                />
                <p>Drag image here</p>
            </div>
        </div>
    )
}

function Crop({ src, sendCrop }) {
    const [crop, setCrop] = useState({
        unit: '%',
        x: 0,
        y: 0,
        height: 100,
        aspect : 1/1
      });
    const newCrop = newCrop => {
        setCrop(newCrop);
        sendCrop(newCrop);
    }
    return <ReactCrop
                style={{maxWidth:"60%"}}
                imageStyle={{maxWidth:"100%"}}
                src={src}
                crop={crop}
                onChange={newCrop}
                ruleOfThirds
            />;
}

export default ImgCropper