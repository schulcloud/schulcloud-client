import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Interactable from './interactable';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

const styles = {
    media: {
        flex: 1,
        position: 'relative',
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    flexParent:{
        display: 'flex',
        flexDirection: 'column',
    }
};

@withStyles(styles)
export default class Media extends React.PureComponent {
    render() {
        let {url, media, onUpdate, onRemove, classes} = this.props;
        return <div className={`${classes.media} ${classes.flexParent}`}>
                    <AppBar color="secondary" position="static">
                        <Toolbar variant="dense">
                            <IconButton 
                                color="inherit"
                                aria-label="Menu"
                                onClick={() => onRemove(media)}
                            >
                                <DeleteIcon />
                            </IconButton>
                            <Typography variant="subheading" color="inherit">
                                {media.file} | {media.sender}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <div className={classes.media}>
                        <Interactable 
                            src={url + '/clipboard/uploads/' + media.file}
                            position={media.position}
                            onUpdate={(pos) => {
                                media.position = pos;
                                onRemove(media);
                            }}
                        />
                    </div>
                </div>;
    }
}