import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';

import { setDeskType } from '../../redux/actions/local';

import { GroupDesk, TeacherDesk, StudentDesk } from './icons';

const styles = theme => ({
    root: {
      width: 230,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    selected: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderLeft: `solid 5px ${theme.palette.primary.main}`,
    }
  });


@withStyles(styles)
@connect(({desks, me}) => ({
    desk: desks.desk,
    deskType: desks.deskType,
    teacher: me.role === "teacher"
}),(dispatch) => ({
    setDeskType: (desk) => dispatch(setDeskType(desk))
}))
export default class DeskSelection extends React.PureComponent {

    render() {
        const { classes, deskType, setDeskType, bottomButton, teacher } = this.props;
        return (
            <div className={classes.root}>
                <List component="nav">
                    {teacher && <ListItem
                        button
                        classes={{selected: classes.selected}}
                        selected={deskType === "teachers"}
                        onClick={() => setDeskType("teachers")}
                    >
                        <ListItemIcon>
                            <SvgIcon>
                                <TeacherDesk/>
                            </SvgIcon>
                        </ListItemIcon>
                        <ListItemText primaryTypographyProps={{variant: 'subtitle1'}} primary="Lehrertisch" />
                    </ListItem>}
                    <ListItem
                        button
                        classes={{selected: classes.selected}}
                        selected={deskType === "students"}
                        onClick={() => setDeskType("students")}
                    >
                        <ListItemIcon>
                            <SvgIcon>
                                <StudentDesk/>
                            </SvgIcon>
                        </ListItemIcon>
                        <ListItemText primaryTypographyProps={{variant: 'subtitle1'}} primary="Schülertische" />
                    </ListItem>
                    <ListItem
                        button
                        classes={{selected: classes.selected}}
                        selected={deskType === "groups"}
                        onClick={() => setDeskType("groups")}
                    >
                        <ListItemIcon>
                            <SvgIcon>
                                <GroupDesk/>
                            </SvgIcon>
                        </ListItemIcon>
                        <ListItemText primaryTypographyProps={{variant: 'subtitle1'}} primary="Gruppentische" />
                    </ListItem>
                </List>
                {bottomButton}
            </div>
        );
    }
}
