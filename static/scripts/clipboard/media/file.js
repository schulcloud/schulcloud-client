import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import FileIcon from '@material-ui/icons/InsertDriveFile';

const styles={
  icon:{
    width: '100%',
    height: '100px',
  }
};

class File extends React.Component {
    render() {
      const { classes } = this.props;
      return <a href={this.props.src} className="media-container">
                <FileIcon className={classes.icon + " media-icon"} fontSize="inherit"/>
                <div className="media-info">{this.props.file}</div>
                <div className="media-info">{this.props.sender}</div>
            </a>;
    }
}

function mapStateToProps(state) {
  return {
      url: state.socket.url,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(File));