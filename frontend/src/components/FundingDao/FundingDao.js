import React from 'react';
import classes from './FundingDao.module.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Loading from '../Loading/Loading';
import ModalContainer from '../hoc/ModalContainer/ModalContainer';

import DAI from '../../assets/DAI.png';

// This is the most rushed React component I've ever written lol, ignore the horrific formatting.

class NewProposal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            funding : 0,
        }
    }

    onChange = e => {
        this.setState({[e.target.name] : e.target.value});
    }

    onSubmit = () => {
        const timeCreated = new Date();

        const proposal = {
            timeCreated : timeCreated.toUTCString(),
            body : this.state.body,
            title : this.state.title,
            funding : this.state.funding,
            vetoes : 0,
            approved : false,
        }

        const proposalID = this.props.projectID + "-" + Math.random().toString(36).substr(2, 9);
        // Add proposal to database

        this.props.dismiss();
    }

    render(){
        const { funding, body, title} = this.state;
        let disabled = false;
        if(funding == 0 || !body || !title){
            disabled = true;
        }
        return(
            <div className={classes.NewProposal}>
            <div  className={classes.Close} onClick={this.props.dismiss}>X</div>
            <h3>Enter proposal details</h3>
            <div className={classes.Payment}>
                <input 
                    type="number"
                    name="funding"
                    value={funding}
                    onChange={this.onChange}
                />
                <span>DAI <img src={DAI}/></span>
            </div>
            <input
                placeholder="Title"
                name="title"
                onChange={this.onChange}
                value = {title}
                type="text"
            />
            <textarea
                placeholder="Proposal description"
                onChange={this.onChange}
                value={body}
                name="body"
            />
            <div className={classes.SubmitContainer}>
                {!disabled ? 
                    <div
                        className={classes.SubmitButton}
                        onClick = {this.onSubmit}
                    >Submit</div> : 
                    <div
                        style={{background:"gray"}}
                        className={classes.SubmitButton}
                    >Please fill out all fields</div>
                }
            </div>
        </div>
        )
    }
    
}

class DirtyFixWrapper extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading : true,
        }
    }

        componentDidMount(){
            this.loadProposal();
        }

        loadProposal = () => {
            // Load proposal from database
        }

        render(){
            const timeNow = new Date();
            const timeCreated = new Date(this.state.proposalData?.timeCreated);
            const hoursLeft = 48 - Math.floor((timeNow - timeCreated) / 1000 / 60 / 60);
            return(
                <React.Fragment>
                    {this.state.loading ? <Loading/> : <ProposalDisplay proposal={this.state.proposalData} clicked ={this.props.clicked} hoursLeft={hoursLeft}/>}
                </React.Fragment>
            )
        }
}

class DirtyFixWrapperDisplay extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading : true,
        }
    }

        componentDidMount(){
            this.loadProposal();
        }

        componentDidUpdate(prevProps){
            if(prevProps.proposalID !== this.props.proposalID){
                this.loadProposal();
            }
        }

        loadProposal = () => {
            //
        }

        render(){
            const {proposalData} = this.state
            const timeNow = new Date();
            const timeCreated = new Date(proposalData?.timeCreated);
            const hoursLeft = 48 - Math.floor((timeNow - timeCreated) / 1000 / 60 / 60);
            return(
                <React.Fragment>
                    {this.state.loading ? <Loading/> : (
                        <div className={classes.ProposalShow}>
                            <h2>{proposalData.title}</h2>
                            <h4>{hoursLeft}H remaining to vote</h4>
                            <br/>
                            <h4>Requesting {proposalData.funding} <img src={DAI}/> DAI </h4>
                            <p>{proposalData.body}</p>
                            {this.props.veto}
                            <div className={classes.Vetoes}>Vetoed {proposalData.vetoes} times</div>
                        </div>
                    )}
                </React.Fragment>
            )
        }
}

