import React from 'react';
import classes from './ProjectPage.module.css';
import {withRouter} from 'react-router-dom';

class ProjectPage extends React.Component {
    constructor(props){
        super(props)
        this.state ={

        }
    }

    render(){
        console.log(this.props.match)
        return(
            <div className={classes.ProjectPage}>
                <p>{this.props.match.params.projectID}</p>
            </div>
        )
    }

}

export default withRouter(ProjectPage);