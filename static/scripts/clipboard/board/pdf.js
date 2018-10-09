import React from 'react';
import { Document, Page, setOptions } from 'react-pdf';

setOptions({
    workerSrc: "/webpacked/pdf.worker.js"
});
 
export default class PdfViewer extends React.Component {
    state = {
        numPages: null,
        pageNumber: 1,
      }
    
      onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
      }
    
      render() {
        const { pageNumber, numPages } = this.state;
    
        return (
          <div>
            <Document
                file={{
                    url: this.props.src,
                    withCredentials: true
                }}
                onLoadSuccess={this.onDocumentLoadSuccess}
            >
                <Page
                    renderMode={"svg"} 
                    pageNumber={pageNumber}
                />
            </Document>
            <p>Page {pageNumber} of {numPages}</p>
          </div>
        );
      }
}