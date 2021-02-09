import React from 'react';
import {withRouter} from 'react-router-dom';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, Image } from 'pure-react-carousel';
import classes from './ProjectPage.module.css';
import 'pure-react-carousel/dist/react-carousel.es.css';

import Loading from '../Loading/Loading';
import {test1, test2, test3, test4} from '../../constants/testProjects';
import DAI from '../../assets/DAI.png'
import ModalContainer from '../hoc/ModalContainer/ModalContainer';
import Fund from '../Fund/Fund';

const Carousel = ({images}) => {
    return(
        <div className={classes.ImageCarouselContainer}>
        <CarouselProvider
            naturalSlideWidth={400}
            naturalSlideHeight={250}
            totalSlides={images.length}
            hasMasterSpinner={true}
            infinite={true}
            isIntrinsicHeight={false}
            isPlaying={true}
            interval={3800}
        >
            <Slider>
                <Slide index={0}>
                    <Image src = {images[0]}/>
                </Slide>
                <Slide index={1}>
                    <Image src = {images[1]}/>
                </Slide>
                <Slide index={2}>
                    <Image src = {images[2]}/>
                </Slide>
            </Slider>
        </CarouselProvider>
    </div>
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

    pledgeHandler = () => {
        // This is not very React but it works for now
        document.body.style.height = "100vh";
        document.body.style.overflow = "hidden";
        this.setState({pledging:true});
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
        const { project, loading, pledging } = this.state;
        return(
            <div className={classes.ProjectPage}>
                {loading ? <Loading/> :
                    <React.Fragment>

                        {pledging && <ModalContainer><Fund project={project} dismiss={this.dismissPledgeHandler}/></ModalContainer>}

                        <h2>{project.title}</h2>
                        <div className={classes.Main}>
                            <Carousel images = {project.images}/>
                            <div className={classes.CreatorInfo}>
                                <div className={classes.CreatorText}>
                                    <h4>{project.creatorName}</h4>
                                    <p>{project.creatorBio}</p>
                                </div>
                                <img src={project.creatorImage}/>
                            </div>
                            <div className={classes.Funding}>
                                <div style={{display:"block", width:"calc(100% - 300px"}}>
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
                                        onClick={this.pledgeHandler}
                                    >Fund</div>
                                </div>
                            </div>
                            <div className={classes.Description}>
                                <p>{project.description}</p>
                                <p>This should definitely support markup - I'll look into a React text editor component...</p>
                            </div>
                            <div className={classes.RewardTiers}>
                                <div className={classes.RewardTier}>
                                    <span>100 <img src={DAI}/> and up</span>
                                    <h3>Tier 1</h3>
                                    <p>{project.description}</p>
                                </div>
                                <div className={classes.RewardTier}>
                                    <span>200 <img src={DAI}/> and up</span>
                                    <h3>Tier 2</h3>
                                    <p>{project.description}</p>
                                </div>
                                <div className={classes.RewardTier}>
                                    <span>300 <img src={DAI}/> and up</span>
                                    <h3>Tier 3</h3>
                                    <p>{project.description}</p>
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