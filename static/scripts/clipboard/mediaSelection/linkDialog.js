import React from 'react';
import Button from '@material-ui/core/Button';
import LinkIcon from '@material-ui/icons/Link';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';

export default class LinkDialog extends React.PureComponent{

    closeWithLink = () => {
        let link = this.input.current.value;
        this.props.onClose({
            src: link,
            type: 'link'
        });
    }

    handleTextFieldKeyDown = event => {
        switch (event.key) {
            case 'Enter':
                this.closeWithLink();
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
        const { open } = this.props;
        return <Dialog onClose={this.close} open={open}>
            <DialogTitle id="simple-dialog-title">Link teilen</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Füge hier ein Link ein, um es allen Geräten zur Verfügung zu stellen
            </DialogContentText>
            <TextField
                onKeyDown={this.handleTextFieldKeyDown}
                inputRef={this.input}
                label="Link"
                fullWidth
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={this.close} color="secondary" variant="outlined">
                Schließen
            </Button>
            <Button onClick={this.closeWithLink} color="secondary" variant="contained">
                Teilen
            </Button>
            </DialogActions>
        </Dialog>;
    }
}