import React from 'react';
import classes from './ProjectBrowser.module.css';
import ProjectCard from '../ProjectCard/ProjectCard';

class ProjectBrowser extends React.Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    search = () => {
        if(this.state.searchTerms !== undefined){
            let searchTerms = this.state.search.split(' ');
            searchTerms = searchTerms.filter(term => term !== ' ');
        }

        // Query database with search term (stored in state)
    }

    onChange = (e) => {
        this.setState({[e.target.name] : e.target.value})
    }

    render(){
        return(
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
                        <ProjectCard/>
                        <ProjectCard/>
                        <ProjectCard/>
                        <ProjectCard/>
                    </div>
                </div>
            </div>
        )
    }

}


export default ProjectBrowser;