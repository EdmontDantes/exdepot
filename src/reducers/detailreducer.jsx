import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchDetail = createAsyncThunk(
  "fetchDetail",
  async (listingID, thunkAPI) => {
    // let listingID = window.location.pathname.split('/')[2];
    const token = thunkAPI.getState().auth.token;

    const fetchUrl = `https://heed.place/api/listings/fetchone/${listingID}`;
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
    return jsondata.oneListing;
  }
);

export const detailSlice = createSlice({
  name: "detail",
  initialState: {
    listingDetail: null,
  },
  reducers: {
    setDetail: (state, { payload }) => {
      state.listingDetail = payload.listingDetail;
    },
  },
  extraReducers: {
    [fetchDetail.fulfilled]: (state, action) => {
      state.listingDetail = action.payload;
    },
  },
});
export const { setDetail } = detailSlice.actions;
