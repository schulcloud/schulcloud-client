import React from 'react';
import ReactPlayer from 'react-player';

export default class MultiMedia extends React.Component {

    static accepts(medium) {
        return medium 
            && medium.src
            && ReactPlayer.canPlay(medium.src);
    }

    render() {
        const { medium, preview, onUpdate } = this.props;
        if(!preview) {
            return (
                <ReactPlayer 
                    url={medium.src} 
                    width='100%'
                    height='100%'
                    playing={medium.playing}
                    controls={true}
                    onPlay={() => onUpdate({playing: true})}
                    onPause={() => onUpdate({playing: false})}
                    onError={() => onUpdate({playing: false})}
                    onProgress={({played}) => onUpdate({progress: played})}
                    progressInterval={10000}
                />
            );
        } else {
            return null;
        }
    }
}