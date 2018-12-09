import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import SvgIcon from '@material-ui/core/SvgIcon';
import IFrameIcon from '@material-ui/icons/OpenInBrowser';
import QRCode from 'qrcode.react';
import React from 'react';
import QrIcon from 'svg-react-loader!./qr.svg';
const styles = {
    root: {
        width: '100%',
        height: '100%',
    },
    qr:{
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
            && (medium.type + "").toLowerCase().indexOf("link") >= 0
            && medium.src;
    }

    static actions = [
        {
            icon: (medium) => medium.qr
                ? <IFrameIcon />
                : <SvgIcon><QrIcon/></SvgIcon>,
            update: (medium) => ({qr : !medium.qr}),
        }
    ]

    render() {
        const { classes, medium } = this.props;
        if(medium.qr) {
            return <div className={classNames(classes.root,classes.qr)} ref={this.myRef}>
                <a className={classes.link} href={medium.src} target="_blank">{medium.src}</a>
                <QRCode 
                    renderAs="svg"
                    value={medium.src}
                    size="100%"
                />
            </div>;
        } else {
            return (
                <iframe className={classes.root} ref={this.myRef} src={medium.src} />
            );
        }
    }
}