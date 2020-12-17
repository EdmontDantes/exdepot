import React, { useState } from "react";
import Dashboard from "../../dashboard/Dashboard";
import MessageCard from "./messageCard";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import { useSelector, useDispatch } from "react-redux";

import "./message.scss";
import { setMessage } from "../../reducers/messagereducer";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "scroll",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "50%",
    height: "50%",
    overflow: "scroll",
    display: "flex",
    flexDirection: "column-reverse",
  },

  container: {
    bottom: 0,
  },
  bubbleContainer: {
    width: "100%",
    display: "flex",
  },
  bubble: {
    border: "0.5px solid black",
    borderRadius: "10px",
    margin: "5px",
    padding: "10px",
    display: "inline-block",
  },
  bubbleWrap: {
    display: "flex",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  replyButton: {
    marginTop: 15,
  },
}));

export function ChatLayout() {
  const classes = useStyles();
  const message = useSelector((state) => state.message);
  const requserID = useSelector((state) => state.auth.userID);

  const chatBubbles = message.messageListing[0].messageList.map((item) => {
    if (item.sender_user_id === requserID) {
      return (
        <div className={`${classes.bubbleContainer} right`}>
          <AccountCircleIcon fontSize="large" />
          <div className="classes.bubbleWrap">
            <div className={classes.bubble}>
              <div className={classes.button}>{item.msg_text}</div>
            </div>
            <Typography color="textSecondary" className="chatTime">
              {item.messageTime}
            </Typography>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`${classes.bubbleContainer} left`}>
          <AccountCircleIcon fontSize="large" />
          <div className="classes.bubbleWrap">
            <div className={classes.bubble}>
              <div className={classes.button}>{item.msg_text}</div>
            </div>
            <Typography color="textSecondary" className="chatTime">
              {item.messageTime}
            </Typography>
          </div>
        </div>
      );
    }
  });
  return <div className={classes.container}>{chatBubbles}</div>;
}

export default function MessageModel() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [messageText, setMessageText] = React.useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const detail = useSelector((state) => state.detail.listingDetail);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<SendIcon />}
        onClick={handleOpen}
      >
        Message Owner
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div className={classes.inputContainer}>
              <TextField
                label="Enter Your Message"
                id="messageText"
                name="messageText"
                name="messageText"
                autoComplete="messageText"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <Button
                className={classes.replyButton}
                onClick={async () => {
                  const response = await fetch(
                    "https://heed.place/api/message/sendmessage",
                    {
                      method: "PUT",
                      mode: "cors",
                      credentials: "same-origin",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        user2ID: detail.ownerUserID,
                        text: messageText,
                      }),
                    }
                  );
                  // const response2 = await fetch(
                  //   'https://heed.place/api/message/fetchallmessage',
                  //   {
                  //     method: 'GET',
                  //     mode: 'cors',
                  //     credentials: 'same-origin',
                  //     headers: {
                  //       'Content-Type': 'application/json',
                  //       Authorization: `Bearer ${token}`,
                  //     },
                  //   }
                  // );
                  // let jsondata = await response2.json();
                  // dispatch(setMessage({ messageListing: jsondata.foundMessage }))
                }}
              >
                send
              </Button>
            </div>
            <ChatLayout />
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
