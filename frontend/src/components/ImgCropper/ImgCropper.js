import React, {useState} from 'react';
import classes from './ImgCropper.module.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImgCropper = ({newImg, square, submit, close}) => {
    const [crop, setCrop] = useState({
        unit: '%',
        x: 0,
        y: 0,
        height: 100,
        aspect : square ? 1/1 : 16/9,
      });

    return(
        <div className={classes.ImageEditor}>
            <ReactCrop
                src={newImg}
                crop={crop}
                onChange={setCrop}
                ruleOfThirds
            />
            <div style={{display : "flex", justifyContent : "space-around", width : "400px"}}>
                <div
                    className={classes.Button}
                    onClick={() => submit(crop)}
                    style = {{background : "var(--accent)"}}
                    >Confirm
                </div>
                <div
                    className={classes.Button}
                    onClick={close}
                    style = {{background : "var(--warning)"}}
                    >Close
                </div>
            </div>
        </div>
    )
}

export default ImgCropper