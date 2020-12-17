import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchMyListings = createAsyncThunk(
  "fetchMyListings",
  async (args, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    const fetchUrl = "https://heed.place/api/listings/fetchownerlisting";
    const response = await fetch(fetchUrl, {
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    let jsondata = await response.json();

    return jsondata.ownerListing;
  }
);

export const listingSlice = createSlice({
  name: "listing",
  initialState: {
    listingList: [],
  },
  reducers: {
    setListing: (state, { payload }) => {
      state.listingList = payload.listingList;
    },
  },
  extraReducers: {
    [fetchMyListings.fulfilled]: (state, action) => {
      state.listingList = action.payload;
    },
  },
});
export const { setListing } = listingSlice.actions;
