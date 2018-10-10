import React from 'react';
import { withStyles } from '@material-ui/core';

import Thumbnail from './thumbnail';

const styles = theme => ({
    root:{
        backgroundColor: theme.palette.primary.main,
        borderRadius: 5,
        maxWidth: 150,
        minWidth: 150,
        margin: 5,
        paddingBottom: 5,
        color: 'white',
        textAlign: 'center',
        overflow: 'hidden',
        cursor: 'grab',
        transition: 'box-shadow .2s ease-in, transform .1s ease-in',
        transform: 'scale(1)',
        boxShadow: '.8px .9px 3px grey',
        '&:hover' : {
            backgroundColor: theme.palette.secondary.main,
            boxShadow: '1px 8px 20px grey',
            transform: 'scale(1.01)',
        }
    },
    isDragging: {
        opacity: 0.5 
    }
});

@withStyles(styles)
export default class MediumContainer extends React.PureComponent {
    render() {
        const { medium, url, isDragging, progress, classes, onClick } = this.props;

        return  <div 
                    className={classes.root + (isDragging ? ' ' + classes.isDragging : '')}
                    onClick={onClick}
                >
                    <Thumbnail 
                        medium={medium} 
                        url={url} 
                        infoClassName={classes.info}
                    />
                    {progress !== undefined && 
                        <LinearProgress variant="determinate" value={progress} />
                    }
                </div>;
    }
}