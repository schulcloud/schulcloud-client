import React from 'react';
import {
	DropTarget
} from 'react-dnd';
import { connect } from 'react-redux';
import { selectMedia } from './redux/socket-actions';
import mediaTypes from './media/mediaTypes';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Typography from '@material-ui/core/Typography';

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
            props.selectMedia(monitor.getItem().img);
        };
    }

    render() {
        const { connectDropTarget, selected, url } = this.props;
        if(!connectDropTarget) return null;
        return (
            connectDropTarget(<div className="clipboard">
                <div className = "clipboard-media">
                <ReactCSSTransitionGroup
                    transitionName="clipboard-transition"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={1000}
                    className="clipboard-transition-container"
                    >

                    {selected && selected.type === "image" && <img 
                        className = "clipboard-image"
                        key = {selected.file}
                        src = {url + '/clipboard/uploads/' + selected.file}
                    />}

                    {selected && selected.type === "link" &&
                        <Paper elevation={1}>
                            <Typography variant="headline" component="h3">
                            Link
                            </Typography>
                            <Typography component="p">
                                <a href={selected.link} target="_blank">{selected.link}</a>
                            </Typography>
                        </Paper>
                    }
                    </ReactCSSTransitionGroup>
                </div>
            </div>)          
        );
    }
}

function mapStateToProps(state) {
    return {
        selected: state.socket.clipboard.selected,
        url: state.socket.url
    };
}

const mapDispatchToProps = dispatch => {
    return {
        selectMedia: (media) => dispatch(selectMedia(media))
    };
};

const ClipboardDropTarget = DropTarget(mediaTypes.Image, drop, collect)(Clipboard);
export default connect(mapStateToProps, mapDispatchToProps)(ClipboardDropTarget);