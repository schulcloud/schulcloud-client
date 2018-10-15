import React from 'react';
import { connect } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';    
import IconButton from '@material-ui/core/IconButton';
import layoutOptions from './layoutOptions';
import SvgIcon from '@material-ui/core/SvgIcon';
import { setBoardLayout } from './redux/actions/socket-send';

const styles = {
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    flexBuffer: {
      flex: 1
    },
};


const LayoutIcon = connect(({desks}) => ({layout: desks.currentDesk && desks.currentDesk.board.layout}))(
  ({layout}) => {
    const SVG = ((layoutOptions[layout] || layoutOptions["1x1"]).svg);
    return <SVG />;
  }
);

const ConnectionText = connect(({socket}) => ({connected: socket.connected}))(
  ({connected}) => connected ? "" : "- Verbindung wird hergestellt"
);


@withStyles(styles)
export default class MenuAppBar extends React.Component {
  
  render() {
    const { classes } = this.props;

    return (
      <AppBar position="static">
        <Toolbar className="app-bar">
          <Typography variant="h6">
            Digitaler Klassenraum <ConnectionText />
          </Typography>
          <div className={classes.flexBuffer}> </div>
          <LayoutMenu />
          <IconButton onClick={this.props.onToggleFullscreen} >
            {this.props.fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}


const mapDispatchToProps = dispatch => {
  return {
      setBoardLayout: (layout) => dispatch(setBoardLayout(layout)),
  };
};

@connect(null, mapDispatchToProps)
class LayoutMenu extends React.PureComponent {
  
  state = {
    open: false,
  };

  handleClick = event => {
    this.setState({ menuEl: event.currentTarget, open:true });
  };

  handleClose = (key, layoutOption) => () => {
    this.setState({ open: false });
    if(layoutOption) {
      this.props.setBoardLayout({
        key,
        maxElements: layoutOption.maxElements
      });
    }
  };

  render() {
    const { open, menuEl } = this.state;
    return (
      <React.Fragment>
        <Menu
            anchorEl={menuEl}
            open={open}
            onClose={this.handleClose()}
          >
          {Object.keys(layoutOptions).map(opt => {
              const Svg = layoutOptions[opt].svg;
              return <MenuItem key={opt} onClick={this.handleClose(opt, layoutOptions[opt])}>
                      <ListItemIcon>
                        <SvgIcon>
                          <Svg />
                        </SvgIcon>
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{variant: 'subtitle1'}} primary={layoutOptions[opt].text} />
                    </MenuItem>;
            })}
        </Menu>
        <IconButton onClick={this.handleClick} >
          <SvgIcon>
            <LayoutIcon />
          </SvgIcon>
        </IconButton>
      </React.Fragment>
    );
  }
}