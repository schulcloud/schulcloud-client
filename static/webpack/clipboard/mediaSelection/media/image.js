import React from 'react';
export default function Image(props) {
      return <React.Fragment>
            <img 
              src={props.src} 
              className="media-picture"
            />
            <div className={props.infoClassName}>{props.name}</div>
            <div className={props.infoClassName}>{props.sender}</div>
        </React.Fragment>;
}

Image.accept = (medium) => {
  return medium.type && medium.type.mime && medium.type.mime.indexOf('image/') >= 0;
};