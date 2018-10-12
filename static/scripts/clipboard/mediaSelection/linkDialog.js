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

    close = () => {
        this.props.onClose();
    }

    input = React.createRef();

    render() {
        const { open } = this.props;
        return <Dialog onClose={this.close} open={open}>
            <DialogTitle id="simple-dialog-title">Link teilen</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Füge hier ein Link ein, um es allen Geräten zur Verfügung zu stellen
            </DialogContentText>
            <TextField
                autoFocus
                inputRef={this.input}
                label="Link"
                fullWidth
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={this.close} color="primary">
                Abbrechen
            </Button>
            <Button onClick={this.closeWithLink} color="primary">
                Teilen
            </Button>
            </DialogActions>
        </Dialog>;
    }
}