import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

export default class confirmDialog extends React.PureComponent{

    closeNo = () => {
        this.props.onClose(false);
    }

    closeYes = () => {
        this.props.onClose(true);
    }

    render() {
        const { open, title } = this.props;
        return <Dialog onClose={this.closeNo} open={open}>
            <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Bist du dir sicher?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={this.closeNo} color="secondary" variant="outlined">
                Nein
            </Button>
            <Button onClick={this.closeYes} color="secondary" variant="contained">
                Ja
            </Button>
            </DialogActions>
        </Dialog>;
    }
}