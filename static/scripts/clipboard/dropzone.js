import React from 'react';
import Dropzone from 'react-dropzone';
import ImageCompressor from 'image-compressor.js';

class DropzoneComponent extends React.Component {
    constructor() {
      super();
      this.state = {
        dropzoneActive: false
      };
    }
  
    onDrop(files) {
      var onDrop = (file) => this.props.onDrop([file]);
      files.forEach((file) => {
        new ImageCompressor(file, {
            quality: .8,
            maxWidth: 1920,
            success: onDrop,
            error(e) {
              console.log(e.message);
            },
          });
      }, this);
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
            style={{}}
            className={this.props.className}
        >
          {this.props.children}
          {dropzoneActive || <div className="drop-thumbnail">
            <i className="fa fa-2x fa-share-square-o icon" aria-hidden="true"></i>
            Datei hinzufügen oder ablegen
          </div>}
          {dropzoneActive && <div className="drop-thumbnail dropping">
            Ja genau hier!
          </div>}
        </Dropzone>
      );
    }
  }

  export default DropzoneComponent;