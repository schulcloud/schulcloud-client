import React from 'react';
import Image, {IMAGE} from './image';
import File, {FILE} from './file';
import {CLIPBOARD_COMPATIBLE} from './mediaTypes';
import { DragSource } from 'react-dnd';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import isEqual from 'react-fast-compare';

const cardSource = {
    beginDrag: (props) => ({...props})
};

@DragSource(CLIPBOARD_COMPATIBLE, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
export default class Medium extends React.Component {
    state = {
        anchorEl: null,
    };

    shouldComponentUpdate(nextProps) {
        return !isEqual(this.props, nextProps);
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
        event.stopPropagation();
    };

    handleClose = (event) => {
        this.setState({ anchorEl: null });
        event.stopPropagation();
    };

    render() {
        const { type, file, sender, url, src, onClick, progress, isDragging, connectDragSource } = this.props;
        const { anchorEl } = this.state;
        const imageSrc = src || url + '/clipboard/uploads/' + file;
        let mimeType = ((type || {}).mime || "").split('/')[0];
        
        const Thumbnail = {
            [IMAGE]: Image
        }[mimeType] || File;

        return connectDragSource(
            <div>
                <div className="media-container draggable"
                    style={{ opacity: isDragging ? 0.5 : 1 }} 
                    onClick={this.handleClick}>
                    <Thumbnail {...this.props} src={imageSrc} />
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
                    <MenuItem onClick={this.handleClose}>Auf der Tafel anzeigen</MenuItem>
                    <MenuItem onClick={this.handleClose}>Extern öffnen</MenuItem>
                </Menu>
            </div>
        );
    }
}