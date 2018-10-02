import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MoreIcon from '@material-ui/icons/MoreVert';       
import IconButton from '@material-ui/core/IconButton';

const styles = {
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    flexBuffer: {
      flex: 1
    },
};

@withStyles(styles)
export default class MenuAppBar extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <AppBar position="static">
        <Toolbar className="app-bar">
          <Typography variant="title">
            Digitaler Klassenraum
          </Typography>
          <div className={classes.flexBuffer}> </div>
          <IconButton onClick={this.props.onToggleFullscreen} >
            <CloseIcon />
          </IconButton>
          <IconButton onClick={this.props.onToggleFullscreen} >
            <MoreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}