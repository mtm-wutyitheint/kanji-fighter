import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

function ErrorHandleDialog(props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
    props.close(false);
  };

  let detailMessage = null;
  if (props.status) {
    if (props.status === 401) {
      detailMessage = "Your Login session expired! Please login again...";
    } else if (props.status === 400) {
      detailMessage = "Bad Request! Please check your request...";
    } else if (props.status === 403) {
      detailMessage = "You have no permission to call this request...";
    } else if (props.status === 404) {
      detailMessage = "Server can't find your request!!!";
    } else if (props.status === 500) {
      detailMessage = "Server Error Occur !!!";
    }
  }

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
        <DialogContentText id="alert-dialog-description">
          <span>Status :</span>
          {props.status}
        </DialogContentText>
        <DialogContentText id="alert-dialog-description">
          <span>Message :</span>
          {props.message}
        </DialogContentText>
        {detailMessage && (
          <DialogContentText id="alert-dialog-description">
            {detailMessage}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ErrorHandleDialog;
