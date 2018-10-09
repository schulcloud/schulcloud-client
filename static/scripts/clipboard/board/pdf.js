import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PDFObject from 'pdfobject';

const styles = {
    root: {
        width: '100%',
        height: '100%',
    }
};

@withStyles(styles)
export default class PdfViewer extends React.Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {
        const { src } = this.props;
        PDFObject.embed(src, this.myRef.current);
    }
    
    render() {
        const { classes, containerId } = this.props;
        return <div className={classes.root} ref={this.myRef} />;
    }
}