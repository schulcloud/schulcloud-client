import React from 'react';
import getYoutubeTitle from 'get-youtube-title';
import getYoutubeID from 'get-youtube-id';

export default class YouTube extends React.Component {
  
  constructor(props) {
    super(props);
    const youtubeId = getYoutubeID(props.src);
    this.state = { youtubeId };
  }

  componentDidMount() {
    getYoutubeTitle(this.state.youtubeId, (err, title) => this.setState({title}));
  }
  
  render() {
    const { sender, infoClassName } = this.props;
    const { title, youtubeId } = this.state;
    return (
      <React.Fragment>
        <img 
          src={`https://img.youtube.com/vi/${youtubeId}/0.jpg`} 
          className="media-picture"
        />
        <div className={infoClassName}>{title}</div>
        <div className={infoClassName}>{sender}</div>
      </React.Fragment>
    );
  }
}

YouTube.accept = (medium) => {
  return medium 
    && medium.src
    && medium.type 
    && (medium.type + "").toLowerCase() === "link" 
    && getYoutubeID(medium.src);
};