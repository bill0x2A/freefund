import React, { useState } from 'react';
import classes from './Information.module.css';
import { Carousel } from 'react-responsive-carousel';
import styles from '../Carousel.css';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

const Information = ({project}) => {

    let [ tab, setTab ] = useState(0);
    let content;
    switch(tab){
        case 0:
            content = (
                <div className={classes.Description}>
                    <div>
                    {/* {(typeof(project.description) == "string") ? project.description : ReactHtmlParser(md.render(project.description?.text))} */}
                    {project.description}""
                    </div>
                </div>
            );
            break;
        case 1:
            content = (
                <CarouselDisplay imageHashes = {project.images}/>
            );
            break;
        case 2:
            content = (
                <div>Comments</div>
            );
            break;
    }

    return(
        <div className={classes.Information}>
            <div className={classes.Topline}>
                <span
                    className={tab == 0 ? classes.Selected : null}
                    onClick={() => setTab(0)}
                    >Project
                </span>
                <span
                    className={tab == 1 ? classes.Selected : null}
                    onClick={() => setTab(1)}
                    >Images
                </span>
                <span
                    className={tab == 2 ? classes.Selected : null}
                    onClick={() => setTab(2)}
                    >Comments
                </span>
            </div>
            <div className={classes.Main}>
                {content}
            </div>
        </div>
    )
}

const CarouselDisplay = ({imageHashes}) => {

    // Fetch images from ipfs
    const [autoplay, setAutoplay] = useState(false);

    const images = imageHashes?.map(imgHash => (
        <div className={classes.Test} key={imgHash}>
            <img src = {`https://ipfs.infura.io/ipfs/${imgHash}`} alt={`IPFS image : ${imgHash}`}/>
        </div>
    ));

    return(
            <Carousel
                autoPlay={autoplay}
                interval={4400}
                infiniteLoop={true}
            >
                {images}
            </Carousel>
    )
}

export default Information;