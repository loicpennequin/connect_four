import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  usersById: {},
  currentUserId: null,
  isLoading: false,
  error: null
}

function startLoading(state) {
  state.isLoading = true;
}

function loadingFailed(state, { payload }) {
  state.isLoading = false;
  state.error = payload
}

const { actions, reducer } = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getCurrentUserStart: startLoading,
    getUsersStart: startLoading,
    getUserStart: startLoading,
    createUserStart: startLoading,
    getCurrentUserSuccess(state, { payload }) {
      state.isLoading = false;
      state.error = null;
      state.usersById[payload.id] = payload;
      state.currentUserId = payload.id;
    },
    getUserSuccess(state, { payload }) {
      state.isLoading = false;
      state.error = null;
      state.usersById[payload.id] = payload;
    },
    getUsersSuccess(state, { payload }) {
      state.isLoading = false;
      state.error = null;
      payload.forEach(user => {
        state.usersById[user.id] = user;
      })
    },
    createUserSuccess(state) {
      state.isLoading = false;
      state.error = null
    },
    getCurrentUserFailure: loadingFailed,
    getUsersFailure: loadingFailed,
    getUserFailure: loadingFailed,
    createUserFailure: loadingFailed
  }
});

export const userActions = actions;
export const usersReducer = reducer;