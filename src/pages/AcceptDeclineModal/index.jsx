import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { useDispatch } from "react-redux";
import { fetchOtherUsersBidsOnMyListing } from "../../reducers/sellerbiddedonbidsitemsreducer";

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
  },
  root: {
    width: "auto",
    marginBottom: 10,
  },
  media: {
    height: 80,
    width: 150,
  },
  cardActionButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  imageCard: {
    display: "flex",
    flexDirection: "row",
  },
  bidItem: {
    marginLeft: 5,
  },
  offerDetail: {
    height: 800,
    overflowY: "scroll",
  },
}));

export function ImageCard(props) {
  const classes = useStyles();
  return (
    <div className={classes.bidItem}>
      <CardMedia className={classes.media} image={props.image} />
      <Typography variant="body2" color="textSecondary" component="p">
        {props.name}
      </Typography>
    </div>
  );
}

export function MediaCard(props) {
  const classes = useStyles();

  const dispatch = useDispatch();

  const imagesOfTheSellersItemInMediaCard = props.imagesOfTheSellersItem.map(
    (itemOfImage) => {
      return <ImageCard image={itemOfImage} />;
    }
  );

  // console.log("props for MediaCard in AcceptDecline", props)

  const itemsbidsFromOtherUsersArrPassedIntoMediaCard = props.itemsbidsFromOtherUsers.map(
    (itemsbidsOnYourItem) => {
      return (
        <ImageCard
          image={itemsbidsOnYourItem.images[0]}
          name={itemsbidsOnYourItem.name}
        />
      );
    }
  );
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h3">
          <div className={classes.imageCard}>
            {imagesOfTheSellersItemInMediaCard}
          </div>
          {props.title}
        </Typography>
        <Typography variant="h9">Bids on my item with these items:</Typography>
        <div className={classes.imageCard}>
          {itemsbidsFromOtherUsersArrPassedIntoMediaCard}
        </div>
      </CardContent>
      <CardActions className={classes.cardActionButtons}>
        <Button
          variant="outlined"
          color="primary"
          onClick={async () => {
            const response = await fetch(
              `https://heed.place/api/listingbid/declinebid`,
              {
                method: "PUT",
                mode: "cors",
                credentials: "same-origin",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${props.authToken}`,
                },
                body: JSON.stringify({
                  _id: props.itemsbidCardID,
                }),
              }
            );
            let jsondata = await response.json();
            dispatch(fetchOtherUsersBidsOnMyListing());
          }}
        >
          Decline
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            const response = await fetch(
              `https://heed.place/api/listingbid/acceptbid`,
              {
                method: "PUT",
                mode: "cors",
                credentials: "same-origin",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${props.authToken}`,
                },
                body: JSON.stringify({
                  _id: props.itemsbidCardID,
                  listingID: props.listingID,
                }),
              }
            );
            let jsondata = await response.json();
            dispatch(fetchOtherUsersBidsOnMyListing());
          }}
        >
          Accept
        </Button>
      </CardActions>
    </Card>
  );
}

export default function TransitionsModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // console.log("transition Modal in acceptDeclineModal index", props)
  const filteredActiveBidsCardsData = props.sellerbiddedonbids.filter(
    (onlyActiveNeededElement) => onlyActiveNeededElement.status === "active"
  );
  const displayUser = filteredActiveBidsCardsData.map((itembidsCard) => {
    return (
      <MediaCard
        key={itembidsCard._id}
        itemsbidCardID={itembidsCard._id}
        title={itembidsCard.listing.name}
        listingID={itembidsCard.listing._id}
        imagesOfTheSellersItem={itembidsCard.listing.images}
        itemsbidsFromOtherUsers={itembidsCard.items_bid}
        authToken={props.authToken}
      />
    );
  });

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        {`Bids: ${props.bidCount}`}
      </button>
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
            <h2 id="transition-modal-title">Item Bids</h2>
            <div className={classes.offerDetail}>{displayUser}</div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
