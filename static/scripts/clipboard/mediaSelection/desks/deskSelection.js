import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { createGroupDesk } from '../../redux/actions/socket-send';
import { setDesk } from '../../redux/actions/local';

import GroupDeskDialog from './groupDeskDialog';

const styles = theme => ({
    root: {
      width: 200,
      backgroundColor: theme.palette.background.paper,
      zIndex: -1,
      display: 'flex',
      flexDirection: 'column'
    },
    selected: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderLeft: `solid 5px ${theme.palette.primary.main}`,
    },
    list: {
        flex: 1,
        overflowY: 'auto',
    },
    addButton: {
        width: '100%'
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
  });

@withStyles(styles)

@connect(({desks}) => ({
    desks: desks[desks.deskType],
    desk: desks.desk,
    deskType: desks.deskType
}), (dispatch) => ({
    createGroupDesk: (name) => dispatch(createGroupDesk(name)),
    setDesk: (desk) => dispatch(setDesk(desk))
}))
export default class DeskSelection extends React.PureComponent {

    componentDidMount() {
        const { desks, setDesk } = this.props;
        if(!desks) return;
        if(Object.keys(desks).length == 1) {
            setDesk(Object.keys(desks)[0]);
        } 
    }

    state = {
        open: false
    }

    openDialog = () => {
        this.setState({open: true});
    }

    createGroupDesk = ({name, keepOpen}) => {
        this.setState({open: keepOpen});
        if(name) {
            this.props.createGroupDesk(name);
        }
    }
    
    render() {
        const { classes, desks, desk, setDesk, deskType } = this.props;
        const { open } = this.state;
        if(!desks) return null;
        const nDesks = Object.keys(desks).length;
        return (
        <React.Fragment>
            <Slide key={deskType} direction="right" in={true} appear={true} mountOnEnter unmountOnExit>
                <div className={classes.root}>
                    <List component="nav" className={classes.list}>
                        {Object.keys(desks).map((id) => 
                            <ListItem
                                key={id}
                                dense={true}
                                button
                                classes={{selected: classes.selected}}
                                selected={desk === id}
                                onClick={() => setDesk(id)}
                            >
                                <ListItemText primaryTypographyProps={{variant: 'subtitle1'}} primary={desks[id].name} />
                            </ListItem>
                        )}
                    </List>
                    {deskType === "groups" && 
                        <Button size="small" className={classes.addButton} onClick={this.openDialog} >
                            <AddIcon className={classes.leftIcon} />
                            Tisch erstellen
                        </Button>
                    }
                </div>
            </Slide>
            <GroupDeskDialog open={open} onClose={this.createGroupDesk}/>
        </React.Fragment>
        );
    }
}
