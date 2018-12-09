import React from 'react';
import ReactDOM from 'react-dom';
import ClipboardApp from './app';
import configureStore from './redux/store';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


$(document).ready(function () {
    const appDiv = $('#clipboard-app')[0];

    const store = configureStore();

    const theme = createMuiTheme({
        palette: {
            type: 'dark',
            primary: { main: '#b10438' },
            secondary: { main: '#e2661d' },
        },
        typography: {
            useNextVariants: true,
            suppressDeprecationWarnings: true
        },
    });      

    ReactDOM.render(
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <ClipboardApp 
                    backendUrl={appDiv.getAttribute('data-backend-url')}  
                    courseId={appDiv.getAttribute('data-course-id')} 
                />
            </MuiThemeProvider>
        </Provider>,
        appDiv
    );
});

