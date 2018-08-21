import React from 'react';
import { subscribeClipboardChanges, subscribeClipboardRefresh, refreshClipboard, onReconnect } from './api';
import Clipboard from './clipboard';
import MediaSelection from './mediaSelection';
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
        return (
            <SplitPane split="horizontal" defaultSize={"80%"}>
                <Clipboard />
                <MediaSelection images={this.state.images} />
            </SplitPane>          
        );
    }
}

export default withDragDropContext(ClipboardApp);