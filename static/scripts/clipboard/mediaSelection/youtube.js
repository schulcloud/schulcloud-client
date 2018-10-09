import React from 'react';
export default function YouTube(props) {
      return <img 
        src={`https://img.youtube.com/vi/${props.youtubeId}/0.jpg`} 
        className="media-picture"
      />;
}

export const YOUTUBE = "youtube";