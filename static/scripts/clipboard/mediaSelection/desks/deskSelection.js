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
        const { classes, desks, desk, selectDesk } = this.props;
        if(!desks || Object.keys(desks).length < 1) return null;
        return (
            <div className={classes.root}>
                <List component="nav">
                    {Object.keys(desks).map((id) => 
                        <ListItem
                            key={id}
                            dense={true}
                            button
                            classes={{selected: classes.selected}}
                            selected={desk === id}
                            onClick={() => selectDesk(id)}
                        >
                            <ListItemText primaryTypographyProps={{variant: 'subtitle1'}} primary={desks[id].name} />
                        </ListItem>
                    )}
                </List>
            </div>
        );
    }
}
