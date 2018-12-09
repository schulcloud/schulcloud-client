import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { createGroupDesk, deleteGroupDesk } from '../../redux/actions/socket-send';
import { setDesk } from '../../redux/actions/local';

import GroupDeskDialog from './groupDeskDialog';
import ConfirmDialog from '../../helper/confirmDialog';

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

@connect(({desks, me}) => ({
    desks: desks[desks.deskType],
    filter: me.role !== "teacher" && desks.deskType === "students" && me.id,
    desk: desks.desk,
    deskType: desks.deskType,
    groupDesk: desks.deskType === 'groups',
    teacher: me.role === 'teacher'
}), (dispatch) => ({
    createGroupDesk: (name) => dispatch(createGroupDesk(name)),
    deleteGroupDesk: (name) => dispatch(deleteGroupDesk(name)),
    setDesk: (desk) => dispatch(setDesk(desk))
}))
export default class DeskSelection extends React.PureComponent {

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

    deleteGroupDesk = (confirmed) => {
        if(confirmed) {
            this.props.deleteGroupDesk(this.state.confirmDelete);
        }
        this.setState({confirmDelete: false});
    };
    
    confirmDeleteGroupDesk = (name) => () => {
        this.setState({confirmDelete: name});
    }

    render() {
        const { classes, desks, desk, setDesk, deskType, filter, teacher, groupDesk, deleteGroupDesk } = this.props;
        const { open } = this.state;
        if(!desks) return null;
        const nDesks = Object.keys(desks).length;

        let nameCompare = (a,b) => {
            return desks[a].name.toLowerCase().localeCompare(desks[b].name.toLowerCase());
        };
        
        return (
        <React.Fragment>
            {teacher && groupDesk && <ConfirmDialog
                open = {!!this.state.confirmDelete}
                title = {`Gruppe ${this.state.confirmDelete} löschen?`}
                onClose = {this.deleteGroupDesk}
            />}
            <GroupDeskDialog open={open} onClose={this.createGroupDesk}/>
            <Slide key={deskType} direction="right" in={true} appear={true} mountOnEnter unmountOnExit>
                <div className={classes.root}>
                    <List component="nav" className={classes.list}>
                        {Object.keys(desks).sort(nameCompare).filter((id) => !filter || filter === id).map((id) => 
                            <ListItem
                                key={id}
                                dense={true}
                                button
                                classes={{selected: classes.selected}}
                                selected={desk === id}
                                onClick={() => setDesk(id)}
                            >
                                <ListItemText primaryTypographyProps={{variant: 'subtitle1'}} primary={desks[id].name} />
                                {teacher && groupDesk && 
                                    <ListItemSecondaryAction>
                                        <IconButton aria-label="Gruppen löschen" onClick={this.confirmDeleteGroupDesk(desks[id].name)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>}
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
        </React.Fragment>
        );
    }
}
