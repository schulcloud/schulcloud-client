import React from 'react';
import { connect } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';    
import Delete from '@material-ui/icons/DeleteForever';
import IconButton from '@material-ui/core/IconButton';
import layoutOptions from './layoutOptions';
import SvgIcon from '@material-ui/core/SvgIcon';
import Tooltip from '@material-ui/core/Tooltip';
import { setBoardLayout, resetClipboard } from './redux/actions/socket-send';
import LayoutIcon from 'svg-react-loader!./layoutOptions/split-browser.svg';
import ConfirmDialog from './helper/confirmDialog';

const styles = {
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    flexBuffer: {
      flex: 1
    },
};

const ConnectionText = connect(({socket}) => ({connected: socket.connected}))(
  ({connected}) => connected ? "" : "- Verbindung wird hergestellt"
);


@withStyles(styles)
@connect(({me}) => ({
  teacher: me.role === "teacher"
}), (dispatch) => ({
  reset: () => dispatch(resetClipboard())
}))
export default class MenuAppBar extends React.Component {

  state = {
    confirm: false
  }

  reset = () => {
    this.setState({confirm: true});
  };

  onResetConfirm = (confirmed) => {
    this.setState({confirm: false});
    if(confirmed) {
      this.props.reset();
    }
  };
  
  render() {
    const { classes, teacher } = this.props;

    return (
      <AppBar position="static">
        <Toolbar className="app-bar">
          <Typography variant="h6">
            Digitales Klassenzimmer <ConnectionText />
          </Typography>
          <div className={classes.flexBuffer}> </div>
          <LayoutMenu />
          <Tooltip title= {"Vollbildmodus" + (this.props.fullscreen ? "verlassen" : "öffnen")}>
            <IconButton onClick={this.props.onToggleFullscreen} >
              {this.props.fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
          {teacher && 
            <Tooltip title="Klassenzimmer zurücksetzen">
              <IconButton onClick={this.reset} >
                <Delete />
              </IconButton>
            </Tooltip>
          }
        </Toolbar>
        <ConfirmDialog 
            open = {this.state.confirm}
            title = "Klassenzimmer zurücksetzen?"
            onClose = {this.onResetConfirm}
          />
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
        <Tooltip title="Layout der Arbeitsfläche ändern">
         <IconButton onClick={this.handleClick} >
            <SvgIcon>
              <LayoutIcon />
            </SvgIcon>
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  }
}