import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { waitTwoSeconds } from "../../utils";

export const __getTodos = createAsyncThunk("GET_TODOS", async (_, thunkAPI) => {
  try {
    const response = await axios.get("http://localhost:5001/todos");
    return response.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.code);
  }
});

export const __addToDo = createAsyncThunk(
  "ADD_TODO",
  async (payload, thunkAPI) => {
    await waitTwoSeconds();
    try {
      const data = await axios.post("http://localhost:5001/todos", payload);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.code);
    }
  }
);

export const __deleteTodo = createAsyncThunk(
  "DELETE_TODO",
  async (payload, thunkAPI) => {
    try {
      axios.delete(`http://localhost:5001/todos/${payload}`);
      return payload;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.code);
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(__getTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(__getTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(__getTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(__addToDo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(__addToDo.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(__addToDo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(__deleteTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(__deleteTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((todo) => todo.id !== action.payload);
      })
      .addCase(__deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default todosSlice.reducer;
