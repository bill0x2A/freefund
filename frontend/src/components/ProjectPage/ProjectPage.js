import React, {useState} from 'react';
import classes from './ProjectPage.module.css';
import styles from './Carousel.css';

import { Carousel } from 'react-responsive-carousel';
import ReactPlayer from 'react-player/youtube';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadProject, loadUser } from '../../mongo/mongo';

import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import MarkdownIt from 'markdown-it';
import timeLeft from '../../util/timeDifferece';

import ModalContainer from '../hoc/ModalContainer/ModalContainer';
import Fund from '../Fund/Fund';
import Loading from '../Loading/Loading';

import DAI from '../../assets/DAI.png'



const md = new MarkdownIt();

// ############## SUBCOMPONENTS ##############

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
                <ReactPlayer
                    url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    controls
                    style = {{display: "inline-block", width : "100%", background : "purple", margin : "0"}}
                    onPause = {setAutoplay(true)}
                    onPlay = {setAutoplay(false)}
                    onEnded = {setAutoplay(true)}
                />
                {images}
            </Carousel>
    )
}

const ProgressBar = (props) =>{
    const progress = props.funding / props.fundingLimit * 100
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
    }

    loadData = async () => {
        const projectID = this.props.match.params.projectID;
        console.log(projectID);
        const response = await loadProject(projectID);
        if(response === 404){
            this.props.history.push('/404')
        } else {
            console.log(response.data);
            this.setState({project : response.data, loading : false}, () => {
                this.loadCreatorData(response.data.creatorAddress)
            });
        }
    }

    pledgeHandler = (value) => {
        // This is not very 'React' but it works for now
        document.body.style.height = "100vh";
        document.body.style.overflow = "hidden";
        this.setState({pledging:true, pledge : value});
    }

    dismissPledgeHandler = () => {
        document.body.style.height = "100%";
        document.body.style.overflow = "auto";
        this.setState({pledging:false});
    }

    parseDescription = (text) => {
        const html = md.render(text);
        this.setState({descriptionHtml : html});
    }

    loadCreatorData = async creatorAddress => {
        const user = await loadUser(creatorAddress);
        this.setState({creatorData : user.data, loading : false})
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
                                            dismiss={this.dismissPledgeHandler}
                                        />
                                     </ModalContainer>}

                        <h2>{project.title}</h2>
                        <h3 className={classes.Tagline}>{project.tagline}</h3>
                        <div className={classes.TimeLeft}>{timeLeft(project.createdAt)}</div>

                        <div className={classes.Main}>

                        <div className={classes.Funding}>
                                <div className={classes.FundingLeft}>
                                    <div className={classes.FundingTopline}>
                                        <div className={classes.FundingInfo}>
                                            <span>{project.funding?.toFixed(2)}</span>
                                            <img src = {DAI}/>
                                            <span>raised</span>
                                        </div>
                                        <div className={classes.FundingInfo}>
                                            <span style={{color: "#606060"}}>{project.fundingLimit}</span>
                                            <img src = {DAI}/>
                                            <span style={{color: "#606060"}}>goal</span>
                                        </div>
                                    </div>
                                    <ProgressBar funding={project.funding} fundingLimit={project.fundingLimit}/>
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
                                        {(typeof(project.description) == "string") ? project.description : ReactHtmlParser(md.render(project.description.text))}
                                        </div>
                                    </div>
                                </div>
                                <div style = {{flex : 2}}>
                                    <div className={classes.CreatorInfo}>
                                            <h4>{creatorData?.firstName} {creatorData?.lastName}</h4>
                                            <img src={`https://ipfs.infura.io/ipfs/${creatorData?.profileHash}`}/>
                                            <p>{creatorData?.bio}</p>
                                    </div>

                                    <div className={classes.RewardTiers}>
                                        {project.tiers?.map((tier, index) => (
                                            <RewardTier
                                                index={index + 1}
                                                amount={tier.funding}
                                                pledgeHandler={() => this.pledgeHandler(tier.funding)}
                                                description={tier.description}
                                            />
                                        ))}

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

const mapStateToProps = state => ({
    token : state.token,
    user : state.token,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProjectPage));