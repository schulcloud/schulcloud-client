import React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import {uploadFiles} from './redux/socket-actions';

class DropzoneComponent extends React.Component {
    constructor() {
      super();
      this.state = {
        dropzoneActive: false
      };
    }
  
    onDrop(files) {
      this.props.uploadFiles(files);
      this.setState({dropzoneActive: false});
    }

    onDragEnter() {
        this.setState({
          dropzoneActive: true
        });
      }
    
    onDragLeave() {
        this.setState({
            dropzoneActive: false
        });
    }
  
    render() {
      const { dropzoneActive } = this.state;
      return (
        <Dropzone 
            onDrop={this.onDrop.bind(this)}
            onDragEnter={this.onDragEnter.bind(this)}
            onDragLeave={this.onDragLeave.bind(this)}
            className="media-row"
            style={{}}
        >
          {dropzoneActive || this.props.children}
          {dropzoneActive && <div className="drop-thumbnail dropping">
            Dateien hier ablegen!
          </div>}
        </Dropzone>
      );
    }
  }

const mapDispatchToProps = {
    uploadFiles: (files) => uploadFiles(files)
};

export default connect(null, mapDispatchToProps)(DropzoneComponent);