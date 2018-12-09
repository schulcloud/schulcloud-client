import React from 'react';
import DocumentIcon from '@material-ui/icons/InsertDriveFile';

export default function Etherpad(props) {
  return  <React.Fragment>
            <div className="media-icon-container">
                <DocumentIcon/>
            </div>
            <div className={props.infoClassName}>{props.name || props.src}</div>
            <div className={props.infoClassName}>{props.sender}</div>
          </React.Fragment>;
}

Etherpad.accept = (medium) => {
  return medium 
    && medium.type 
    && (medium.type + "").toLowerCase() === "etherpad";
};