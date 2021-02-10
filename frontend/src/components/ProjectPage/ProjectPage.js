import React from 'react';
import {withRouter} from 'react-router-dom';
import classes from './ProjectPage.module.css';
import styles from './Carousel.css';
import { Carousel } from 'react-responsive-carousel';
import { withFirebase } from '../../firebase/index';
import MarkdownIt from 'markdown-it';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

import Loading from '../Loading/Loading';
import {test1, test2, test3, test4} from '../../constants/testProjects';
import DAI from '../../assets/DAI.png'
import ModalContainer from '../hoc/ModalContainer/ModalContainer';
import Fund from '../Fund/Fund';

const md = new MarkdownIt();

// ############## SUBCOMPONENTS ##############

const CarouselDisplay = ({imageHashes}) => {

    // Fetch images from ipfs
    console.log("IMGHASHES: ", imageHashes);
    const images = imageHashes.map(imgHash => `https://ipfs.infura.io/ipfs/${imgHash}`);

    return(
            <Carousel
                autoPlay={true}
                interval={4400}
                infiniteLoop={true}
            >
                <div className={classes.Test}>
                    <img src={images[0]} />                        
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
        this.props.firebase.project(this.props.match.params.projectID)
        .on("value", data => {
            const project = data.val();
            this.setState({project : project});
            this.parseDescription(project.description.text);
            this.loadCreatorData(project.creatorAddress);
        })
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
        let project;
        switch(this.props.match.params.projectID){
            case "opaemf-9j1028c9j":
                project = test1;
                this.setState({project : project, loading : false});
                break;
            case "spodja-km90ecu3":
                project = test2;
                this.setState({project : project, loading : false});
                break;
            case "sdapoij-893hf90":
                project = test3;
                this.setState({project : project, loading : false});
                break;
            case "m094398fuj-aifhjw80":
                project = test4;
                this.setState({project : project, loading : false});
                break;
        }
    }

    parseDescription = (text) => {
        const html = md.render(text);
        this.setState({descriptionHtml : html});
    }

    loadCreatorData = creatorAddress => {
        this.props.firebase.user(creatorAddress)
            .once("value", data => {
                const creatorData = data.val();
                this.setState({creatorData, loading:false});
            })
    }

    render(){
        const { project, loading, pledging, pledge, creatorData } = this.state;
        return(
            <div className={classes.ProjectPage}>
                {loading ? <Loading/> :
                    <React.Fragment>

                        {pledging && <ModalContainer>
                                        <Fund
                                            projectID={this.props.match.params.projectID}
                                            pledge={pledge}
                                            dismiss={this.dismissPledgeHandler}/>
                                     </ModalContainer>}

                        <h2>{project.title}</h2>

                        <div className={classes.Main}>

                        <div className={classes.Funding}>
                                <div className={classes.FundingLeft}>
                                    <div className={classes.FundingTopline}>
                                        <div className={classes.FundingInfo}>
                                            <span>{project.funded.toFixed(2)}</span>
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
                                <div style = {{marginRight : "30px", flex : 2}}>
                                    <CarouselDisplay imageHashes = {project.imgHashes}/>

                                    <div className={classes.Description}>
                                        <h2>Project Information</h2>
                                        <div>
                                         {ReactHtmlParser(this.state.descriptionHtml)}
                                        </div>
                                    </div>
                                </div>
                                <div style = {{flex : 2}}>
                                    <div className={classes.CreatorInfo}>
                                            <h4>{creatorData.firstName} {creatorData.lastName}</h4>
                                            <img src={`https://ipfs.infura.io/ipfs/${creatorData.profileHash}`}/>
                                            <p>{creatorData.bio}</p>
                                       
                                    </div>

                                    <div className={classes.RewardTiers}>
                                        <RewardTier
                                            index={1}
                                            amount={project.t1funding}
                                            pledgeHandler={() => this.pledgeHandler(project.t1funding)}
                                            description={project.t1desc}
                                        />
                                        <RewardTier
                                            index={2}
                                            amount={project.t2funding}
                                            pledgeHandler={() => this.pledgeHandler(project.t2funding)}
                                            description={project.t2desc}
                                        />
                                        <RewardTier
                                            index={3}
                                            amount={project.t3funding}
                                            pledgeHandler={() => this.pledgeHandler(project.t3funding)}
                                            description={project.t3desc}
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


export default withRouter(withFirebase(ProjectPage));