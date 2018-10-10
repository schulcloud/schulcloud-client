import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Image from './image';
import PDF from './pdf';
import YouTube from './youtube';
import Link from './link';
import File from '../../mediaSelection/media/file';
import MultiMedia from './multiMedia';

const styles = {
    media: {
        flex: 1,
        position: 'relative',
        backgroundColor: "rgba(0,0,0,0.6)",
        overflow: "hidden"
    },
};

@withStyles(styles)
export default class Media extends React.PureComponent {

    state={
        Medium: File
    }

    static getDerivedStateFromProps(props, state) {
        let {url, medium, setActions} = props;
        if(!medium) return null;
        medium.src = medium.src || url + '/clipboard/uploads/' + medium.file;

        let Medium = File;
        if(Image.accepts(medium)) Medium = Image;
        else if(MultiMedia.accepts(medium)) Medium = MultiMedia;
        else if(YouTube.accepts(medium)) Medium = YouTube;
        else if(PDF.accepts(medium)) Medium = PDF;
        else if(Link.accepts(medium)) Medium = Link;


        if(state.Medium !== Medium) {
            setActions(Medium.actions);
        }
        state.Medium = Medium;
        return state;
    }

    render() {
        let { url, medium, onUpdate, classes, preview } = this.props;

        let Medium = this.state.Medium;
        if(!Medium) return;

        return (
            <div className={classes.media}>
                <Medium 
                    url={url}
                    preview={preview}
                    medium={medium}
                    onUpdate={onUpdate}
                />
            </div>
        );
    }
}