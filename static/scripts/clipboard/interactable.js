import React, { Component, cloneElement } from 'react';
import { findDOMNode } from 'react-dom';

import interact from 'interact.js';

const onDragMove = (event) => {
    const target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.webkitTransform =
    target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
};

const onResize = event => {
    var target = event.target,
    x = (parseFloat(target.getAttribute('data-x')) || 0),
    y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
};


export default class Interactable extends Component {

	render() {
		return cloneElement(this.props.children, { 
			ref: node => this.node = node, 
			draggable: false
		});
	}

	componentDidMount() {
		this.interact = interact(findDOMNode(this.node));
		this.setInteractions();
	}

	componentWillReceiveProps() {
		this.interact = interact(findDOMNode(this.node));
		this.setInteractions();
	}

	setInteractions() {
        const draggableOptions = {
            onstart: (event) => {
                event.target.setAttribute('data-x', this.props.currentPos.x);
                event.target.setAttribute('data-y', this.props.currentPos.y);
                event.target.style.transition = 'none';
            },
            onmove: onDragMove,
            onend: (event) => {
                this.props.onUpdate({dx: event.dx, dy: event.dy});
                event.target.style.webkitTransition = event.target.style.transition = '';
            },
        };
        const resizableOptions = {
            edges: { left: true, right: true, bottom: true, top: true },
            onstart: (event) => {
                event.target.setAttribute('data-x', this.props.currentPos.x);
                event.target.setAttribute('data-y', this.props.currentPos.y);
                event.target.style.transition = 'none';
            },
            onmove: onResize,
            onend: (event) => {
                this.props.onUpdate({
                    dx: Math.max(0, event.dx), 
                    dy: Math.max(0, event.dy),
                    width: event.target.style.width,
                    height: event.target.style.height,
                });
                event.target.style.webkitTransition = event.target.style.transition = '';
            },
        };
    
        this.interact.draggable(draggableOptions);
		this.interact.resizable(resizableOptions);
	}
}