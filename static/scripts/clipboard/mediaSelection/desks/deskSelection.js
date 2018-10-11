import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';

const styles = theme => ({
    root: {
      width: 230,
      backgroundColor: theme.palette.background.paper,
      zIndex: -1,
      overflowY: 'auto',
    },
    selected: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderLeft: `solid 5px ${theme.palette.primary.main}`,
    }
  });

@withStyles(styles)
@connect(({desks}, {deskType}) => ({
    desks: desks[deskType]
}))
export default class DeskSelection extends React.PureComponent {

    componentDidUpdate() {
        const { desks, selectDesk } = this.props;
        if(Object.keys(desks).length == 1) {
            selectDesk(Object.keys(desks)[0]);
        } 
    }

    render() {
        const { classes, desks, desk, selectDesk } = this.props;
        if(!desks || Object.keys(desks).length == 0) return null;
        return (
            <Slide direction="right" in={true} appear={true} mountOnEnter unmountOnExit>
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
            </Slide>
        );
    }
}
