import React from 'react';
import { connect } from 'react-redux';
import Medium from './media/medium.js';
import Upload from './media/upload.js';
import Dropzone from './dropzone';
import {uploadFiles} from './redux/socket-actions';

class MediaSelection  extends React.Component {

    onDrop(files) {
        this.props.uploadFiles(files);
    }

    render() {
        const { media, url, uploads } = this.props;
        if(!media) return null;
        return (
            <div className="media-row">
                {media.map((medium) => 
                    <Medium key={medium.file} {...medium} url={url} />
                )}
                {Object.keys(uploads).map((key) => 
                    <Upload key={key} {...uploads[key]} />
                )}
                <Dropzone onDrop={(file) => this.onDrop(file)}>
                </Dropzone>
            </div>
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

const mapDispatchToProps = {
    uploadFiles: (files) => uploadFiles(files)
};

export default connect(mapStateToProps, mapDispatchToProps)(MediaSelection);
