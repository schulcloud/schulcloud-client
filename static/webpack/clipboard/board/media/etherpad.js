import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';
import { connect } from 'react-redux';

const styles = {
    root: {
        width: '100%',
        height: '100%',
    },
};

@withStyles(styles)
@connect(({me}) => ({username: me.name}))
export default class Etherpad extends React.Component {
    static accepts(medium) {
        return medium
            && medium.type
            && (medium.type + "").toLowerCase() === "etherpad"
            && medium.src;
    }

    render() {
        const { classes, medium, username } = this.props;
        return <iframe className={classes.root} ref={this.myRef} src={medium.src + '&userName=' + username} />;
    }
}