import React, { Component } from "react";
import { DropzoneArea } from "material-ui-dropzone";
import Button from "@material-ui/core/Button";
import Dashboard from "../../dashboard/Dashboard";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import "./CreateNewListing.scss";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { setCategoryList } from "../../reducers/categoryreducer";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class CreateNewListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      itemName: "",
      itemDescription: "",
      exchangeDescription: "",
      category: {},
    };
  }
  handleChange(files) {
    this.setState(
      {
        files: files,
      },
      () => {
        console.log(this.state.files);
      }
    );
  }

  async componentDidMount() {
    const response = await fetch(
      "https://heed.place/api/categories/fetchAllCategories",
      {
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let jsondata = await response.json();
    this.props.setCategoryList({ categoryList: jsondata.fetchallCategories });
  }

  render() {
    return (
      <Dashboard>
        <div className="create-listing-container">
          <div className="images-upload-wrapper">
            <DropzoneArea
              filesLimit={24}
              maxFileSize={250000000}
              onChange={this.handleChange.bind(this)}
            />
          </div>
          <div className="input-container">
            <TextField
              classes={{ root: "text-area-styling" }}
              label="Item Name"
              variant="outlined"
              value={this.state.itemName}
              onChange={(e) => {
                this.setState({ itemName: e.target.value });
                console.log("item name", this.state.itemName);
              }}
            />
            <h4 className="title-for-text-input">Item Description:</h4>
            <TextareaAutosize
              className="text-area-styling"
              id="outlined-basic"
              aria-label="item description"
              rowsMin={8}
              placeholder="Description of the item you're trying to give for some other item from another person"
              value={this.state.itemDescription}
              onChange={(e) => {
                this.setState({ itemDescription: e.target.value });
                console.log("item Desc", this.state.itemDescription);
              }}
            />
          </div>

          <div className="input-container">
            <h4 className="title-for-text-input">
              What I want for this this item:
            </h4>
            <TextareaAutosize
              className="text-area-styling"
              id="outlined-basic"
              aria-label="item description"
              rowsMin={8}
              placeholder="say what you would like to trade it with "
              value={this.state.exchangeDescription}
              onChange={(e) => {
                this.setState({ exchangeDescription: e.target.value });
                console.log(
                  "exchangeDescription",
                  this.state.exchangeDescription
                );
              }}
            />
          </div>
          <Autocomplete
            id="combo-box-demo"
            options={this.props.categoryList}
            getOptionLabel={(option) => option.CategoryName}
            value={this.state.category}
            onChange={(e, value) => {
              this.setState({ category: value }, () => {
                console.log(this.state.category);
              });
            }}
            style={{ width: 400 }}
            renderInput={(params) => (
              <TextField {...params} label="Pick Category" variant="outlined" />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            // className={classes.submit}
            onClick={async () => {
              const formData = new FormData();
              formData.append("name", this.state.itemName);
              formData.append("description", this.state.itemDescription);
              formData.append(
                "exchangeDescription",
                this.state.exchangeDescription
              );
              formData.append("categoryID", this.state.category._id);

              for (let i = 0; i < this.state.files.length; i++) {
                let file = this.state.files[i];
                formData.append(`image_${i}`, file);
              }
              const response = await fetch(
                "https://heed.place/api/listings/createListing",
                {
                  method: "POST",
                  mode: "cors",
                  credentials: "same-origin",
                  headers: {
                    // 'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.props.authToken}`,
                  },

                  // itemName: '',
                  // itemDescription: '',
                  // exchangeDescription: '',
                  // // category: {},
                  // body: JSON.stringify({
                  //   name: this.state.itemName ,
                  //   description: this.state.itemDescription,
                  //   exchangeDescription: this.state.exchangeDescription,
                  //   categoryID: this.state.category._id,
                  //   images: [],
                  // }),
                  body: formData,
                }
              );
              let jsondata = await response.json();
              console.log("request from fe create listing", jsondata);
            }}
          >
            Create New Listing
          </Button>
        </div>
      </Dashboard>
    );
  }
}

// export default CreateNewListing;

const mapStateToProps = (state) => {
  return {
    categoryList: state.category.categoryList,
    authToken: state.auth.token,
  };
};
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setCategoryList,
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(CreateNewListing);
