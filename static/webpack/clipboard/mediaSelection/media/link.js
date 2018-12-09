import React from 'react';
import LinkIcon from '@material-ui/icons/Link';

export default function Link(props) {
  return  <React.Fragment>
            <div className="media-icon-container">
              <LinkIcon/>
            </div>
            <div className={props.infoClassName}>{props.name || props.src}</div>
            <div className={props.infoClassName}>{props.sender}</div>
          </React.Fragment>;
}

Link.accept = (medium) => {
  return medium 
    && medium.type 
    && (medium.type + "").toLowerCase() === "link";
};