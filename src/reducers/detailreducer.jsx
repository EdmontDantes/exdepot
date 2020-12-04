import { createSlice } from '@reduxjs/toolkit'

export const detailSlice = createSlice({
  name: 'detail',
  initialState: {
    listingDetail: null
  },
  reducers: {
    setDetail: (state, { payload }) => {
      state.listingDetail = payload.listingDetail
    },
  }
})
export const { setDetail } = detailSlice.actions