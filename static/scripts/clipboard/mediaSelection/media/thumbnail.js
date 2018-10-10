import React from 'react';
import { withStyles } from '@material-ui/core';

import Image from './image';
import YouTube from './youtube';
import File from './file';
import Link from './link';

const styles = {
    info:{
        width: '100%',
        overflowX: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: '80%',
    }
};

@withStyles(styles)

export default class MediumContainer extends React.PureComponent {
    
    render() {
        const { medium, url, classes, upload } = this.props;
        const { file, src } = medium;

        const imageSrc = src || !upload && url + '/clipboard/uploads/' + file;
        
        if(Image.accept(medium)) return <Image {...medium} src={imageSrc} infoClassName={classes.info} />;
        if(YouTube.accept(medium)) return <YouTube {...medium} infoClassName={classes.info}  />;
        if(Link.accept(medium)) return <Link {...medium} infoClassName={classes.info}  />;
        return <File {...medium} infoClassName={classes.info}  />;
    }
}