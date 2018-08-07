import React from 'react';
import ReactDOM from 'react-dom';

const $container = $('#clipboard-app');

class ClipboardApp extends React.Component {
    render() {
        return (
            <div> test </div>
        );
    }
}

ReactDOM.render(
    <ClipboardApp />,
    $container[0]
);

