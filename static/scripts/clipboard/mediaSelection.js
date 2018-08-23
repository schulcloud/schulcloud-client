import React from 'react';
import Image from './media/image.js';
import Dropzone from './dropzone';
import {broadcastNewImage} from './api';

class MediaSelection  extends React.Component {
    constructor(props) {
      super(props);
    }
    
    onDrop(files) {
        broadcastNewImage(files);
    }

    render() {
        return (
            <div className="media-row">
                {this.props.images.map((img) => 
                    <Image key={img.file} img={img} />
                )}
                <Dropzone onDrop={(file) => this.onDrop(file)}>
                </Dropzone>
            </div>
            );
    }
}

export default MediaSelection;
