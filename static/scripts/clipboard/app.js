import React from 'react';
import { connect } from 'react-redux';
import Board from './board';
import MediaSelection from './mediaSelection';
import AppBar from './appBar';
import withDragDropContext from './withDragDropContext';
import { initializeSocket } from './redux/socket-reducer.js';

class ClipboardApp extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            images: [],
            media: {},
            fullscreen: true,
        };
    }

    componentWillMount() {
        const { dispatch, backendUrl, courseId } = this.props;
        const settings =  {
            query: "courseId=" + courseId,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax : 5000,
            reconnectionAttempts: Infinity
        };
        dispatch(initializeSocket(backendUrl, 'clipboard', settings));
    }

    toggleFullscreen = () => {
        this.setState({fullscreen: !this.state.fullscreen});
    }

    render() {
        let { fullscreen } = this.state;
        let fullscreenStyle = {
            position:"fixed",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column"
        };
        let normalStyle = {
            ...fullscreenStyle,
            position:"absolute"
        };
        const { connected } = this.props;
        return (
            <div style={fullscreen ? fullscreenStyle : normalStyle}>    
                <AppBar onToggleFullscreen={this.toggleFullscreen}  connected={connected}/>
                <div style={{position: 'relative', height:'100%', display:'flex', flexDirection:'column'}}>
                    <Board />
                    <MediaSelection />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        connected: state.socket.connected,
        clipboard: state.socket.clipboard
    };
}
  
export default connect(mapStateToProps)(withDragDropContext(ClipboardApp));