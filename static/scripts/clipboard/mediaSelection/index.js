import React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
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
        uploads: state.uploads,
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
    
    selectDesk = (desk) => {
        this.setState({desk});
    }

    render() {
        const { classes } = this.props;
        const { show, deskType, desk } = this.state;
        return (
            <React.Fragment>
                <Slide direction="up" in={show} mountOnEnter unmountOnExit>
                    <div className={classes.root}>
                        <DeskTypeSelection 
                            deskType={deskType}
                            selectDeskType={this.selectDeskType}
                        />    
                        <DeskSelection 
                            deskType={deskType}
                            desk={desk}
                            selectDesk={this.selectDesk}
                        />
                        {!!deskType && !!desk && <Desk
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
