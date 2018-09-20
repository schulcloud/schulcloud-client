import React from 'react';
import {
	DropTarget
} from 'react-dnd';
import { connect } from 'react-redux';
import { addToBoard, updateMediaOnBoard, removeMediaFromBoard } from './redux/socket-actions';
import mediaTypes from './media/mediaTypes';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Interactable from './interactable';

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
                {board && Object.keys(board).map((id) => {
                    const media = board[id];
                    return <div className = "clipboard-media"
                                key={id}>
                                <Interactable 
                                    src={url + '/clipboard/uploads/' + media.file}
                                    position={media.position}
                                    onUpdate={(pos) => {
                                        media.position = pos;
                                        updateMediaOnBoard(media);
                                }} />
                                <Button variant="fab" className={"delete-button"} onClick={() => this.props.removeMediaFromBoard(media)}>
                                    <DeleteIcon />
                                </Button>
                            </div>;
                })}
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
        updateMediaOnBoard: (media) => dispatch(updateMediaOnBoard(media)),
        removeMediaFromBoard: (media) => dispatch(removeMediaFromBoard(media))
    };
};

const ClipboardDropTarget = DropTarget(mediaTypes.Image, drop, collect)(Clipboard);
export default connect(mapStateToProps, mapDispatchToProps)(ClipboardDropTarget);