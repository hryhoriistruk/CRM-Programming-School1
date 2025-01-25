import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {groupsService} from "../../services/groups.api.service";
import {IGroupsModel} from "../../models/IGroupsModel";

interface GroupState {
  groups: IGroupsModel[];
}

const initialState: GroupState = {
  groups: [],
};

export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async (_, thunkAPI) => {
    try {
      const response = await groupsService.getGroups();
      return thunkAPI.fulfillWithValue(response);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch groups");
    }
  }
);

export const addGroup = createAsyncThunk(
  "groups/addGroup",
  async (groupName: string, thunkAPI) => {
    try {
      const newGroup = await groupsService.addGroup({ group: groupName.trim() });
      return thunkAPI.fulfillWithValue(newGroup);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to add group");
    }
  }
);

export const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.groups = action.payload;
      })
      .addCase(addGroup.fulfilled, (state, action: PayloadAction<any>) => {
        state.groups.push(action.payload);
      })
  },
});

export const groupsActions = {
  ...groupsSlice.actions,
  fetchGroups,
  addGroup
}