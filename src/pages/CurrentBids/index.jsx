import React, { Component, useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import MyListing from "../MyListing";
import CreateIcon from "@material-ui/icons/Create";
import MessageIcon from "@material-ui/icons/Message";
import PersonIcon from "@material-ui/icons/Person";
import CancelIcon from "@material-ui/icons/Cancel";
import Badge from "@material-ui/core/Badge";
import { Message } from "@material-ui/icons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setCurrBidsList } from "../../reducers/currbidsreducer.jsx";
import Dashboard from "../../dashboard/Dashboard";
import { useSelector, useDispatch } from "react-redux";
const useStyles = makeStyles({
  root: {
    maxWidth: "100%",
    minWidth: "100%",
    marginBottom: 50,
    marginRight: 50,
  },
  media: {
    display: "flex",
    justifyContent: "row",
    height: 200,
    width: 345,
    margin: "5px",
  },
  cardContent: {
    display: "flex",
    justifyContent: "row",
    margin: "5px",
    maxWidth: "100%",
  },
  itemIbidWithName: {
    maxWidth: "50%",
  },
});

export function CardItemIbidWith(props) {
  const classes = useStyles();
  console.log("CardItemsIBidWith", props);
  const multipleItemsCardMedia = props.items_bid.map((item) => {
    return (
      <div className={classes.itemIbidWithName}>
        <Typography variant="h6" component="h6">
          {item.name}
        </Typography>
        <CardMedia className={classes.media} image={item.images[0]} />
      </div>
    );
  });
  return <Card className={classes.cardContent}>{multipleItemsCardMedia}</Card>;
}

export function MediaCard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <Card className={classes.root}>
      <CardMedia className={classes.media} image={props.image}></CardMedia>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h3">
          {props.title}
        </Typography>
        <Typography variant="body1" color="textSecondary" component="p">
          Status:{props.status}
        </Typography>
      </CardContent>
      <Typography gutterBottom variant="h5" component="h5">
        Items I bid with:
      </Typography>
      <CardItemIbidWith items_bid={props.items_bid} />
      <CardActions
        className="card-action-buttons"
        onClick={async () => {
          const response = await fetch(
            `https://heed.place/api/listingbid/cancelbid`,
            {
              method: "PUT",
              mode: "cors",
              credentials: "same-origin",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.usersToken}`,
              },
              body: JSON.stringify({
                _id: props.listingBidId,
              }),
            }
          );
          console.log("Cancel work", response.json());
          // dispatch(fetchOtherUsersBidsOnMyListing())
          const responseToRefreshCurrBids = await fetch(
            "https://heed.place/api/listingbid/fetchownerbid",
            {
              method: "GET",
              mode: "cors",
              credentials: "same-origin",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.usersToken}`,
              },
            }
          );

          let jsondata = await responseToRefreshCurrBids.json();
          dispatch(
            setCurrBidsList({ currBidsList: jsondata.allListingBidByOwner })
          );
          // props.setCurrBidsList({ currBidsList: jsondata.allListingBidByOwner });
        }}
      >
        {props.status === "active" ? (
          <Button size="small" color="secondary">
            {<CancelIcon />} Cancel Bid
          </Button>
        ) : null}
      </CardActions>
    </Card>
  );
}

export function CurrentBidsCards(props) {
  const currBids = useSelector((state) => state.currbids.currBidsList);
  const authToken = useSelector((state) => state.auth.token);
  const filteredDispayCardForAcctive = currBids.filter(
    (filterredCurrBidsActive) => filterredCurrBidsActive.status === "active"
  );
  const displayCards = filteredDispayCardForAcctive.map((item) => {
    return (
      <MediaCard
        title={item.listing.name}
        bids={0}
        image={
          item.listing.images.length
            ? item.listing.images[0]
            : "https://media.istockphoto.com/photos/single-cloud-central-in-blue-sky-picture-id667409780"
        }
        status={item.status}
        items_bid={item.items_bid}
        listingBidId={item._id}
        usersToken={authToken}
      />
    );
  });
  return (
    <div>
      <div className="cards">{displayCards}</div>
    </div>
  );
}

export function AcceptedBidsCards(props) {
  const currBids = useSelector((state) => state.currbids.currBidsList);
  const filteredDispayCardForAcctive = currBids.filter(
    (filterredCurrBidsActive) => filterredCurrBidsActive.status !== "active"
  );
  const displayCards = filteredDispayCardForAcctive.map((item) => {
    return (
      <MediaCard
        title={item.listing.name}
        bids={0}
        image={
          item.listing.images.length
            ? item.listing.images[0]
            : "https://media.istockphoto.com/photos/single-cloud-central-in-blue-sky-picture-id667409780"
        }
        status={item.status}
        items_bid={item.items_bid}
      />
    );
  });
  return (
    <div>
      <div className="cards">{displayCards}</div>
    </div>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStylesForTabs = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export function CurrentBids(props) {
  const classes = useStylesForTabs();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    async function fetchcurrbids() {
      const response = await fetch(
        "https://heed.place/api/listingbid/fetchownerbid",
        {
          method: "GET",
          mode: "cors",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.authToken}`,
          },
        }
      );

      let jsondata = await response.json();
      props.setCurrBidsList({ currBidsList: jsondata.allListingBidByOwner });
    }
    fetchcurrbids();
  });

  return (
    <Dashboard>
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="Active" {...a11yProps(0)} />
            <Tab label="History" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          This is Example of Active items
          <CurrentBidsCards />
        </TabPanel>
        <TabPanel value={value} index={1}>
          This is Example of Accepted items
          <AcceptedBidsCards />
        </TabPanel>
      </div>
    </Dashboard>
  );
}

const mapStateToProps = (state) => {
  return {
    currBidsList: state.currBidsList,
    authToken: state.auth.token,
  };
};
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setCurrBidsList,
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(CurrentBids);
