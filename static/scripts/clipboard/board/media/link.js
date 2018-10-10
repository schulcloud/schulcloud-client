import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import QRCode from 'qrcode.react';

const styles = {
    root: {
        width: '100%',
        height: '100%',
        padding: 50,
        textAlign: 'center',
    },
    link: {
        color: "white",
        fontSize: "180%",
    }
};

@withStyles(styles)
export default class Link extends React.Component {

    render() {
        const { classes, src } = this.props;
        return <div className={classes.root} ref={this.myRef}>
            <a className={classes.link} href={src} target="_blank">{src}</a>
            <QRCode 
                renderAs="svg"
                value={src}
                size="100%"
            />
        </div>;
    }
}