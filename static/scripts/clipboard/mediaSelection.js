import React from 'react';
import { connect } from 'react-redux';
import Image from './media/image.js';
import Dropzone from './dropzone';
import {broadcastNewImage} from './api';

class MediaSelection  extends React.Component {
    constructor(props) {
      super(props);
    }
    
    onDrop(files) {
        broadcastNewImage(files, this.props.socket);
    }

    render() {
        const { media } = this.props;
        if(!media) return null;
        return (
            <div className="media-row">
                {media.map((img) => 
                    <Image key={img.file} img={img} />
                )}
                <Dropzone onDrop={(file) => this.onDrop(file)}>
                </Dropzone>
            </div>
            );
    }
}

function mapStateToProps(state) {
    return {
        socket: state.socket.socket,
        media: state.socket.clipboard.media
    };
}
  
export default connect(mapStateToProps)(MediaSelection);
