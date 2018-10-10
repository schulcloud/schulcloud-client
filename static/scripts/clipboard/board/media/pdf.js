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
        const { src, preview } = this.props;
        if(!preview) {
            PDFObject.embed(src, this.myRef.current);
            this.pdfMounted = true;
        }
    }

    componentDidUpdate() {
        const { src, preview } = this.props;
        if(!preview && !this.pdfMounted) {
            PDFObject.embed(src, this.myRef.current);
            this.pdfMounted = true;
        }
    }

    render() {
        const { classes, preview } = this.props;
        return <div className={classes.root} ref={this.myRef} />;
    }
}