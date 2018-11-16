import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import FileIcon, { defaultStyles } from 'react-file-icon';

const styles = {
    root: {
        padding: 50,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 100
    }
};

@withStyles(styles)
export default class File extends React.Component {
    static accepts(medium) {
        return medium
            && medium.file;
    }

    open = () => {
        window.open(this.props.medium.src, '_blank');
    }
    render() {
        const {file} = this.props.medium;
        let ext = (file || "").split(".").pop() || "";
        ext = ext.toLowerCase();
        let iconStyle = defaultStyles[ext];
        return 	<div className={this.props.classes.root}>
            <a href={this.props.medium.src} className={this.props.classes.icon}>
                <FileIcon {...iconStyle} extension={ext} onClick={this.open}/>
            </a>
        </div>;
    }
}
