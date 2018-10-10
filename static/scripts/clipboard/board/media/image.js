import React, { Component, cloneElement } from 'react';
import { debounce } from '../helper';

import Hammer from 'hammerjs';

export default class Interactable extends Component {

    minScale = 1;
    maxScale = 4;

    containerWidth;
    containerHeight;
    rangeX=0;
    rangeY=0;
    rangeMaxX=0;
    rangeMaxY=0;
    rangeMinX=0;
    rangeMinY=0;

    displayDefaultWidth;
    displayDefaultHeight;

    displayImageX=0;
    displayImageY=0;
    displayImageScale=1;

    displayImageCurrentX = 0;
    displayImageCurrentY = 0;
    displayImageCurrentScale = 1;

    componentDidUpdate() {
        if(this.props.style){
            let style = this.props.style;
            this.displayImageScale = style.scale;
            this.displayImageCurrentX = style.x*this.containerWidth;
            this.displayImageCurrentY = style.y*this.containerHeight;
        }
        this.updateRange();
        this.updateDisplayImage(this.displayImageCurrentX, this.displayImageCurrentY, this.displayImageScale);  
    }

    clamp(value, min, max) {
        return Math.min(Math.max(min, value), max);
    }
      
    clampScale(newScale) {
        return this.clamp(newScale, this.minScale, this.maxScale);
    }

    imageLoaded() {
        this.image.addEventListener('mousedown', e => e.preventDefault(), false);
        this.displayDefaultWidth = this.image.offsetWidth;
        this.displayDefaultHeight = this.image.offsetHeight;
        this.rangeX = Math.max(0, this.displayDefaultWidth - this.containerWidth);
        this.rangeY = Math.max(0, this.displayDefaultHeight - this.containerHeight);
    }

    updateRange() {
        this.rangeX = Math.max(0, Math.round(this.displayDefaultWidth * this.displayImageCurrentScale) - this.containerWidth);
        this.rangeY = Math.max(0, Math.round(this.displayDefaultHeight * this.displayImageCurrentScale) - this.containerHeight);
        
        this.rangeMaxX = Math.round(this.rangeX / 2);
        this.rangeMinX = 0 - this.rangeMaxX;
      
        this.rangeMaxY = Math.round(this.rangeY / 2);
        this.rangeMinY = 0 - this.rangeMaxY;
    }

    updateDisplayImage(x, y, scale) {
        const transform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0px) scale(' + scale + ',' + scale + ')';
        this.image.style.transform = transform;
        this.image.style.WebkitTransform = transform;
        this.image.style.msTransform = transform;
    }
      
    resizeContainer() {
        this.containerWidth = this.imageContainer.offsetWidth;
        this.containerHeight = this.imageContainer.offsetHeight;
        if (this.displayDefaultWidth !== undefined && this.displayDefaultHeight !== undefined) {
          this.displayDefaultWidth = this.image.offsetWidth;
          this.displayDefaultHeight = this.image.offsetHeight;
          this.updateRange();
          this.displayImageCurrentX = this.clamp(this.displayImageX, this.rangeMinX, this.rangeMaxX );
          this.displayImageCurrentY = this.clamp(this.displayImageY, this.rangeMinY, this.rangeMaxY );
          this.updateDisplayImage(
            this.displayImageCurrentX,
            this.displayImageCurrentY,
            this.displayImageCurrentScale );
        }
    }

    onImageScroll(event) {
        this.displayImageScale = this.displayImageCurrentScale = this.clampScale(this.displayImageScale + (event.wheelDelta / 800));
        this.updateRange();
        this.displayImageCurrentX = this.clamp(this.displayImageCurrentX, this.rangeMinX, this.rangeMaxX);
        this.displayImageCurrentY = this.clamp(this.displayImageCurrentY, this.rangeMinY, this.rangeMaxY);
        
        this.updateDisplayImage(this.displayImageCurrentX, this.displayImageCurrentY, this.displayImageScale);
        this.sendUpdate();
    }

    sendUpdate = 
        debounce(() => {
            this.props.onUpdate({
                style: {
                    x:this.displayImageCurrentX/this.containerWidth,
                    y:this.displayImageCurrentY/this.containerHeight, 
                    scale: this.displayImageCurrentScale
                }
            });
        }, 1000);
    

	render() {
        return <div 
                ref={node => this.imageContainer = node}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    overflow: 'hidden',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                >
                    <img 
                        src={this.props.src} 
                        ref={node => this.image = node}
                        onLoad={() => this.imageLoaded()}
                        style={{
                            display:'block',
                            maxWidth:'100%',
                            maxHeight:'100%',
                            cursor: 'move',
                            touchAction: 'none'}}
                    />
                </div>;
	}

	componentDidMount() {
        window.addEventListener('resize', this.resizeContainer.bind(this), true);
        this.image.addEventListener('wheel', this.onImageScroll.bind(this), false);
        this.initHammer();
        this.resizeContainer();
	}

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeContainer.bind(this));
        this.image.removeEventListener('wheel', this.onImageScroll.bind(this), false);
    }

    initHammer() {
        const hammer = new Hammer(this.image);

        hammer.get('pinch').set({ enable: true });
        hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

        hammer.on('pan', ev => {  
            this.displayImageCurrentX = this.clamp(this.displayImageX + ev.deltaX, this.rangeMinX, this.rangeMaxX);
            this.displayImageCurrentY = this.clamp(this.displayImageY + ev.deltaY, this.rangeMinY, this.rangeMaxY);
            this.updateDisplayImage(this.displayImageCurrentX, this.displayImageCurrentY, this.displayImageScale);
        });

        hammer.on('pinch pinchmove', ev => {
            this.displayImageCurrentScale = this.clampScale(ev.scale * this.displayImageScale);
            this.updateRange();
            this.displayImageCurrentX = this.clamp(this.displayImageX + ev.deltaX, this.rangeMinX, this.rangeMaxX);
            this.displayImageCurrentY = this.clamp(this.displayImageY + ev.deltaY, this.rangeMinY, this.rangeMaxY);
            this.updateDisplayImage(this.displayImageCurrentX, this.displayImageCurrentY, this.displayImageCurrentScale);
        });

        hammer.on('panend pancancel pinchend pinchcancel', () => {
            this.displayImageScale = this.displayImageCurrentScale;
            this.displayImageX = this.displayImageCurrentX;
            this.displayImageY = this.displayImageCurrentY;
            this.sendUpdate();
        });  
    }
}