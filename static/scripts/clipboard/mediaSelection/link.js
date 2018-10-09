import React from 'react';
import LinkIcon from '@material-ui/icons/Link';

export default function Link(props) {
  return  <div className="media-icon-container" onClick={props.onClick}>
            <LinkIcon/>
          </div>;
}

export const LINK = "link";