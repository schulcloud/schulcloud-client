import React from 'react';
import {
	DropTarget
} from 'react-dnd';
import { connect } from 'react-redux';
import { addToBoard, updateMediaOnBoard } from './redux/socket-actions';
import mediaTypes from './media/mediaTypes';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Typography from '@material-ui/core/Typography';
import Interactable from './interactable';

import Paper from '@material-ui/core/Paper';

const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
});

const drop = {
    drop(){}
};

class Clipboard extends React.PureComponent {
    constructor(props) {
        super(props);
    
        drop.drop = (props, monitor) => {
            props.addToBoard(monitor.getItem().img);
        };
    }

    update(id, style) {
        const media = {
            ...this.props.board[id],
            style : {...style}
        };
        this.props.updateMediaOnBoard(media);
    }

    render() {
        const { connectDropTarget, board, url } = this.props;
        if(!connectDropTarget) return null;
        return (
            connectDropTarget(<div className="clipboard">
                <div className = "clipboard-media">
                {board && Object.keys(board).map((id) => {
                    const media = board[id];
                    media.style = media.style || {};
                    const mediaStyle = {
                        width: media.style.width, 
                        height: media.style.height,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        transform: 'translate(' + (media.style.x || 0) + 'px,' + 
                                                  (media.style.y || 0) + 'px)'
                    };
                    
                    return <Interactable 
                        key={id}
                        currentPos={media.style}
                        onUpdate={(style) => this.update(id, {
                            x: media.style.x + style.dx, 
                            y: media.style.y + style.dy,
                            width: media.style.width || style.width,
                            height: media.style.height || style.height})}>
                            <img style={mediaStyle} src={url + '/clipboard/uploads/' + media.file} />
                    </Interactable>;
                })
                }
                </div>
            </div>)          
        );
    }
}

function mapStateToProps(state) {
    return {
        board: state.socket.clipboard.board,
        url: state.socket.url
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addToBoard: (media) => dispatch(addToBoard(media)),
        updateMediaOnBoard: (media) => dispatch(updateMediaOnBoard(media))
    };
};

const ClipboardDropTarget = DropTarget(mediaTypes.Image, drop, collect)(Clipboard);
export default connect(mapStateToProps, mapDispatchToProps)(ClipboardDropTarget);