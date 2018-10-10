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
import { setBoardLayout } from './redux/socket-actions';

const styles = {
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    flexBuffer: {
      flex: 1
    },
};

function mapStateToProps(state) {
  return {
      layout: state.socket.clipboard.board.layout,
  };
}

const mapDispatchToProps = dispatch => {
    return {
        setBoardLayout: (layout) => dispatch(setBoardLayout(layout)),
    };
};

@connect(mapStateToProps, mapDispatchToProps)
@withStyles(styles)
export default class MenuAppBar extends React.Component {
  
  state = {
    menuEl: null,
  };

  handleClick = event => {
    this.setState({ menuEl: event.currentTarget });
  };

  handleClose = (key, layoutOption) => () => {
    this.setState({ menuEl: null });
    if(layoutOption) {
      this.props.setBoardLayout({
        key,
        maxElements: layoutOption.maxElements
      });
    }
  };

  render() {
    const { classes, layout, connected } = this.props;
    const { menuEl } = this.state;

    let LayoutIcon = (layoutOptions[layout] || layoutOptions["1x1"]).svg;
    return (
      <AppBar position="static">
        <Toolbar className="app-bar">
          <Typography variant="h6">
            Digitaler Klassenraum {connected ? "" : "- Verbindung wird hergestellt"}
          </Typography>
          <div className={classes.flexBuffer}> </div>
          <IconButton onClick={this.handleClick} >
            <SvgIcon>
              <LayoutIcon />
            </SvgIcon>
          </IconButton>
          <IconButton onClick={this.props.onToggleFullscreen} >
            {this.props.fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Toolbar>
        <Menu
            anchorEl={menuEl}
            open={Boolean(menuEl)}
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
              <ListItemText primary={layoutOptions[opt].text} />
            </MenuItem>;
          })}
        </Menu>
      </AppBar>
    );
  }
}