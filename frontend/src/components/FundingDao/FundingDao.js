import React from 'react';
import classes from './FundingDao.module.css';
import { withFirebase } from '../../firebase/index';
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
        this.props.firebase.project(this.props.projectID)
            .child("proposals")
            .child(proposalID)
            .set(proposalID);
        
        this.props.firebase.proposals().child(proposalID).set(proposal);

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
    const timeNow = new Date();
    const timeCreated = new Date(proposal.timeCreated);
    const hoursLeft = 48 - Math.floor((timeNow - timeCreated) / 1000 / 60 / 60);
    return(
        <div
            className={classes.ProposalDisplay}
            onClick={clicked}
        >
            <h3>{proposal.title}</h3>
            <span>{proposal.funding} DAI <img src={DAI}/></span>
            <p>{hoursLeft}H remaining</p>
        </div>
    )
}


class FundingDao extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading : true,
            selectedProposal : null,
            proposing : false,
            proposals : [],
            vetoing : false,
        }
    }

    componentDidMount(){
        this.loadData();
    }

    loadData = () => {
        this.props.firebase.project(this.props.match.params.projectID).on("value", snap => {
            const data = snap.val();
            this.setState({
                ...this.state,
                ...data,
                proposals : [],
            });
            if(data.proposals){
                const proposalIDs = [...Object.keys(data.proposals)];
                this.loadProposals(proposalIDs);
            } else {
                this.setState({loading : false})
            }   
        })
    }

    loadProposals = (proposalIDs) => {
        console.log("PROPOSALS: ", this.state.proposals)
        proposalIDs.forEach(propID => {
            let proposals = [...this.state.proposals];
            this.props.firebase.proposal(propID).once("value", snap => {
                const data = snap.val();
                const proposal = {
                    ...data,
                    id : propID,
                }
                proposals.push(proposal);
                this.setState({proposals : proposals, loading : false});
            })
        })
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
        this.props.firebase.proposal(this.state.selectedProposal.id).child("vetoes").set(this.state.selectedProposal.vetoes + 1);
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
        const {loading, creatorAddress, selectedProposal, title, proposing, proposals, vetoing } = this.state;
        const creator = (creatorAddress == this.props.selectedAddress);
        console.log(proposals);
        let hoursLeft = null;
        let veto = null;
        if(selectedProposal){
            const timeNow = new Date();
            const timeCreated = new Date(selectedProposal.timeCreated);
            hoursLeft = 48 - Math.floor((timeNow - timeCreated) / 1000 / 60 / 60);
        }
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
                            firebase = {this.props.firebase}
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
                        {proposals.map(proposal => (<ProposalDisplay
                                                        key={proposal.title}
                                                        proposal={proposal}
                                                        clicked={() => this.setState({selectedProposal : proposal})}
                                                    />))}
                    </div>
                    <div className={classes.Main}>
                        {
                            selectedProposal ? (
                                <div className={classes.ProposalShow}>
                                    <h2>{selectedProposal.title}</h2>
                                    <h4>{hoursLeft}H remaining to vote</h4>
                                    <br/>
                                    <h4>Requesting {selectedProposal.funding} <img src={DAI}/> DAI </h4>
                                    <p>{selectedProposal.body}</p>
                                    {veto}
                                    <div className={classes.Vetoes}>Vetoed {selectedProposal.vetoes} times</div>
                                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withFirebase(withRouter(FundingDao)));