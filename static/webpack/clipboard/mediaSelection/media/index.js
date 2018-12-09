import React from 'react';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import isEqual from 'react-fast-compare';
import { setMediaOnBoard, deleteMedia } from '../../redux/actions/socket-send';
import Medium from './mediumContainer';

const cardSource = {
    beginDrag: (props) => ({...props})
};

const mapDispatchToProps = dispatch => {
    return {
        setMediaOnBoard: (media) => dispatch(setMediaOnBoard(media)),
        deleteMedia: (id) => dispatch(deleteMedia(id)),
    };
};

@DragSource("MEDIA", cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
@connect(null, mapDispatchToProps)
export default class MenuDecorator extends React.Component {
    constructor(props) {
        super(props);
        this.downloadLinkRef = React.createRef();
    }

    state = {
        anchorEl: null,
    };

    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
    }

    handleClick = event => {
        if(this.state.singleClickWait) return;
        let target = event.currentTarget;
        let singleClickWait = setTimeout(() => this.openMenu(target), 200);
        this.setState({singleClickWait});
        event.stopPropagation();
    };

    openMenu = target => {
        this.setState({ anchorEl: target, singleClickWait: false });
    }

    handleDoubleClick = event => {
        if(this.state.singleClickWait) {
            clearTimeout(this.state.singleClickWait);
            this.setState({singleClickWait: false});
        }
        this.setMediaOnBoard(event);
    }

    handleClose = (event) => {
        this.setState({ anchorEl: null });
        event.stopPropagation();
    };

    setMediaOnBoard = (event) => {
        this.handleClose(event);
        this.props.setMediaOnBoard({media: this.props.medium});
    }

    openWindow = (event) => {
        this.handleClose(event);
        window.open(this.props.medium.src, '_blank');
    }

    startDownload = (event) => {
        this.handleClose(event);
        this.downloadLinkRef.current.click();
    }

    delete = (event) => {
        this.handleClose(event);
        this.props.deleteMedia(this.props.medium.id);
    }

    render() {
        const { medium, url, isDragging, connectDragSource, style } = this.props;
        const { src } = medium;
        const { anchorEl } = this.state;

        return connectDragSource(
            <div style={style}>
                <Medium 
                    medium={medium} 
                    url={url} 
                    isDragging={isDragging} 
                    onClick={this.handleClick} 
                    onDoubleClick={this.handleDoubleClick}
                />
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.setMediaOnBoard}>Auf der Arbeitsfläche öffnen</MenuItem>
                    <MenuItem onClick={this.openWindow}>Im neuen Fenster öffnen</MenuItem>
                    <MenuItem onClick={this.startDownload}>Herunterladen</MenuItem>
                    <MenuItem onClick={this.delete}>Löschen</MenuItem>
                </Menu>
                <a 
                    ref={this.downloadLinkRef} 
                    href={src}
                    target="_blank"
                    download
                    style={{display:"none"}}
                />
            </div>
        );
    }
}