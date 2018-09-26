import React from 'react';
import Image from './image';
import File from './file';

export default class Media extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
        const { type, file, sender, url } = this.props;
        const src = url + '/clipboard/uploads/'  + file;
        let mimeType = ((type || {}).mime || "").split('/')[0];
        switch(mimeType) {
            case "image": 
                return <Image 
                            {...this.props}
                            src={src}/>;
            default:
                return <File 
                {...this.props}
                src={src}/>;
        }
        
    }
}

