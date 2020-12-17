import React, { Component } from "react";
import CreateIcon from "@material-ui/icons/Create";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import Typography from "@material-ui/core/Typography";
import GavelTwoToneIcon from "@material-ui/icons/GavelTwoTone";
import "./watchList.scss";
import { NavLink } from "react-router-dom";
import Dashboard from "../../dashboard/Dashboard";

import { setWatch, fetchWatchList } from "../../reducers/watchreducer";
import { useSelector, useDispatch } from "react-redux";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

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

export function MediaCard(props) {
  const classes = useStyles();
  const watchList = useSelector((state) => state.watch.watchList);
  const authTokenInFuncCompState = useSelector((state) => state.auth.token);
  console.log("WatchList = useSelector", watchList);
  const watchListIds = watchList.map((element) => element.listingID);
  const isWatched = watchListIds.indexOf(props.listingID) >= 0;
  // const isWatched = false
  const dispatch = useDispatch();
  return (
    <Card className={classes.root}>
      <NavLink to={`/prodetail/${props.listingID}`} listingID={props.listingID}>
        <CardMedia className={classes.media} image={props.image} />
      </NavLink>
      <CardContent>
        <div className="cardTitle">
          <Typography gutterBottom variant="h5" component="h3">
            {props.title}
          </Typography>
          {isWatched && authTokenInFuncCompState !== null ? (
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
                      Authorization: `Bearer ${authTokenInFuncCompState}`,
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
          ) : authTokenInFuncCompState !== null ? (
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
                      Authorization: `Bearer ${authTokenInFuncCompState}`,
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
        <Typography variant="body1" color="textPrimary" component="h3">
          Owner: {props.owner}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Bids:{props.bids}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActionButtons}>
        <NavLink to="/makeoffer/prodId9283dfs8902">
          <Button
            variant="contained"
            color="primary"
            startIcon={<GavelTwoToneIcon />}
          >
            Make A Bid
          </Button>
        </NavLink>
      </CardActions>
    </Card>
  );
}

class WatchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      watchList: {},
    };
  }

  async componentDidMount() {
    this.props.fetchWatchList();

    // const response = await fetch(
    //   'https://heed.place/api/watchlist/',
    //   {
    //     method: 'GET',
    //     mode: 'cors',
    //     credentials: 'same-origin',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${this.props.authToken}`
    //     },
    //   }
    // );
    // let jsondata = await response.json();

    // this.props.setWatch({watchList: jsondata.myWatchList})
  }
  render() {
    const displayCards = this.props.watch.watchList.map((watchList) => {
      return (
        <MediaCard
          title={watchList.item.name}
          owner={watchList.item.ownerUserName}
          // bids={item.ItemBids}
          image={watchList.item.images[0]}
          listingID={watchList.item._id}
        />
      );
    });
    return (
      <Dashboard>
        <div className="watch-list-container">
          <div className="heading">
            <Typography variant="h5">My Watch List</Typography>
          </div>
          <div className="card-wrapper">
            <div className="cards">{displayCards}</div>
          </div>
        </div>
      </Dashboard>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    watch: state.watch,
    authToken: state.auth.token,
  };
};
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setWatch,
      fetchWatchList,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(WatchList);
