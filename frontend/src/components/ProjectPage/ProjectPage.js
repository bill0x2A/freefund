import React, {useState} from 'react';
import classes from './ProjectPageRestyle.module.css';

import ReactPlayer from 'react-player/youtube';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Icon, InlineIcon } from '@iconify/react';
import { loadProject, loadUser } from '../../mongo/mongo';
import fileContract from '@iconify-icons/fa-solid/file-contract';
import twitterBird from '@iconify-icons/brandico/twitter-bird';
import facebookIcon from '@iconify-icons/brandico/facebook';
import emailSolid from '@iconify-icons/clarity/email-solid';

import testImg from '../../assets/yosemite.png';

import timeLeft from '../../util/timeDifferece';

import ModalContainer from '../hoc/ModalContainer/ModalContainer';
import Fund from '../Fund/Fund';
import Loading from '../Loading/Loading';
import Information from './Information/Information';

import DAI from '../../assets/DAI.png'
import MarkdownIt from 'markdown-it';

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
            const address = response.data.creatorAddress;
            this.loadCreatorData(address);
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

    render(){
        let { project, loading, pledging, pledge, creatorData } = this.state;
        project = {
            videoURL : "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            tagline : "This is the sweet tagline, something used to quickly explain the project",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pharetra, libero et gravida elementum, erat lacus maximus diam, id volutpat libero augue nec enim. Praesent sed lectus vitae nibh fermentum ornare. Fusce sit amet ex non tellus commodo luctus non id leo. Ut id sem nunc. Vivamus aliquam eget massa ut cursus. Nulla vitae nunc orci.\n Praesent ullamcorper sagittis tellus sed consequat. Sed in metus est. Donec facilisis maximus velit, a lobortis nibh consequat et. Ut mollis massa bibendum, maximus neque non, faucibus leo. Curabitur et orci eu purus congue volutpat id non justo. In molestie vitae orci non pellentesque. Aenean suscipit porta pharetra. Curabitur ac lacinia risus.\n Curabitur efficitur dui sed lorem efficitur placerat. Cras non sem tempor, bibendum eros consectetur, lacinia nisi. In accumsan quam finibus nibh convallis auctor. Vivamus magna turpis, dictum vitae aliquet vel, sodales a sem. Pellentesque at malesuada nisi, id hendrerit nisi. Phasellus sed porta est. Curabitur felis lacus, facilisis vel ante non, bibendum faucibus mauris. Aliquam sem nisl, lacinia eget blandit eget, lacinia eget sapien.\nCras dolor purus, laoreet sed lectus quis, maximus tristique sapien. Phasellus vitae laoreet purus. Ut eget nisl eu nisl malesuada ullamcorper eget sit amet est. Nulla iaculis efficitur sapien. Proin porttitor sapien sed massa semper mollis. Vivamus a consequat dui, eu ullamcorper ipsum. Etiam congue et turpis eget blandit. Phasellus vel mauris mi.",
            images : ["QmUNSSAd6xJXjNmqRCCXpFmy9xNudpfjr9VcTMY92nYoA5","QmUNSSAd6xJXjNmqRCCXpFmy9xNudpfjr9VcTMY92nYoA5","QmUNSSAd6xJXjNmqRCCXpFmy9xNudpfjr9VcTMY92nYoA5"],
            tiers : [
                {funding : 10, description : "This is a test tier", index : 0 },
                {funding : 20, description : "This is a test tier", index : 1 },
                {funding : 30, description : "This is a test tier", index : 2 },
                {funding : 40, description : "This is a test tier", index : 3 },
                {funding : 50, description : "This is a test tier", index : 4 },
            ],
            ...project,
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
                            <div className={classes.Layout}>

                                <h2 className={classes.Title}>{project.title}</h2>
                                <h3 className={classes.Tagline}>{project.tagline}</h3>

                                <div className={classes.Main}>
                                    <div className={classes.Left}>
                                        <div className={classes.ImageContainer}>
                                            { project.videoURL ? (
                                                <ReactPlayer
                                                    width = {"100%"}
                                                    height = {"100%"}
                                                    url={project.videoURL}
                                                    fallback={<img src = {testImg}/>}
                                                    controls
                                                />
                                                ) : <img src = {testImg}/> }
                                        </div>
                                        <Information project={project} creatorData={creatorData}/>
                                    </div>
                                    <div className={classes.Right}>
                                        <div className={classes.Box}>
                                            <div className={classes.InfoBox}>
                                                <div className={classes.Funding}>
                                                    <div className={classes.FundingTopline}>
                                                        <div className={classes.FundingInfo}>
                                                            <span>{funding.toFixed(2)}</span>
                                                            <img src = {DAI}/>
                                                            <span>raised</span>
                                                        </div>
                                                    </div>
                                                    <ProgressBar funding={project.funding} fundingLimit={project.fundingLimit}/>
                                                    <div className={classes.FundingBottomLine}>
                                                        <div className={classes.FundingInfo}>
                                                            <span style={{color: "#606060"}}>{project.fundingLimit}</span>
                                                            <img src = {DAI}/>
                                                            <span style={{color: "#606060"}}>goal</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={classes.MoreInfo}>
                                                    <h3><span>20</span> days to go</h3>
                                                    <h3><span>304</span> backers</h3>
                                                    <a href={`https://rinkeby.etherscan.io/address/${project.fundingAddress}`}><div className={classes.ViewContract}><InlineIcon icon={fileContract}/>View Contract</div></a>
                                                </div>

                                                <div className={classes.PledgeContainer}>
                                                    <div
                                                        className={classes.PledgeButton}
                                                        onClick={() => this.pledgeHandler(0)}
                                                        >Fund
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={classes.Box} style = {{padding:0}}>
                                            <div className={classes.Share}>
                                                <span>SHARE</span>
                                                <InlineIcon icon={facebookIcon}/>
                                                <InlineIcon icon={twitterBird}/>
                                                <InlineIcon icon={emailSolid}/>
                                            </div>
                                        </div>
                                        <h3 style={{height: "38px", marginTop: "45px", marginBottom : "0", color : "var(--bold)"}}>Reward Tiers</h3>
                                        <div className={classes.Tiers}>
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