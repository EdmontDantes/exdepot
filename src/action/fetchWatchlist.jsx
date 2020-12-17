import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setWatch } from "../reducers/watchreducer";

export const fetchWatchList = createAsyncThunk(
  "fetchTodoItems",
  async (args, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    const fetchUrl = "https://heed.place/api/watchlist/";
    const response = await fetch(fetchUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.authToken}`,
      },
    });
    let watchList = await response.json();
    return watchList.myWatchList;
  }
);

// const response = await fetch(
//     'https://heed.place/api/watchlist/',
//     {
//       method: 'GET',
//       mode: 'cors',
//       credentials: 'same-origin',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${this.props.authToken}`
//       },
//     }
//   );
//   let jsondata = await response.json();
//   this.props.setWatch({watchList: jsondata.myWatchList})
// }
