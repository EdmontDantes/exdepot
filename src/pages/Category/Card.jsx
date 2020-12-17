import { React, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Typography from "@material-ui/core/Typography";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setWatch, fetchWatchList } from "../../reducers/watchreducer";

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
  cardTitle: {
    display: "flex",
    justifyContent: "space-between",
  },
});

export default function CategoryListCard(props) {
  const classes = useStyles();
  const watchList = useSelector((state) => state.watch.watchList);
  const watchListIds = watchList.map((item) => item.listingID);
  const isWatched = watchListIds.indexOf(props.listingID) >= 0;
  // const isWatched = false
  const dispatch = useDispatch();
  return (
    <Card className={classes.root}>
      <NavLink to={`/prodetail/${props.listingID}`} listingID={props.listingID}>
        <CardMedia className={classes.media} image={props.image} />
      </NavLink>
      <CardContent>
        <div className={classes.cardTitle}>
          <Typography gutterBottom variant="h5" component="h3">
            {props.title}
          </Typography>
          <div>
            {isWatched && props.authToken !== null ? (
              <BookmarkIcon
                onClick={async (e, value) => {
                  e.stopPropagation();
                  const response = await fetch(
                    "https://heed.place/api/watchlist/toggle",
                    {
                      method: "POST",
                      mode: "cors",
                      credentials: "same-origin",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${props.authToken}`,
                      },
                      body: JSON.stringify({
                        listingID: `${props.listingID}`,
                      }),
                    }
                  );
                  let jsondata = await response.json();
                  dispatch(fetchWatchList());
                }}
              />
            ) : props.authToken !== null ? (
              <BookmarkBorderIcon
                onClick={async (e, value) => {
                  e.stopPropagation();
                  const response = await fetch(
                    "https://heed.place/api/watchlist/toggle",
                    {
                      method: "POST",
                      mode: "cors",
                      credentials: "same-origin",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${props.authToken}`,
                      },
                      body: JSON.stringify({
                        listingID: `${props.listingID}`,
                      }),
                    }
                  );
                  let jsondata = await response.json();
                  dispatch(fetchWatchList());

                  // dispatch(setWatch({watchList:jsondata.myWatchList}))
                }}
              />
            ) : null}
          </div>
        </div>
        <Typography variant="body2" color="textSecondary" component="p">
          Bids:{props.bids}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActionButtons}>
        <Button size="small" color="primary">
          {<EditIcon />}
        </Button>
        <Button size="small" color="primary">
          {<DeleteForeverIcon />}
        </Button>
      </CardActions>
    </Card>
  );
}
