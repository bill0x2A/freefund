import React from 'react';
import classes from './ProjectBrowser.module.css';
import ProjectCard from '../ProjectCard/ProjectCard';
import {test1, test2, test3, test4} from '../../constants/testProjects';
import { withFirebase } from '../../firebase/index';
import Loading from '../Loading/Loading';

class ProjectBrowser extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
        }
    }

    search = () => {
        if(this.state.searchTerms !== undefined){
            let searchTerms = this.state.search.split(' ');
            searchTerms = searchTerms.filter(term => term !== ' ');
        }

        // Query database with search term (stored in state)
    }

    loadProjectsIDs = () => {
        this.props.firebase.projects().once("value", snap => {
            const data = [...Object.keys(snap.val())];
            console.log("DATA: ", data);
            this.setState({projectIDs : data, loading : false})
        })
    }

    onChange = (e) => {
        this.setState({[e.target.name] : e.target.value})
    }

    componentDidMount(){
        this.loadProjectsIDs();
    }

    render(){
        return(
            <React.Fragment>
            {this.state.loading ? <Loading/> : 
                <div className={classes.ProjectBrowser}>
                <div className={classes.SearchContainer}>
                    <input 
                        type="text"
                        placeholder="Search for cool projects here!"
                        name="search"
                    />
                    <div 
                        className={classes.SearchButton}
                        onClick={this.search}
                    >Search</div>
                </div>
                <div className={classes.Box}>
                    <h2>Popular Projects</h2>
                    <div className={classes.Projects}>
                        {this.state.projectIDs.map(projectID => (
                            <ProjectCard key={projectID} projectID={projectID}/>
                        ))}
                    </div>
                </div>
            </div>
            }
            </React.Fragment>
        )
    }

}


export default withFirebase(ProjectBrowser);