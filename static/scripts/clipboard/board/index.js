import React from 'react';
import {
	DropTarget
} from 'react-dnd';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { addToBoard, updateMediaOnBoard, removeMediaFromBoard } from '../redux/socket-actions';
import {CLIPBOARD_COMPATIBLE} from '../media/mediaTypes';
import Media from './media';

const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
});

const drop = {
    drop(){}
};

const styles = {
    root:{
        background: `#FFF url(/images/clipboard/background.jpg) no-repeat center center fixed`,
        backgroundSize: "cover",
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "row"
    }
};

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


@DropTarget(CLIPBOARD_COMPATIBLE, drop, collect)
@connect(mapStateToProps, mapDispatchToProps)
@withStyles(styles)
export default class Clipboard extends React.PureComponent {
    constructor(props) {
        super(props);
    
        drop.drop = (droppedProps, monitor) => {
            props.addToBoard(monitor.getItem());
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
        const { connectDropTarget, board, url, classes } = this.props;
        if(!connectDropTarget) return null;
        return (
            connectDropTarget(<div className={`clipboard ${classes.root}`}>
                {board && Object.keys(board).map((id) => {
                    const media = board[id];
                    return <Media 
                                media={media}
                                key={id}
                                url={url}
                                onUpdate={updateMediaOnBoard}
                                onRemove={removeMediaFromBoard}
                            />;
                })}
            </div>)          
        );
    }
}

