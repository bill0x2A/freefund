import React from 'react';
import { connect } from 'react-redux';


class Messages extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {

        }
    }

    // Access user address with this.props.user.address

    render(){
        return (
            <div></div>
        )
    }
}

const mapStateToProps = state => ({
    user : state.user,
})


export default connect(mapStateToProps)(Messages)