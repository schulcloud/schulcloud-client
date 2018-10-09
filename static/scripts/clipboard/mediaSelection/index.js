import React from 'react';
import { connect } from 'react-redux';
import Medium from './medium.js';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Slide from '@material-ui/core/Slide';
import Grow from '@material-ui/core/Grow';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import {uploadFiles, addMedia} from '../redux/socket-actions';
import UploadIcon from '@material-ui/icons/CloudUpload';
import LinkIcon from '@material-ui/icons/Link';
import DownIcon from '@material-ui/icons/ArrowDropDown';
import UpIcon from '@material-ui/icons/ArrowDropUp';
import LinkDialog from './linkDialog.js';
import {GroupDesk, TeacherDesk, StudentDesk} from '../icons';
import { extractHostname, youtubeParse } from '../helper';
import getYoutubeTitle from 'get-youtube-title';

const styles = {
    root: {
      width: '100%',
      height: 300,
      bottom: 0,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
    },
    fab: {
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
    fabLeft: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    }
};


function mapStateToProps(state) {
    return {
        uploader: state.socket.uploader,
        uploads: state.socket.uploads,
        media: state.socket.clipboard.media,
        url: state.socket.url,
    };
}

const mapDispatchToProps = {
    uploadFiles: (files) => uploadFiles(files),
    addMedia: (media) => addMedia(media)
};

@withStyles(styles)
@connect(mapStateToProps, mapDispatchToProps)
export default class MediaSelection extends React.Component {

    constructor(props) {
        super(props);
        this.inputOpenFileRef = React.createRef();
    }

    openFileDialog = () => {
        this.inputOpenFileRef.current.click();
        this.closeMenu();
    };

    onChangeFile = (event) => {
        this.props.uploadFiles(Array.from(event.target.files));
    }

    state = {
        show: true,
        menuEl: null,
        value: 0,
        linkDialog: false
    };

    openMenu = event => {
        this.setState({ menuEl: event.currentTarget });
    };    

    closeMenu = () => {
        this.setState({ menuEl: null });
    };
    
    handleChange = (event, value) => {
        this.setState({ value });
    };
    
    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    openLinkDialog = () => {
        this.setState({linkDialog: true});
        this.closeMenu();
    }

    linkDialogClose = (link, options) => {
        this.setState({linkDialog: false});
        const youtubeId = youtubeParse(link);
        if(youtubeId) {
            getYoutubeTitle(youtubeId, (err, title) =>
                this.props.addMedia({
                    src: link,
                    youtubeId,
                    name: title,
                    options,
                    type: {
                        ext: "youtube",
                        mime: "youtube/" + youtubeId
                    }
                })
            );
        } else {
            this.props.addMedia({
                src: link,
                name: extractHostname(link) + "-Link",
                options,
                type: {
                    ext: "link",
                    mime: "link/" + extractHostname(link)
                }
            });
        }
    }

    toggle = () => {
        this.setState({show: !this.state.show});
    }

    render() {
        const { media, url, uploads, classes } = this.props;
        const { value, menuEl, linkDialog, show } = this.state;
        if(!media) return null;
        return (
            <React.Fragment>
            <Slide direction="up" in={show} mountOnEnter unmountOnExit>
                <div className={classes.root}>
                    <AppBar position="static" color="primary">
                        <Tabs
                            value={value}
                            onChange={this.handleChange}
                            fullWidth
                            scrollable
                            scrollButtons="auto"
                        >
                            <Tab label="Lehrertisch" icon={<SvgIcon><TeacherDesk/></SvgIcon>} />
                            <Tab label="Schülertische" icon={<SvgIcon><StudentDesk/></SvgIcon>} />
                            <Tab label="Gruppentische" icon={<SvgIcon><GroupDesk/></SvgIcon>} />
                            <Tab label="Tisch hinzustellen" icon={<AddIcon/>}/>
                        </Tabs>
                    </AppBar>
                    <Grow in={value===0} mountOnEnter unmountOnExit>
                        <div className="media-row">
                            {media.map((medium) => 
                                <Medium key={medium.id} medium={medium} url={url} />
                            )}
                            {Object.keys(uploads).map((key) => 
                                <Medium key={key} medium={uploads[key]} />
                            )}
                        </div>
                    </Grow>
                    <Button variant="fab" className={classes.fab} color="secondary" onClick={this.openMenu}>
                        <AddIcon/>
                    </Button>
                    <Menu
                        anchorEl={menuEl}
                        open={!!menuEl}
                        onClose={this.closeMenu}
                    >
                        <MenuItem onClick={this.openFileDialog}>
                            <ListItemIcon className={classes.icon}>
                                <UploadIcon />
                            </ListItemIcon>
                            <ListItemText classes={{ primary: classes.primary }} inset primary="Datei hochladen" />
                        </MenuItem>
                        <MenuItem onClick={this.openLinkDialog}>
                            <ListItemIcon className={classes.icon}>
                                <LinkIcon />
                            </ListItemIcon>
                            <ListItemText classes={{ primary: classes.primary }} inset primary="Link verteilen" />
                        </MenuItem>
                    </Menu>
                    <LinkDialog open={linkDialog} onClose={this.linkDialogClose} />
                    <input 
                        ref={this.inputOpenFileRef} 
                        type="file" 
                        style={{display:"none"}}
                        onChange={this.onChangeFile}
                        multiple
                    />
                </div>
            </Slide>
                <Button variant="fab" className={classes.fabLeft} color="secondary" onClick={this.toggle}>
                    {show ? <DownIcon/> : <UpIcon/>}
                </Button>
</React.Fragment>
            );
    }
}
