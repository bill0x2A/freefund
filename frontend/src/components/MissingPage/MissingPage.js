import React from 'react';
import classes from './MissingPage.module.sass';

import { Link } from 'react-router-dom';

const MissingPage = props => {
    return (
        <div className={classes.MissingPage}>
            <h1>404 ¯\_(ツ)_/¯</h1>
            <h2>Oops! We couldn't find that page.</h2>
            <p>The URL you have entered doesn't seem to be valid...</p>
            <Link to ="/home">Home</Link>
        </div>
    )
}

export default MissingPage;