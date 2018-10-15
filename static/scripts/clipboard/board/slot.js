import React from 'react';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { setMediaOnBoard } from '../redux/actions/socket-send';
import Media from './media';
import isEqual from 'react-fast-compare';

const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
});

const drop = {
    drop(){}
};

const styles = {
    root: {
        display: 'flex',
        position: 'relative'
    },
    empty: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '5vmin',
    },
    isOver:{
        background: "rgba(20,200,20,0.5)",
        zIndex: 1200,
    },
    canDrop: {
        background: "rgba(200,200,20,0.5)",
        zIndex: 1200,
    }
};

function mapStateToProps(state, {slotId}) {
    return {
        medium: state.desks.currentDesk && state.desks.currentDesk.board.media[slotId],
        url: state.socket.url,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setMediaOnBoard: (media) => dispatch(setMediaOnBoard(media)),
    };
};

@DropTarget("MEDIA", drop, collect)
@connect(mapStateToProps, mapDispatchToProps)
@withStyles(styles)
export default class Slot extends React.Component {
    constructor(props) {
        super(props);    
        drop.drop = (droppedProps, monitor) => {
            props.setMediaOnBoard({
                slot: droppedProps.slotId, 
                media: monitor.getItem().medium
            });
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
    }

    render() {
        const { connectDropTarget, isOver, canDrop, classes, style } = this.props;
        const { className, medium, url, slotId, setMediaOnBoard } = this.props;
        if(!connectDropTarget) return null;
        return connectDropTarget(
            <div 
                className={className + " " + classes.root}
                style={style}
            >
                {medium && <Media
                    media={medium}
                    canDrop={canDrop}
                    isOver={isOver}
                    key={slotId}
                    slotId={slotId}
                    url={url}
                    onUpdate={setMediaOnBoard}
                />}
                {(!medium || canDrop) && 
                    <div 
                        className={classes.empty + " " + ["", classes.canDrop, classes.isOver][isOver + canDrop]}
                    >
                        <h1>Ziehe einen Inhalt hierhin, um ihn auf der Tafel anzuzeigen</h1>
                    </div>
                }
            </div>
        );          
    }
}

