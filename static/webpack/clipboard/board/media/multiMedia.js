import React from 'react';
import ReactPlayer from 'react-player';
import Sync from '@material-ui/icons/Sync';
import NoSync from '@material-ui/icons/SyncDisabled';

export default class MultiMedia extends React.Component {

    static accepts(medium) {
        return medium 
            && medium.src
            && ReactPlayer.canPlay(medium.src);
    }

    static actions = [
        {
            icon: (medium) => medium.connected
                ? <Sync />
                : <NoSync />,
            update: (medium) => ({connected : !medium.connected}),
        }
    ]

    componentDidUpdate(prevProps) {
        if(prevProps.medium && this.props.medium && 
            !prevProps.medium.connected && this.props.medium.connected) {
            this.playerRef.current.seekTo(this.props.medium.progress);
        }
    }

    playerRef = React.createRef();

    render() {
        const { medium, onUpdate } = this.props;
        return (
            <ReactPlayer 
                url={medium.src} 
                ref={this.playerRef}
                width='100%'
                height='100%'
                playing={medium.connected ? medium.playing : undefined}
                controls={true}
                onPlay={() => medium.connected && onUpdate({playing: true})}
                onPause={() => medium.connected && onUpdate({playing: false})}
                onProgress={({played}) => onUpdate({progress: played})}
                progressInterval={1000}
            />
        );
    }
}