import React from 'react';
import { subscribeClipboardChanges, subscribeClipboardRefresh, refreshClipboard, onReconnect } from './api';
import Clipboard from './clipboard';
import MediaSelection from './mediaSelection';
import withDragDropContext from './withDragDropContext';

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
            <div style={flex}>
                <Clipboard />
                <MediaSelection images={this.state.images} />
            </div>            
        );
    }
}

export default withDragDropContext(ClipboardApp);