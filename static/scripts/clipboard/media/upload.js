import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles={
    icon:{
      width: '100%',
      height: '100px',
    }
  };

@withStyles(styles)
export default class Upload extends React.Component {
    render() {
        const { classes, progress, name} = this.props;
        return <a href={this.props.src} className="media-container">
                    <FileIcon className={classes.icon + " media-icon"} fontSize="inherit"/>
                    <div className="media-info">{name}</div>
                    <LinearProgress variant="determinate" value={progress} />
                </a>;
    }
}
  

