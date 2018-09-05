import React from 'react';
import { subscribeClipboardChanges, subscribeClipboardRefresh, refreshClipboard, onReconnect } from './api';
import Clipboard from './clipboard';
import MediaSelection from './mediaSelection';
import AppBar from './appBar';
import withDragDropContext from './withDragDropContext';
import SplitPane from "react-split-pane";

class ClipboardApp extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            images: [],
            media: {}
        };
        subscribeClipboardChanges((err, newImage) => this.setState({ 
          images: [...this.state.images, newImage]
        }));
        subscribeClipboardRefresh((err, images) => this.setState({images}));
        refreshClipboard();
        onReconnect(() => refreshClipboard());
    }

    render() {
        let flex = {
            flex: 1,
            display: "flex",
            flexDirection: "column"
        };
        let fullscreen = {
            position:"absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column"
        };
        return (
            <div style={fullscreen}>
                <AppBar/>
                <div style={{position: 'relative', height:'100%'}}>
                    <SplitPane split="horizontal" defaultSize={"80%"}>
                        <Clipboard />
                        <MediaSelection images={this.state.images} />
                    </SplitPane>
                </div>
            </div>
        );
    }
}

export default withDragDropContext(ClipboardApp);