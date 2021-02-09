import React from 'react';
import {withRouter} from 'react-router-dom';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, Image } from 'pure-react-carousel';
import classes from './ProjectPage.module.css';
import styles from './Carousel.css';
import { Carousel } from 'react-responsive-carousel';

import Loading from '../Loading/Loading';
import {test1, test2, test3, test4} from '../../constants/testProjects';
import DAI from '../../assets/DAI.png'
import ModalContainer from '../hoc/ModalContainer/ModalContainer';
import Fund from '../Fund/Fund';

// ############## SUBCOMPONENTS ##############

const CarouselDisplay = ({images}) => {
    return(
            <Carousel
                autoPlay={true}
                interval={4400}
                infiniteLoop={true}
            >
                <div className={classes.Test}>
                    <img src={images[0]} />                        
                </div>
                <div className={classes.Test}>
                    <img src={images[1]} />                            
                </div>
                <div className={classes.Test}>
                    <img src={images[2]} />                         
                </div>
            </Carousel>
    )
}

const ProgressBar = (props) =>{
    const progress = props.funded / props.fundingLimit * 100
    return (
        <div className={classes.ProgressBar}>
            <div style={{
                height: "100%",
                width : progress + "%",
                background: "var(--accent)",
                borderRight : "4px solid white"
            }}/>
        </div>
    )
}

const RewardTier = ({amount, description, index, pledgeHandler}) => {
    return(
        <div className={classes.RewardTier}>
            <span>{amount}<img src={DAI}/>+</span>
            <h3>Tier {index}</h3>
            <p>{description}</p>
            <div className={classes.RewardFundContainer}>
                <div 
                    className={classes.RewardFund}
                    onClick ={pledgeHandler}
                >Fund</div>   
            </div>
        </div>
    )
}

class ProjectPage extends React.Component {
    constructor(props){
        super(props)
        this.state ={
            loading : true,
            pledging : false,
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

    pledgeHandler = (value) => {
        // This is not very React but it works for now
        document.body.style.height = "100vh";
        document.body.style.overflow = "hidden";
        this.setState({pledging:true, pledge : value});
    }

    dismissPledgeHandler = () => {
        document.body.style.height = "100%";
        document.body.style.overflow = "auto";
        this.setState({pledging:false});
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
        const { project, loading, pledging, pledge } = this.state;
        return(
            <div className={classes.ProjectPage}>
                {loading ? <Loading/> :
                    <React.Fragment>

                        {pledging && <ModalContainer><Fund project={project} pledge={pledge} dismiss={this.dismissPledgeHandler}/></ModalContainer>}

                        <h2>{project.title}</h2>

                        <div className={classes.Main}>

                        <div className={classes.Funding}>
                                <div className={classes.FundingLeft}>
                                    <div className={classes.FundingTopline}>
                                        <div className={classes.FundingInfo}>
                                            <span>{project.funded}</span>
                                            <img src = {DAI}/>
                                            <span>raised</span>
                                        </div>
                                        <div className={classes.FundingInfo}>
                                            <span style={{color: "#606060"}}>{project.fundingLimit}</span>
                                            <img src = {DAI}/>
                                            <span style={{color: "#606060"}}>goal</span>
                                        </div>
                                    </div>
                                    <ProgressBar funded={project.funded} fundingLimit={project.fundingLimit}/>
                                </div>
                                <div className={classes.PledgeContainer}>
                                    <div
                                        className={classes.PledgeButton}
                                        onClick={() => this.pledgeHandler(0)}
                                    >Fund</div>
                                </div>
                            </div>

                            <div style={{display : "flex", width : "100%"}}>
                                <div style = {{marginRight : "30px", flex : 3}}>
                                    <CarouselDisplay images = {project.images}/>

                                    <div className={classes.Description}>
                                        <h2>Project Information</h2>
                                        <p>{project.description}</p>
                                        <p>{project.description}</p>
                                        <p>{project.description}</p>
                                        <p>This should definitely support markup - I'll look into a React text editor component...</p>
                                    </div>
                                </div>
                                <div style = {{flex : 2}}>
                                    <div className={classes.CreatorInfo}>
                                            <h4>{project.creatorName}</h4>
                                            <img src={project.creatorImage}/>
                                            <p>{project.creatorBio}</p>
                                       
                                    </div>

                                    <div className={classes.RewardTiers}>
                                        <RewardTier
                                            index={1}
                                            amount={20}
                                            pledgeHandler={() => this.pledgeHandler(20)}
                                            description={project.description}
                                        />
                                        <RewardTier
                                            index={2}
                                            amount={30}
                                            pledgeHandler={() => this.pledgeHandler(30)}
                                            description={project.description}
                                        />
                                        <RewardTier
                                            index={3}
                                            amount={50}
                                            pledgeHandler={() => this.pledgeHandler(50)}
                                            description={project.description}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                }
                
            </div>
        )
    }

}


export default withRouter(ProjectPage);