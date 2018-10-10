import React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Grow from '@material-ui/core/Grow';
import Zoom from '@material-ui/core/Zoom';
import { withStyles } from '@material-ui/core/styles';
import DownIcon from '@material-ui/icons/ArrowDropDown';
import UpIcon from '@material-ui/icons/ArrowDropUp';

import AddButton from './addButton.js';
import DeskTypeSelection from './desks/deskTypeSelection';
import DeskSelection from './desks/deskSelection';
import Desk from './desks/desk.js';

const styles = {
    root: {
      width: '100%',
      height: 300,
      bottom: 0,
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      background: 'white',
    },
    fabLeft: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    }
};


function mapStateToProps(state) {
    return {
        uploads: state.socket.uploads,
        desks: state.socket.clipboard.desks,
        url: state.socket.url,
    };
}

@withStyles(styles)
@connect(mapStateToProps)
export default class MediaSelection extends React.Component {

    state = {
        show: true,
        deskType: 'teachers',
        desk: undefined
    };

    toggle = () => {
        this.setState({show: !this.state.show});
    }

    selectDeskType = (deskType) => {
        this.setState({deskType, desk: null});
    }

    static getDerivedStateFromProps(props, state) {
        if(!props.desks) return state;
        if(!state.deskType) return state;
        const desk = props.desks[state.deskType]||{};
        if(!state.desk && Object.keys(desk).length === 1) {
           state.desk = Object.keys(desk)[0];
        }
        return state;
    }
    
    selectDesk = (desk) => {
        this.setState({desk});
    }

    render() {
        const { classes, desks } = this.props;
        const { show, deskType, desk } = this.state;
        if(!desks) return null;
        return (
            <React.Fragment>
                <Slide direction="up" in={show} mountOnEnter unmountOnExit>
                    <div className={classes.root}>
                        <DeskTypeSelection 
                            deskType={deskType}
                            selectDeskType={this.selectDeskType}
                        />    
                        <DeskSelection 
                            desks={desks[deskType]}
                            desk={desk}
                            selectDesk={this.selectDesk}
                        />
                        {!!deskType && !!desk && <Desk
                                key={desk}
                                media={desks[deskType][desk].media}
                                deskType={deskType}
                                desk={desk} 
                        />}                 
                        {!!deskType && !!desk &&
                            <AddButton 
                                desk={desk}
                                deskType={deskType}
                            />
                        }
                    </div>
                </Slide>
                <Button variant="fab" className={classes.fabLeft} color="secondary" onClick={this.toggle}>
                    {show ? <DownIcon/> : <UpIcon/>}
                </Button>
            </React.Fragment>
            );
    }
}
