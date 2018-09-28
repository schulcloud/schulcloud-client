import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import LinkIcon from '@material-ui/icons/Link';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';

import { connect } from 'react-redux';
import { addMedia } from './redux/socket-actions';

const styles = {
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    flexBuffer: {
      flex: 1
    },
};

class MenuAppBar extends React.Component {

  state = {
    linkDialogOpen: false,
    link: "",
  }

  openLinkDialog = () => {
    this.setState({linkDialogOpen: true});
  }

  closeLinkDialog = () => {
    this.setState({linkDialogOpen: false, link: ""});
  }

  broadcastLink = () => {
    this.props.addMedia(
      {
        type: 'link',
        link: this.state.link,
        select: true
      });
    this.closeLinkDialog();
  }

  change = (key) => (evt) => {
    this.setState({[key] : evt.target.value});
  }

  render() {
    const { classes } = this.props;
    const { linkDialogOpen, link } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar className="app-bar">
            <Typography variant="title">
              Digitaler Klassenraum
            </Typography>
            <div className={classes.flexBuffer}> </div>
            <IconButton onClick={this.openLinkDialog} >
              <LinkIcon />
            </IconButton>
            <IconButton onClick={this.props.onToggleFullscreen} >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Dialog onClose={this.closeLinkDialog} open={linkDialogOpen}>
          <DialogTitle id="simple-dialog-title">Link teilen</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Füge hier ein Link ein, um es allen Geräten zur Verfügung zu stellen
            </DialogContentText>
            <TextField
              autoFocus
              value={link}
              onChange={this.change('link')}
              label="Link"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeLinkDialog} color="primary">
              Abbrechen
            </Button>
            <Button onClick={this.broadcastLink} color="primary">
              Teilen
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = dispatch => {
  return {
    addMedia: (media) => dispatch(addMedia(media))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MenuAppBar));

