import React from 'react';
import classes from './ProjectPage.module.css';
import {withRouter} from 'react-router-dom';
import Loading from '../Loading/Loading';
import {test1, test2, test3, test4} from '../../constants/testProjects';

class ProjectPage extends React.Component {
    constructor(props){
        super(props)
        this.state ={
            loading : true,
        }
    }  

    componentDidMount = () => {
        this.loadData();
        this.testDataLoader();
    }

    loadData = () => {
        //load project data to state with id : this.props.match.params.projectID
        // then this.setState({loading : false})
    }

    testDataLoader = () => {
        // Just a quick fix to get the data in here before we get hooked up to a db.
        let project;
        switch(this.props.match.params.projectID){
            case "opaemf-9j1028c9j":
                project = test1;
                break;
            case "spodja-km90ecu3":
                project = test2;
                break;
            case "sdapoij-893hf90":
                project = test3;
                break;
            case "m094398fuj-aifhjw80":
                project = test4;
                break;
            default: 
                // Render project not found.
        }
        this.setState({project : project, loading : false});
    }

    render(){
        const { project, loading } = this.state;
        return(
            <div className={classes.ProjectPage}>
                {loading ? <Loading/> :
                    <React.Fragment>
                        <h2>{project.title}</h2>
                        <div>
                            <div className={classes.ImageCaroselContainer}>

                            </div>
                            <div className={classes.CreatorInfo}>

                            </div>
                        </div>
                        <div className={classes.Funding}>

                        </div>
                        <div>
                            <div className={classes.Description}>

                            </div>
                            <div className={classes.RewardTiers}>

                            </div>
                        </div>
                    </React.Fragment>
                }
                
            </div>
        )
    }

}

export default withRouter(ProjectPage);