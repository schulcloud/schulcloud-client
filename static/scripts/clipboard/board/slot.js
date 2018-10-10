import React from 'react';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { setMediaOnBoard } from '../redux/socket-actions';
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
    root: {
        display: 'flex'
    },
    empty: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    isOver:{
        background: "rgba(20,200,20,0.5)"
    },
    canDrop: {
        background: "rgba(200,200,20,0.5)"
    }
};

function mapStateToProps(state) {
    return {
        media: (state.socket.clipboard.board || {}).media,
        url: state.socket.url,
        layout: state.socket.clipboard.board.layout,
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
export default class Slot extends React.PureComponent {
    constructor(props) {
        super(props);    
        drop.drop = (droppedProps, monitor) => {
            props.setMediaOnBoard({
                slot: droppedProps.slotId, 
                media: monitor.getItem().medium
            });
        };
    }

    state = {
        hoverMedia: undefined
    }

    static getDerivedStateFromProps(props, state) {
        if(!props.isOver && state.hoverMedia) {
            if(props.canDrop || state.media !== props.media) {
                state.hoverMedia = undefined;
            }
        }
        state.media = props.media;
        return state;
    }

    componentDidUpdate() {
        if(this.props.isOver && !this.state.hoverMedia) {
            drop.hover = ((droppedProps, monitor) => {
                this.setState({hoverMedia:monitor.getItem().medium});
            });
        }
    }

    render() {
        const { connectDropTarget, isOver, canDrop, classes, style } = this.props;
        const { className, media, url, slotId, setMediaOnBoard } = this.props;
        const { hoverMedia } = this.state;
        const medium = hoverMedia || (media && media[slotId]);
        if(!connectDropTarget) return null;
        return connectDropTarget(
            <div 
                className={className + " " + classes.root}
                style={style}
            >
                {medium && <Media
                    media={medium}
                    preview={!!hoverMedia}
                    canDrop={canDrop}
                    isOver={isOver}
                    key={slotId}
                    slotId={slotId}
                    url={url}
                    onUpdate={setMediaOnBoard}
                />}
                {!medium && 
                    <div 
                        className={classes.empty + " " + ["", classes.canDrop, classes.isOver][isOver + canDrop]}
                    >
                        <h1>Hier Medium hinziehen</h1>
                    </div>
                }
            </div>
        );          
    }
}

