import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Media from '../media';
import Slide from '@material-ui/core/Slide';

const styles = (theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        zIndex: -2,
        overflowY: 'auto'
    },
    fabLeft: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    }
});


@withStyles(styles)
@connect(({uploads, socket, desks}) => ({
    uploads,
    url: socket.url,
    media: desks.deskType && desks.desk && (desks[desks.deskType][desks.desk] || {}).media
}))
export default class TeacherDesk extends React.PureComponent {
    render() {
        const { media, url, uploads, classes } = this.props;
        if(!media) return null;
        return (
                <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={300}>
                    <div className={classes.root}>
                        {media.map((medium) => 
                            <Media key={medium.id} medium={medium} url={url} />
                        )}
                        {Object.keys(uploads).map((key) => 
                            <Media key={key} medium={uploads[key]} upload={true} />
                        )}
                    </div>
                </Slide>
            );
    }
}
