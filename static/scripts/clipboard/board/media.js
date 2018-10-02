import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Image from './image';
import File from '../mediaSelection/file';
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
    },
    flexParent:{
        display: 'flex',
        flexDirection: 'column',
    }
};

@withStyles(styles)
export default class Media extends React.Component {

    shouldComponentUpdate(nextProps) {
        return !isEqual(this.props, nextProps);
    }

    render() {
        let {url, media, onUpdate, onRemove, classes} = this.props;

        let mimeType = ((media.type || {}).mime || "").split('/')[0];
        
        const Medium = {
            'image': Image
        }[mimeType] || File;

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
                    
                        <Medium 
                            src={url + '/clipboard/uploads/' + media.file}
                            {...media}
                            onUpdate={(style) => {
                                media.style = style;
                                onUpdate(media);
                            }}
                            onClick={() => window.open(url + '/clipboard/uploads/' + media.file)}
                        />
                    </div>
                </div>;
    }
}