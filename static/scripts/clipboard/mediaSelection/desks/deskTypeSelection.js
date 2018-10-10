import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';

import { GroupDesk, TeacherDesk, StudentDesk } from './icons';

const styles = theme => ({
    root: {
      width: 230,
      backgroundColor: theme.palette.background.paper,
    },
    selected: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderLeft: `solid 5px ${theme.palette.primary.main}`,
    }
  });


@withStyles(styles)
export default class DeskSelection extends React.Component {

    render() {
        const { classes, deskType, selectDeskType } = this.props;
        return (
            <div className={classes.root}>
                <List component="nav">
                    <ListItem
                        button
                        classes={{selected: classes.selected}}
                        selected={deskType === "teachers"}
                        onClick={() => selectDeskType("teachers")}
                    >
                        <ListItemIcon>
                            <SvgIcon>
                                <TeacherDesk/>
                            </SvgIcon>
                        </ListItemIcon>
                        <ListItemText primaryTypographyProps={{variant: 'subtitle1'}} primary="Lehrertisch" />
                    </ListItem>
                    <ListItem
                        button
                        classes={{selected: classes.selected}}
                        selected={deskType === "students"}
                        onClick={() => selectDeskType("students")}
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
                        onClick={() => selectDeskType("groups")}
                    >
                        <ListItemIcon>
                            <SvgIcon>
                                <GroupDesk/>
                            </SvgIcon>
                        </ListItemIcon>
                        <ListItemText primaryTypographyProps={{variant: 'subtitle1'}} primary="Gruppentische" />
                    </ListItem>
                </List>
            </div>
        );
    }
}
