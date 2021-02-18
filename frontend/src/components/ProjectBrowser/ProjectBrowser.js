import React from 'react';
import classes from './ProjectBrowser.module.css';
import ProjectCard from '../ProjectCard/ProjectCard';
import { withFirebase } from '../../firebase/index';
import Loading from '../Loading/Loading';

import { loadProjects } from '../../mongo/mongo';

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
        this.loadProjects();
    }

    loadProjects = async () => {
        const projects = await loadProjects();
        this.setState({projects, loading : false})
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
                        {this.state.projects.map(project => (
                            <ProjectCard key={project.id} project={project}/>
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