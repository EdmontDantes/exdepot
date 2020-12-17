import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AcceptDeclineModal from "../AcceptDeclineModal/";
import Typography from "@material-ui/core/Typography";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    marginBottom: 50,
    marginRight: 50,
  },
  media: {
    height: 200,
    width: 345,
  },
  cardActionButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
});

export default function MediaCard(props) {
  const classes = useStyles();
  // console.log("MyListing Card.jsx props", props)
  const token = useSelector((state) => state.auth.token);
  return (
    <Card className={classes.root}>
      <NavLink to={`/prodetail/${props.listingID}`} listingID={props.listingID}>
        <CardMedia className={classes.media} image={props.image} />
      </NavLink>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h3">
          {props.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          <AcceptDeclineModal
            bidCount={props.bidCount}
            sellerbiddedonbids={props.sellerbiddedonbids}
            authToken={props.authToken}
          />
        </Typography>
      </CardContent>
      <CardActions
        className={classes.cardActionButtons}
        onClick={async () => {
          const response = await fetch(
            `https://heed.place/api/listings/deleteListing`,
            {
              method: "DELETE",
              mode: "cors",
              credentials: "same-origin",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                id: props.listingID,
              }),
            }
          );
          let jsondata = await response.json();
          console.log(jsondata);
          // dispatch(fetchOtherUsersBidsOnMyListing())
        }}
      >
        <Button size="small" color="primary">
          {<DeleteForeverIcon />}
        </Button>
      </CardActions>
    </Card>
  );
}
