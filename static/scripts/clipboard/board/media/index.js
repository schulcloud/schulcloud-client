import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import Image from './image';
import PDF from './pdf';
import YouTube from './youtube';
import Link from './link';
import File from '../mediaSelection/media/file';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import isEqual from 'react-fast-compare';

const styles = {
    media: {
        flex: 1,
        position: 'relative',
        backgroundColor: "rgba(0,0,0,0.6)",
        overflow: "hidden"
    },
    fullscreen: {
        position: 'fixed',
        top:0,
        bottom:0,
        left:0,
        right:0,
        zIndex: 1200
    },
    flexParent:{
        display: 'flex',
        flexDirection: 'column',
    }
};

@withStyles(styles)
export default class Media extends React.Component {

    state = {
        fullscreen: false
    }

    divRef = React.createRef();

    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
    }

    onRemove = () => {
        this.props.onUpdate({
            slot: this.props.slotId, 
            media: null
        });
    }
    
    fullscreenToggle = () => {
        this.setState({fullscreen: !this.state.fullscreen});
        if(!this.state.fullscreen) {
            this.divRef.current.webkitRequestFullScreen();
            document.onwebkitfullscreenchange = () => {
                if(!document.webkitFullscreenElement) {
                    this.setState({fullscreen: false});
                }
            };
        } else {
            document.webkitCancelFullScreen();
        }
    }

    render() {
        let {url, media, onUpdate, classes, className, slotId, canDrop, isOver, preview} = this.props;
        let {fullscreen} = this.state;

        let mime = (media.type || {}).mime || "";
        
        let Medium = File;
        if(mime.indexOf("image") >= 0) {
            Medium = Image;
        } else if(mime.indexOf("link") >= 0) {
            Medium = Link;
        } else if (mime.indexOf("pdf") >= 0) {
            Medium = PDF;
        } else if (mime.indexOf("youtube") >= 0) {
            Medium = YouTube;
        }
        return <div 
                    className={`${classes.media} ${classes.flexParent} ${className} ` + (fullscreen ? classes.fullscreen: '')}
                    ref={this.divRef}
                >
                    <AppBar color={["secondary", "default", "primary"][canDrop + isOver]} position="static">
                        <Toolbar variant="dense">
                            <Typography variant="subtitle1" color="inherit">
                                {media.name} | {media.sender}
                            </Typography>
                            <div style={{flex:1}} />
                            <IconButton 
                                color="inherit"
                                aria-label="Medium von Tafel nehmen"
                                onClick={this.fullscreenToggle}
                            >
                                {fullscreen
                                    ?<FullscreenExitIcon />
                                    :<FullscreenIcon />
                                }
                            </IconButton>
                            <IconButton 
                                color="inherit"
                                aria-label="Medium von Tafel nehmen"
                                onClick={this.onRemove}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <div className={classes.media}>
                        <Medium 
                            src={url + '/clipboard/uploads/' + media.file}
                            preview={preview}
                            {...media}
                            onUpdate={(change) => {
                                onUpdate({
                                    slot: slotId,
                                    media: {
                                        ...media,
                                        ...change
                                    }
                                });
                            }}
                            onClick={() => window.open(url + '/clipboard/uploads/' + media.file)}
                        />
                    </div>
                </div>;
    }
}