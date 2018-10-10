import React from 'react';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import isEqual from 'react-fast-compare';
import { setMediaOnBoard } from '../../redux/socket-actions';
import Medium from './mediumContainer';

const cardSource = {
    beginDrag: (props) => ({...props})
};

const mapDispatchToProps = dispatch => {
    return {
        setMediaOnBoard: (media) => dispatch(setMediaOnBoard(media)),
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
        this.setState({ anchorEl: event.currentTarget });
        event.stopPropagation();
    };

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
        const imageSrc = this.props.medium.src || this.props.url + '/clipboard/uploads/' + this.props.medium.file;
        window.open(imageSrc, '_blank');
    }

    startDownload = (event) => {
        this.handleClose(event);
        this.downloadLinkRef.current.click();
    }

    render() {
        const { medium, url, isDragging, connectDragSource, style } = this.props;
        const { file, src } = medium;
        const { anchorEl } = this.state;
        const imageSrc = src || url + '/clipboard/uploads/' + file;

        return connectDragSource(
            <div style={style}>
                <Medium 
                    medium={medium} 
                    url={url} 
                    isDragging={isDragging} 
                    onClick={this.handleClick} 
                />
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.setMediaOnBoard}>Auf der Tafel anzeigen</MenuItem>
                    <MenuItem onClick={this.openWindow}>Im neuen Fenster öffnen</MenuItem>
                    <MenuItem onClick={this.startDownload}>Herunterladen</MenuItem>
                </Menu>
                <a 
                    ref={this.downloadLinkRef} 
                    href={imageSrc}
                    target="_blank"
                    download
                    style={{display:"none"}}
                />
            </div>
        );
    }
}