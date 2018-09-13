import React from 'react';
import ReactDOM from 'react-dom';
import ClipboardApp from './app';
import configureStore from './redux/store';
import { Provider } from 'react-redux';


$(document).ready(function () {
    const appDiv = $('#clipboard-app')[0];

    const store = configureStore();

    ReactDOM.render(
        <Provider store={store}>
            <ClipboardApp 
                backendUrl={appDiv.getAttribute('data-backend-url')}  
                courseId={appDiv.getAttribute('data-course-id')} 
            />
        </Provider>,
        appDiv
    );
});

