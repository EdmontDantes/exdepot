import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchWatchList = createAsyncThunk(
  "fetchWatchLists",
  async (args, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    const fetchUrl = "https://heed.place/api/watchlist/";
    const response = await fetch(fetchUrl, {
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    let watchList = await response.json();
    return watchList.myWatchList;
  }
);

export const watchSlice = createSlice({
  name: "watch",
  initialState: {
    watchList: [],
  },
  reducers: {
    setWatch: (state, { payload }) => {
      state.watchList = payload.watchList;
    },
  },
  extraReducers: {
    [fetchWatchList.fulfilled]: (state, action) => {
      state.watchList = action.payload;
    },
  },
});
export const { setWatch } = watchSlice.actions;
