import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';

export default class DocumentDialog extends React.Component{

    closeWithDocument = () => {
        const name = this.input.current.value;
        this.props.onClose({
            name: `Etherpad: ${name}`,
            etherpadName: name,
            type: 'etherpad'
        });
    }

    handleTextFieldKeyDown = event => {
        switch (event.key) {
            case 'Enter':
                this.closeWithDocument();
                break;
            case 'Escape':
                this.close();
                break;
            default: break;
        }
    }

    close = () => {
        this.props.onClose();
    }

    input = React.createRef();

    componentDidUpdate() {
        setTimeout(() => this.input.current && this.input.current.focus(), 500);
    }

    render() {
        const {open} = this.props;

        return (
            <Dialog onClose={this.close} open={open}>
                <DialogTitle id="simple-dialog-title">Dokument erstellen</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Gib dem Dokument noch einen Namen.
                    </DialogContentText>
                    <TextField
                        inputRef={this.input}
                        label="Name"
                        onKeyDown={this.handleTextFieldKeyDown}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={this.close} color="secondary" variant="outlined">
                    Schließen
                </Button>
                <Button onClick={this.closeWithDocument} color="secondary" variant="contained">
                    Erstellen
                </Button>
                </DialogActions>
            </Dialog>
        );
    }
}