import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const createMessage = createAsyncThunk(
  "createMessage",
  async (detail, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;

    const fetchUrl = "https://heed.place/api/message/createmessage";
    const response = await fetch(fetchUrl, {
      method: "POST",
      mode: "cors",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user2ID: detail.ownerUserID,
        user2Name: detail.ownerUserName,
      }),
    });
    let jsondata = await response.json();
    return jsondata.savedMessage;
  }
);

export const fetchMessage = createAsyncThunk(
  "fetchMessage",
  async (detail, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    const fetchUrl = "https://heed.place/api/message/createmessage";
    const response = await fetch(fetchUrl, {
      method: "POST",
      mode: "cors",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user2ID: detail.user2ID,
        user2Name: detail.user2Name,
      }),
    });
    let jsondata = await response.json();
    return jsondata.savedMessage;
  }
);

export const messageSlice = createSlice({
  name: "message",
  initialState: {
    messageListing: [],
  },
  reducers: {
    setMessage: (state, { payload }) => {
      state.messageListing = payload.messageListing;
    },
  },
  extraReducers: {
    [createMessage.fulfilled]: (state, action) => {
      state.messageListing = action.payload;
    },
    [fetchMessage.fulfilled]: (state, action) => {
      state.messageListing = action.payload;
    },
  },
});
export const { setMessage } = messageSlice.actions;
