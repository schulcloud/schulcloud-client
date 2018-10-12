import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import {uploadFiles, addMedia} from '../redux/actions/socket-send';
import UploadIcon from '@material-ui/icons/CloudUpload';
import DocumentIcon from '@material-ui/icons/InsertDriveFile';
import DocumentDialog from './documentDialog.js';
import LinkIcon from '@material-ui/icons/Link';
import LinkDialog from './linkDialog.js';

const styles = {
    root: {
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
};

function mapStateToProps(state) {
    return {
        uploader: state.socket.uploader,
        url: state.socket.url,
    };
}

const mapDispatchToProps = {
    uploadFiles: (files) => uploadFiles(files),
    addMedia: (media) => addMedia(media)
};

@withStyles(styles)
@connect(mapStateToProps, mapDispatchToProps)
export default class AddButton extends React.Component {

    constructor(props) {
        super(props);
        this.inputOpenFileRef = React.createRef();
    }

    openFileDialog = () => {
        this.inputOpenFileRef.current.click();
        this.closeMenu();
    };

    onChangeFile = (event) => {
        this.props.uploadFiles({
            deskType: this.props.deskType,
            desk: this.props.desk,
            files: Array.from(event.target.files)
        });
        event.target.value = "";
    }

    state = {
        menuEl: null,
        linkDialog: false,
        documentDialog: false,
    };

    openMenu = event => {
        this.setState({ menuEl: event.currentTarget });
    };    

    closeMenu = () => {
        this.setState({ menuEl: null });
    };
    
    openLinkDialog = () => {
        this.setState({linkDialog: true});
        this.closeMenu();
    }

    openDocumentDialog = () => {
        this.setState({documentDialog: true});
        this.closeMenu();
    }

    linkDialogClose = (medium) => {
        this.setState({linkDialog: false});
        if(medium) {
            this.props.addMedia({
                deskType: this.props.deskType,
                desk: this.props.desk,
                medium
            });
        }
    }

    documentDialogClose = (medium) => {
        this.setState({documentDialog: false});
        if(medium) {
            this.props.addMedia({
                deskType: this.props.deskType,
                desk: this.props.desk,
                medium
            });
        }
    }

    render() {
        const { classes } = this.props;
        const { menuEl, linkDialog, documentDialog } = this.state;
        return (
                <React.Fragment>
                    <Button variant="fab" className={classes.root} color="secondary" onClick={this.openMenu}>
                        <AddIcon/>
                    </Button>
                    <Menu
                        anchorEl={menuEl}
                        open={!!menuEl}
                        onClose={this.closeMenu}
                    >
                        <MenuItem onClick={this.openDocumentDialog}>
                            <ListItemIcon>
                                <DocumentIcon />
                            </ListItemIcon>
                            <ListItemText classes={{ primary: classes.primary }} inset primary="Dokument erstellen" />
                        </MenuItem>
                        <MenuItem onClick={this.openLinkDialog}>
                            <ListItemIcon>
                                <LinkIcon />
                            </ListItemIcon>
                            <ListItemText classes={{ primary: classes.primary }} inset primary="Link einfügen" />
                        </MenuItem>
                        <MenuItem onClick={this.openFileDialog}>
                            <ListItemIcon>
                                <UploadIcon />
                            </ListItemIcon>
                            <ListItemText classes={{ primary: classes.primary }} inset primary="Datei hochladen" />
                        </MenuItem>
                    </Menu>
                    <LinkDialog open={linkDialog} onClose={this.linkDialogClose} />
                    <DocumentDialog open={documentDialog} onClose={this.documentDialogClose} />
                    <input 
                        ref={this.inputOpenFileRef} 
                        type="file" 
                        style={{display:"none"}}
                        onChange={this.onChangeFile}
                        multiple
                    />
                </React.Fragment>
            );
    }
}
