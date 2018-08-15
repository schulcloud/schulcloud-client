import React from 'react';
import ReactDOM from 'react-dom';
import ClipboardApp from './app';

const appDiv = $('#clipboard-app')[0];

$(document).ready(function () {
    let url = appDiv.getAttribute('data-backend-url');
    console.log(url);
    let courseId = appDiv.getAttribute('data-course-id');
    window.websocketUrl = url;
    window.clipboardSocket = io(url + '/clipboard',  {
        query: "courseId=" + courseId,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax : 5000,
        reconnectionAttempts: Infinity
      });
    ReactDOM.render(
        <ClipboardApp 
            backendUrl={appDiv.getAttribute('data-backend-url')}  
            courseId={appDiv.getAttribute('data-course-id')} 
        />,
        appDiv
    );
});

