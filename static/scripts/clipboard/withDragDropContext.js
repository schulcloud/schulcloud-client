import TouchBackend from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';
import MultiBackend from 'react-dnd-multi-backend';
import { createTransition } from 'react-dnd-multi-backend';
import { DragDropContext } from 'react-dnd';

const TouchTransition = createTransition('touchstart', (event) => {
    return event.touches != null;
});

const HTML5toTouch = {
    backends: [
      {
        backend: HTML5Backend
      },
      {
        backend: TouchBackend({
            scrollAngleRanges: [
                { start: 135 }, 
                { end: 45 }, 
            ]
        }), // Note that you can call your backends with options
        preview: true,
        transition: TouchTransition
      }
    ]
};

export default DragDropContext(MultiBackend(HTML5toTouch));