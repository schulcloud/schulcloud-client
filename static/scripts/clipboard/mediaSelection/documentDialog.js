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
        const rand = Math.floor((1 + Math.random()) * 0x10000);
        this.props.onClose({
            src: `https://etherpad.mjanke.com/p/clipboard-${rand}-${name}?showControls=true&showChat=false&showLineNumbers=true&useMonospaceFont=false&lang=de`,
            name: `Etherpad: ${name}`,
            type: 'etherpad'
        });
    }

    close = () => {
        this.props.onClose();
    }

    input = React.createRef();

    componentDidUpdate() {
        window.setTimeout(() => this.input.current && this.input.current.focus(), 100);
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
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={this.close} color="primary">
                    Abbrechen
                </Button>
                <Button onClick={this.closeWithDocument} color="primary">
                    Erstellen
                </Button>
                </DialogActions>
            </Dialog>
        );
    }
}