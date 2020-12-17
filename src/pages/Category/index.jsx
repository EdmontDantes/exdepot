import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import "./discover.scss";
// import { CategoryItem } from '../Discover';
import MyListing from "../MyListing";
import Dashboard from "../../dashboard/Dashboard";
import Card from "./Card";
import { setCategoryList } from "../../reducers/categoryreducer";
import { setListing } from "../../reducers/listingreducer";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NavLink } from "react-router-dom";

class CategoryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: {},
      listing: {},
    };
  }

  render() {
    const { category, selectCategory } = this.props;
    return (
      <div className="single-category-display">
        <NavLink to={`/categories/${category._id}`}>
          <img
            className="category-image"
            src={category.image}
            alt={category.name}
            onClick={async () => {
              selectCategory(category);
              const response = await fetch(
                `https://heed.place/api/listings/fetchcategorylisting/${this.props.category._id}`,
                {
                  method: "GET",
                  mode: "cors",
                  credentials: "same-origin",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.props.authToken}`,
                  },
                }
              );
              let jsondata = await response.json();
              let filteredResultsForOnlyOtherUsersListing = jsondata.categoryListing.filter(
                (categoryCard) => categoryCard.ownerUserID !== this.props.userID
              );
              // console.log("filteredResultsForOnlyOtherUsersListing", filteredResultsForOnlyOtherUsersListing)
              console.log("this.props.userID in category", this.props.userID);
              this.props.setListing({
                listingList: filteredResultsForOnlyOtherUsersListing,
              });
            }}
            // onClick={async () => {
            //   const response = await fetch(
            //     `https://heed.place/api/listings/fetchcategorylisting/${this.props.category._id}`,
            //     {
            //       method: 'GET',
            //       mode: 'cors',
            //       credentials: 'same-origin',
            //       headers: {
            //         'Content-Type': 'application/json',
            //         Authorization: `Bearer ${this.props.authToken}`,
            //       },
            //     }
            //   );
            //   let jsondata = await response.json();
            //   this.props.setListing({ listingList: jsondata.categoryListing });
            // }}
          />
        </NavLink>
        {category.CategoryName}
      </div>
    );
  }
}

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listing: {},
      categoryId: "",
    };
  }
  selectCategory = (category) => {
    this.setState({
      categoryId: category._id,
    });
  };
  async componentDidMount() {
    const response = await fetch(
      "https://heed.place/api/categories/fetchAllCategories",
      {
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.props.authToken}`,
        },
      }
    );
    let jsondata = await response.json();
    this.props.setCategoryList({ categoryList: jsondata.fetchallCategories });
    // const categoryId = window.location.pathname.split('/')[2]
    // this.setState({
    //   categoryId: categoryId,

    // })
  }

  async componentDidUpdate() {
    const categoryId = window.location.pathname.split("/")[2];

    if (this.state.categoryId !== categoryId) {
      this.setState({
        categoryId: categoryId,
      });
    }
  }

  render() {
    const category = this.props.categoryList.find(
      (c) => c._id == this.state.categoryId
    );
    const displayCards = this.props.listing.listingList.map((item) => {
      return (
        <Card
          listingID={item._id}
          title={item.name}
          bids={item.ItemBids}
          authToken={this.props.authToken}
          image={
            item.images[0]
              ? item.images[0]
              : "https://media.istockphoto.com/photos/single-cloud-central-in-blue-sky-picture-id667409780"
          }
        />
      );
    });
    const categoryItemsMappedoutToDisplay = this.props.categoryList.map(
      (category) => {
        return (
          <CategoryItem
            category={category}
            setListing={this.props.setListing}
            authToken={this.props.authToken}
            userID={this.props.userID}
            selectCategory={this.selectCategory}
          />
        );
      }
    );
    return (
      <Dashboard>
        <div>
          <h2 className="title-component-discover">Full List of Categories</h2>
          <h2 className="title-component-discover">
            this is category: {category && category.CategoryName}
          </h2>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Paper elevation={5}>
                <div className="display-all-items-wrapper">
                  {categoryItemsMappedoutToDisplay}
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <h2 className="title-component-discover">
                Items in Selected Category: {category && category.CategoryName}
              </h2>
              <Paper elevation={5}>
                <div className="display-all-items-wrapper">
                  <div className="cards">{displayCards}</div>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Dashboard>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    categoryList: state.category.categoryList,
    listing: state.listing,
    authToken: state.auth.token,
    userID: state.auth.userID,
  };
};
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setListing,
      setCategoryList,
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(Categories);
