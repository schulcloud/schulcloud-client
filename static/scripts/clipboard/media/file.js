import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import FileIcon, { defaultStyles } from 'react-file-icon';

const styles={
  icon:{
    width: '100%',
    height: '100px',
  }
};

class File extends React.Component {
    render() {
      const { classes, file, sender, src } = this.props;
      let ext = file.split(".").pop();
      let iconStyle = defaultStyles[ext];

      return <a href={src} className="media-container media-icon-container">
                <FileIcon {...iconStyle} extension={ext}/>
                <div className="media-info">{file}</div>
                <div className="media-info">{sender}</div>
            </a>;
    }
}

function mapStateToProps(state) {
  return {
      url: state.socket.url,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(File));