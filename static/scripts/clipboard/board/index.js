import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import layoutOptions from '../layoutOptions';
import Slot from './slot';
import background from './background.jpg';

const styles = {
    root:{
        background: `#FFF url(${background}) no-repeat center center fixed`,
        backgroundSize: "cover",
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "row",
        flexWrap: 'wrap',
    },
};

@withStyles(styles)
export default class Clipboard extends React.PureComponent {
    render() {
        const { classes, layout } = this.props;
        const { maxElements, x } = layoutOptions[layout] || layoutOptions['1x1'];
        return <div className={`clipboard ${classes.root}`}>
                {[...Array(maxElements).keys()].map((i) => {
                    return <Slot 
                        key={i} 
                        style={{width: (100/x) + '%'}}
                        slotId={i}
                    />;
                })}
            </div>;  
    }
}

