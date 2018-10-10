import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';

import Medium from './medium';

const styles = {
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
        width: '100%',
    }
};

@withStyles(styles)
export default class Media extends React.Component {

    state = {
        fullscreen: false
    }

    divRef = React.createRef();

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

    updateMedia = (change) => {
        this.props.onUpdate({
            slot: this.props.slotId,
            media: {
                ...this.props.media,
                ...change
            }
        });
    };

    setActions = (actions) => {
        this.setState({actions});
    } 

    render() {
        let {url, media, classes, className, canDrop, isOver, preview} = this.props;
        let {fullscreen} = this.state;

        return <div 
                    className={classNames(classes.media, classes.flexParent, className, {[classes.fullscreen]: fullscreen})}
                    ref={this.divRef}
                >
                    <AppBar color={["secondary", "default", "primary"][canDrop + isOver]} position="static">
                        <Toolbar variant="dense">
                            <Typography variant="subtitle1" color="inherit">
                                {media.name} | {media.sender}
                            </Typography>
                            <div style={{flex:1}} />
                            {Object.keys(this.state.actions || {}).map((action) => 
                                <IconButton
                                    key={action}
                                    color="inherit"
                                    aria-label={action}
                                    onClick={() => this.updateMedia({[action]: !media[action]})}
                                >
                                    {this.state.actions[action]()}
                                </IconButton>
                            )}
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
                    <Medium 
                        url={url}
                        preview={preview}
                        medium={media}
                        onUpdate={this.updateMedia}
                        setActions={this.setActions}
                    />
                </div>;
    }
}