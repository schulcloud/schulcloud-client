import React from 'react';
import {
	DropTarget
} from 'react-dnd';
import {subscribeClipboardPush, pushToClipboard} from './api';
import mediaTypes from './media/mediaTypes';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
});

const drop = {
    drop(){}
};

class Clipboard extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            img: {}
        };
        
        drop.drop = (props, monitor) => {
            this.setState({img: monitor.getItem().img});
            pushToClipboard(monitor.getItem().img);
        };

        subscribeClipboardPush((err, media) => this.setState({img: media}));
    }

    render() {
        const { connectDropTarget } = this.props;
        return (
            connectDropTarget &&
            connectDropTarget(<div className="clipboard">
                <div className = "clipboard-media">
                <ReactCSSTransitionGroup
                    transitionName="clipboard-transition"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={1000}
                    className="clipboard-transition-container"
                    >

                    <img 
                        className = "clipboard-image"
                        key = {this.state.img.file}
                        src = {window.websocketUrl + '/clipboard/uploads/' + this.state.img.file}
                    />
                    </ReactCSSTransitionGroup>
                </div>
            </div>)          
        );
    }
}

export default DropTarget(mediaTypes.Image, drop, collect)(Clipboard);