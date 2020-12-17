import React, { useState, useEffect } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { setMessage, fetchMessage } from "../../reducers/messagereducer";

import "./message.scss";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "scroll",
    overflow: "scroll",
    display: "flex",
    flexDirection: "column-reverse",
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

export function ChatLayout(props) {
  const classes = useStyles();
  const message = useSelector((state) =>
    state.message.messageListing.find((msg) => msg._id === props.messageID)
  );
  const requserID = useSelector((state) => state.auth.userID);

  const chatBubbles = message.messageList.map((item) => {
    if (item.sender_user_id === requserID) {
      return (
        <div className={`${classes.bubbleContainer} right`}>
          <AccountCircleIcon fontSize="large" />
          <div className="classes.bubbleWrap">
            <div className={classes.bubble}>
              <div className={classes.button}>{item.msg_text}</div>
            </div>
            <Typography color="textSecondary" className="chatTime">
              {item.date_created.split(",")[2]}
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
              {item.date_created.split(",")[2]}
            </Typography>
          </div>
        </div>
      );
    }
  });

  return <div className={classes.container}>{chatBubbles}</div>;
}

export default function Index() {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const userID = useSelector((state) => state.auth.userID);
  const dispatch = useDispatch();

  useEffect(async () => {
    const response = await fetch(
      "https://heed.place/api/message/fetchallmessage",
      {
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let jsondata = await response.json();
    dispatch(setMessage({ messageListing: jsondata.foundMessage }));
  }, []);

  const [open, setOpen] = React.useState(false);
  const [messageID, setMessageID] = React.useState("");
  const [messageText, setMessageText] = React.useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const message = useSelector((state) => state.message.messageListing);

  const displayMessage = message.map((item) => {
    if (item.messageList.length > 0) {
      return (
        <div
          onClick={async () => {
            setMessageID(item._id);
            setOpen(true);
            const response = await fetch(
              "https://heed.place/api/message/markMessageRead",
              {
                method: "PUT",
                mode: "cors",
                credentials: "same-origin",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  id: item._id,
                }),
              }
            );
          }}
        >
          <MessageCard
            UserID={userID}
            UserName={item.user1ID === userID ? item.user2Name : item.user1Name}
            Message={item.messageList[item.messageList.length - 1].msg_text}
            MessageTime={item.messageList.date_created}
            ReadByUser={item.read_by_user_ids}
          />
        </div>
      );
    }
  });
  const messageClicked = useSelector((state) =>
    state.message.messageListing.find((msg) => msg._id === messageID)
  );
  return (
    <Dashboard>
      <div>
        <div className="message-container">{displayMessage}</div>

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
                    let receiver = "";
                    messageClicked.user2ID === userID
                      ? (receiver = messageClicked.user1ID)
                      : (receiver = messageClicked.user2ID);
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
                          user2ID: receiver,
                          text: messageText,
                        }),
                      }
                    );
                    // let jsondata = await response.json();
                    const response2 = await fetch(
                      "https://heed.place/api/message/fetchallmessage",
                      {
                        method: "GET",
                        mode: "cors",
                        credentials: "same-origin",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    let jsondata = await response2.json();
                    dispatch(
                      setMessage({ messageListing: jsondata.foundMessage })
                    );
                  }}
                >
                  send
                </Button>
              </div>
              <ChatLayout messageID={messageID} />
            </div>
          </Fade>
        </Modal>
      </div>
    </Dashboard>
  );
}