class Veto extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            funding : 0,
        }
    }

    onChange = e => {
        this.setState({[e.target.name] : e.target.value});
    }

    render(){
        const { reason} = this.state;
        let disabled = false;
        if(!reason ){
            disabled = true;
        }
        return(
            <div className={classes.NewVeto}>
            <div  className={classes.Close} onClick={this.props.dismiss}>X</div>
            <h3>Enter your reason</h3>
            <textarea
                placeholder="Veto reason"
                onChange={this.onChange}
                value={reason}
                name="reason"
            />
            <div className={classes.SubmitContainer}>
                {!disabled ? 
                    <div
                        className={classes.SubmitButton}
                        onClick = {() => this.props.confirm(reason)}
                        style={{background : "crimson"}}
                    >Veto Proposal</div> : 
                    <div
                        style={{background:"gray"}}
                        className={classes.SubmitButton}
                    >Please enter a reason</div>
                }
            </div>
        </div>
        )
    }
    
}

const ProposalDisplay = (props) => {
    const {proposal, clicked } = props;

    return(
        <div
            className={classes.ProposalDisplay}
            onClick={clicked}
        >
            <h3>{proposal.title}</h3>
            <span>{proposal.funding} DAI <img src={DAI}/></span>
            <p>{props.hoursLeft}H remaining</p>
        </div>
    )
}


class FundingDao extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading : true,
            proposing : false,
            proposals : [],
            vetoing : false,
        }
    }

    componentDidMount(){
        this.loadData();
    }

    loadData = () => {

    }

    proposeHandler = () => {
        // This is not very 'React' but it works for now
        document.body.style.height = "100vh";
        document.body.style.overflow = "hidden";
        this.setState({proposing:true});
    }

    confirmVeto = () => {
        // This is not very 'React' but it works for now
        document.body.style.height = "100vh";
        document.body.style.overflow = "hidden";
        this.setState({vetoing:true});
    }
    
    vetoHandler = reason => {
        const vetoID = Math.random().toString(36).substr(2, 9);
        // Save veto to database
        this.setState({vetoing:false});
    }
    
    dismissVetoHandler = () => {
        document.body.style.height = "100%";
        document.body.style.overflow = "auto";
        this.setState({vetoing:false});
    }

    dismissProposeHandler = () => {
        document.body.style.height = "100%";
        document.body.style.overflow = "auto";
        this.setState({proposing:false});
    }

    render(){
        const {loading, creatorAddress, selectedProposal, title, proposing, proposals, vetoing, proposalIDs } = this.state;
        const creator = (creatorAddress == this.props.selectedAddress);
        let veto;
        if(!creator){
            veto = (
                <div
                    onClick={this.confirmVeto}
                    className={classes.Veto}
                    >VETO
                </div>
            )
        }
        return(
            <React.Fragment>
            {loading ? <Loading /> :
                <React.Fragment>
                    {proposing && <ModalContainer>
                        <NewProposal
                            projectID={this.props.match.params.projectID}
                            dismiss={this.dismissProposeHandler}
                        />
                        </ModalContainer>}
                        {vetoing && <ModalContainer>
                        <Veto
                            confirm={reason => this.vetoHandler(reason)}
                            dismiss={this.dismissVetoHandler}
                        />
                        </ModalContainer>}
                <h2 style={{color: "var(--bold)", fontSize : "30px", marginTop : "5px"}}>{title} funding DAO</h2>
                <div className={classes.FundingDao}>
                    <div className={classes.ProposalSidebar}>
                        <div className={classes.Heading}>
                            <h3>Proposals</h3>
                            {creator && <span onClick = {this.proposeHandler}>+</span>}
                        </div>
                        {/* This is absolutely terrible change it when you're not about to fall asleep */}
                        {proposalIDs?.map(proposal => (<DirtyFixWrapper
                                                        key={proposal}
                                                        proposalID={proposal}
                                                        clicked={() => this.setState({selectedProposal : proposal})}
                                                    />))}
                    </div>
                    <div className={classes.Main}>
                        {
                            selectedProposal ? (
                                <DirtyFixWrapperDisplay proposalID={selectedProposal} veto={veto}/>
                            ) : (
                                <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100%"}}>
                                    <p style ={{fontSize:"25px", color:"var(--bold)", fontWeight: "600"}}>Please select a proposal</p>
                                </div>
                            )
                        }
                    </div>
                </div>
                </React.Fragment>
            }   
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    selectedAddress : state.selectedAddress,
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FundingDao));