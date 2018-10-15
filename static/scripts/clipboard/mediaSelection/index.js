import React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Grow from '@material-ui/core/Grow';
import { withStyles } from '@material-ui/core/styles';
import DownIcon from '@material-ui/icons/ArrowDropDown';
import UpIcon from '@material-ui/icons/ArrowDropUp';

import AddButton from './addButton.js';
import DeskTypeSelection from './desks/deskTypeSelection';
import DeskSelection from './desks/deskSelection';
import Desk from './desks/desk.js';

const styles = (theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        height: 200,
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
    },
    button: {
        width: '100%',
        color: 'rgba(255,255,255,0.6)',
    }
});


function mapStateToProps(state) {
    return {
        url: state.socket.url,
    };
}

@withStyles(styles)
@connect(mapStateToProps)
export default class MediaSelection extends React.Component {

    state = {
        show: true,
    };

    toggle = () => {
        this.setState({show: !this.state.show});
    }

    render() {
        const { classes } = this.props;
        const { show } = this.state;
        return (
            <React.Fragment>
                <Slide direction="up" in={show} mountOnEnter unmountOnExit>
                    <div className={classes.root}>
                        <DeskTypeSelection 
                            bottomButton={
                                <Button onClick={this.toggle} className={classes.button}>
                                    <DownIcon/> Menü ausblenden
                                </Button>                                
                            }
                        />    
                        <DeskSelection />
                        <Desk/>                 
                        <AddButton />
                    </div>
                </Slide>
                <Grow in={!show}>
                    <Button variant="fab" className={classes.fabLeft} color="secondary" onClick={this.toggle}>
                        <UpIcon/>
                    </Button>
                </Grow>
            </React.Fragment>
            );
    }
}
