import React from 'react';
export default function Image(props) {
      return <img 
        src={props.src} 
        className="media-picture"
      />;
}

export const IMAGE = "image";