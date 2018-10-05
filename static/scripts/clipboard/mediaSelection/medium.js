import React from 'react';
import { connect } from 'react-redux';
import Image, {IMAGE} from './image';
import File, {FILE} from './file';
import {CLIPBOARD_COMPATIBLE} from './mediaTypes';
import { DragSource } from 'react-dnd';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import isEqual from 'react-fast-compare';
import { addToBoard } from '../redux/socket-actions';

const cardSource = {
    beginDrag: (props) => ({...props})
};

const mapDispatchToProps = dispatch => {
    return {
        addToBoard: (media) => dispatch(addToBoard(media)),
    };
};

@DragSource(CLIPBOARD_COMPATIBLE, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
@connect(null, mapDispatchToProps)
export default class Medium extends React.Component {
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

    addToBoard = (event) => {
        this.handleClose(event);
        this.props.addToBoard(this.props.medium);
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
        const { medium, url, onClick, isDragging, connectDragSource, style } = this.props;
        const { type, file, sender, src, progress } = medium;
        const { anchorEl } = this.state;
        const imageSrc = src || url + '/clipboard/uploads/' + file;
        let mimeType = ((type || {}).mime || "").split('/')[0];
        
        const Thumbnail = {
            [IMAGE]: Image
        }[mimeType] || File;

        return connectDragSource(
            <div style={style}>
                <div className="media-container draggable"
                    style={{ opacity: isDragging ? 0.5 : 1 }} 
                    onClick={this.handleClick}>
                    <Thumbnail {...medium} src={imageSrc} />
                    <div className="media-info">{file}</div>
                    <div className="media-info">{sender}</div>
                    {progress !== undefined && 
                        <LinearProgress variant="determinate" value={progress} />
                    }
                </div>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.addToBoard}>Auf der Tafel anzeigen</MenuItem>
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