import React from 'react';
import { connect } from 'react-redux';
import Medium from './medium.js';
import Dropzone from './dropzone.js';

class MediaSelection extends React.Component {

    onDrop(files) {
        this.props.uploadFiles(files);
    }

    render() {
        const { media, url, uploads } = this.props;
        if(!media) return null;
        return (
            <Dropzone>
                {media.map((medium) => 
                    <Medium key={medium.file} {...medium} url={url} />
                )}
                {Object.keys(uploads).map((key) => 
                    <Medium key={key} {...uploads[key]} />
                )}
            </Dropzone>
            );
    }
}

function mapStateToProps(state) {
    return {
        uploader: state.socket.uploader,
        uploads: state.socket.uploads,
        media: state.socket.clipboard.media,
        url: state.socket.url,
    };
}

export default connect(mapStateToProps)(MediaSelection);
