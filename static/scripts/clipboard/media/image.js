import React from 'react';
import { connect } from 'react-redux';
import {
	DragSource,
} from 'react-dnd';
import mediaTypes from './mediaTypes';

class Image  extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
        const { onClick, isDragging, connectDragSource, src, sender, file } = this.props;
        return connectDragSource(
            <div className="media-container draggable" style={{ opacity: isDragging ? 0.5 : 1 }} onClick={onClick}>
                <img 
                    src={src} 
                    className="media-picture"
                />
                <div className="media-info">{file}</div>
                <div className="media-info">{sender}</div>
            </div>
        );
    }
}

const cardSource = {
    beginDrag(props) {
      return {
        img: props
      };
    }
  };

  function collect(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    };
  }

const DroppableImage = DragSource(mediaTypes.Image, cardSource, collect)(Image);

export default DroppableImage;