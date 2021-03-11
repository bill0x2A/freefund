import React, {useState} from 'react';
import classes from './ProjectPage.module.css';

import ReactPlayer from 'react-player/youtube';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Icon, InlineIcon } from '@iconify/react';
import { loadProject, loadUser } from '../../mongo/mongo';
import fileContract from '@iconify-icons/fa-solid/file-contract';
import twitterBird from '@iconify-icons/brandico/twitter-bird';
import facebookIcon from '@iconify-icons/brandico/facebook';
import emailSolid from '@iconify-icons/clarity/email-solid';
import tagIcon from '@iconify-icons/ant-design/tag-outlined';
import clock16Regular from '@iconify-icons/fluent/clock-16-regular';


import testImg from '../../assets/yosemite.png';

import ModalContainer from '../hoc/ModalContainer/ModalContainer';
import Fund from '../Fund/Fund';
import Loading from '../Loading/Loading';
import Information from './Information/Information';

import DAI from '../../assets/DAI.png'
import MarkdownIt from 'markdown-it';
import timeDifference from '../../util/timeDifferece';
import csv from '../../util/commaSeparation';

const md = new MarkdownIt();
// ############## SUBCOMPONENTS ##############

const ProgressBar = (props) =>{
    const progress = props.funding / props.fundingLimit * 100
    return (
        <div className={classes.ProgressBar}>
            <div style={{
                height: "100%",
                width : progress + "%",
                background: "var(--accent)",
                borderRight : "1px solid white"
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
        if(this.state.loading){
            this.loadData();
        }
    }

    loadData = async () => {
        const projectID = this.props.match.params.projectID;
        const response = await loadProject(projectID);
        if(response === 404){
            this.props.history.push('/404')
        } else {
            console.log(response.data);
            this.setState({ project : response.data });
            console.log("DATA:")
            console.dir(response.data);
            const address = response.data.creatorAddress;
            this.loadCreatorData(address);
            this.calculateTimeLeft();
        }
    }

    pledgeHandler = (value) => {
        // This is not very 'React' but it works for now
        document.body.style.height = "100vh";
        document.body.style.overflow = "hidden";
        this.setState({pledging : true, pledge : value});
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
        console.log(user);
        this.setState({creatorData : user.data, loading : false})
    }

    calculateTimeLeft = () => {
        const timeNow = new Date();
        // TESTING DATE
        const endTime = new Date(2021, 3, 20, 10, 33, 30, 0);
        const {days, hours} = timeDifference(timeNow, endTime);
        let difference = [];
        if (days > 0) {
            difference.push((days === 1) ? <h3><span>{days}</span> day</h3> : <h3><span>{days}</span> days</h3>); 
          }
      
        difference.push((hours === 0 || hours === 1) ? <h3><span style={{marginLeft: "6px"}}>{hours}</span> hour</h3> : <h3><span style={{marginLeft: "6px"}}>{hours}</span> hours</h3>);

        const timeDisplay = (
            <React.Fragment>
                {difference}
            </React.Fragment>
        )
        console.log(timeDisplay)
        this.setState({remaining : timeDisplay});
    }

    render(){
        let { project, loading, pledging, pledge, creatorData } = this.state;
        
        project = {
            ...project,
            tagline : "This is a test of the tagline to see if it works and how it looks even when its quite long, It should probably be even longer incase someone is really bad a summing up their project quickly and they insist on typing lots and lots of text to explain it.",
        }

        const funding = parseFloat(project?.funding);
        return(
            <div className={classes.ProjectPage}>
                {loading ? <div className={classes.LoadingContainer}><Loading/></div> :
                    <React.Fragment>

                        {pledging && <ModalContainer>
                                        <Fund
                                            projectID={this.props.match.params.projectID}
                                            pledge={pledge}
                                            dismiss={this.dismissPledgeHandler}
                                            fundingAddress = {project.fundingAddress}
                                        />
                                     </ModalContainer>}

                                <h2 className={classes.Title}>{project.title}</h2>
                                <h3 className={classes.Tagline}>{project.tagline}</h3>

                                <div className={classes.Main}>
                                    <div className={classes.Top}>
                                        <div className={classes.ImageContainer}>
                                            <div style ={ project.videoUrl ? {position: "relative", paddingBottom : "56.25%", width:"100%"} : {marginBottom : "-5px" }}>
                                            { project.videoUrl ? (
                                                <ReactPlayer
                                                    width = {"100%"}
                                                    height = {"100%"}
                                                    url={project.videoUrl}
                                                    fallback={<img src = {testImg}/>}
                                                    controls
                                                    style={{position : "absolute", top : 0, bottom : 0, right: 0, left: 0}}
                                                />
                                                ) : <img src = {testImg}/> }
                                            </div>
                                        </div>
                                            <div className={classes.InfoBox}>
                                                <div className={classes.Funding}>
                                                    <div className={classes.FundingTopline}>
                                                        <div className={classes.FundingInfo}>
                                                            <span>{csv(funding.toFixed(2))}</span>
                                                            <img src = {DAI}/>
                                                            <span>raised</span>
                                                        </div>
                                                    </div>
                                                    <ProgressBar funding={project.funding} fundingLimit={project.fundingLimit}/>
                                                    <div className={classes.FundingBottomLine}>
                                                        <div className={classes.FundingInfo}>
                                                            <span style={{color: "#606060"}}>{csv(project.fundingLimit)}</span>
                                                            <img src = {DAI}/>
                                                            <span style={{color: "#606060"}}>goal</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={classes.MoreInfo}>
                                                    <div className={classes.TimeRemaining}>
                                                        {this.state.remaining}
                                                    </div>
                                                    <h3><span>{project.funders?.length}</span> backers</h3>
                                                    <a href={`https://explorer-mumbai.maticvigil.com/address/${project.fundingAddress}`}><div className={classes.ViewContract}><InlineIcon icon={fileContract}/>View Contract</div></a>
                                                </div>
                                                <div
                                                    className={classes.PledgeButton}
                                                    onClick={() => this.pledgeHandler(0)}
                                                    >Fund
                                                </div>
                                            </div>
                                    </div>
                                    <div className={classes.TagsShare}>
                                        <div className={classes.Tags}>
                                                {project.tags?.map(tag => <span><InlineIcon icon={tagIcon}/>{tag}</span>)}
                                        </div>
                                        <div className={classes.Share}>
                                            <span>SHARE</span>
                                            <div className={classes.SocialIcons}>
                                                <a>
                                                    <InlineIcon icon={facebookIcon}/>
                                                </a>
                                                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(project.title)}%20is%20looking%20for%20funding%20now%20on%20Freefund%20${encodeURIComponent(window.location.href)}&original_referer=https://www.freefund.io`}>
                                                    <InlineIcon icon={twitterBird}/>
                                                </a>
                                                <a>
                                                    <InlineIcon icon={emailSolid}/>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.Bottom}>
                                        <Information project={project} creatorData={creatorData}/>
                                        <div className={classes.Tiers}>
                                            <div style={{height: 0, minHeight: "100%"}}>
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