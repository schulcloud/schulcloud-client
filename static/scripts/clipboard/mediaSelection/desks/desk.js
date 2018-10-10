import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Media from '../media';


const styles = {
    root: {
      width: '100%',
      height: 300,
      bottom: 0,
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      background: 'white',
    },
    fabLeft: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    }
};


@withStyles(styles)
@connect(({uploads, socket, desks}, {deskType, desk}) => ({
    uploads,
    url: socket.url,
    media: desks[deskType][desk].media
}))
export default class TeacherDesk extends React.PureComponent {
    render() {
        const { media, url, uploads } = this.props;
        if(!media) return null;
        return (
                <div className="media-row">
                    {media.map((medium) => 
                        <Media key={medium.id} medium={medium} url={url} />
                    )}
                    {Object.keys(uploads).map((key) => 
                        <Media key={key} medium={uploads[key]} upload={true} />
                    )}
                </div>
            );
    }
}
