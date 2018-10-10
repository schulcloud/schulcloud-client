import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import QRCode from 'qrcode.react';
import SvgIcon from '@material-ui/core/SvgIcon';
import QrIcon from 'svg-react-loader!./qr.svg';
import IFrameIcon from '@material-ui/icons/OpenInBrowser';
const styles = {
    root: {
        width: '100%',
        height: '100%',
        padding: 50,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
    },
    link: {
        color: "white",
        fontSize: "180%",
        paddingBottom: 10
    }
};

@withStyles(styles)
export default class Link extends React.Component {

    static accepts(medium) {
        return medium
            && medium.type
            && (medium.type + "").toLocaleLowerCase() === "link"
            && medium.src;
    }

    static actions = {
        qr: () => <SvgIcon><QrIcon/></SvgIcon>,
        iframe: () => <IFrameIcon />,
    }

    render() {
        const { classes, medium } = this.props;
        return <div className={classes.root} ref={this.myRef}>
            <a className={classes.link} href={medium.src} target="_blank">{medium.src}</a>
            <QRCode 
                renderAs="svg"
                value={medium.src}
                size="100%"
            />
        </div>;
    }
}