import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  isAnyOf,
} from "@reduxjs/toolkit";
import { baseUrl } from "../api/baseUrl";
import { httpDelete, httpGet, httpPost, httpPut } from "../api/utils";

const usuariosAdapter = createEntityAdapter();

const initialState = usuariosAdapter.getInitialState({
  status: "idle",
  error: null,
});

//async thunks

export const fetchUsuarios = createAsyncThunk(
  "usuarios/fetchUsuarios",
  async () => {
    return httpGet(baseUrl + "/usuarios");
  }
);

export const deleteUsuarioServer = createAsyncThunk(
  "usuarios/deleteUsuarioServer",
  async (usuario) => {
    await httpDelete(baseUrl + "/usuarios/" + usuario.id);
    return usuario.id;
  }
);

export const addUsuarioServer = createAsyncThunk(
  "usuarios/addUsuarioServer",
  async (usuario) => {
    return httpPost(baseUrl + "/usuarios", usuario);
  }
);

export const updateUsuarioServer = createAsyncThunk(
  "usuarios/updateUsuarioServer",
  async (usuario) => {
    return httpPut(baseUrl + "/usuarios/" + usuario.id, usuario);
  }
);

export const usuarios = createSlice({
  name: "usuarios",
  initialState: initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.status = "succeeded";
        usuariosAdapter.setAll(state, action.payload);
      })
      .addCase(deleteUsuarioServer.fulfilled, (state, action) => {
        state.status = "updated";
        usuariosAdapter.removeOne(state, action.payload);
      })
      .addMatcher(
        isAnyOf(updateUsuarioServer.fulfilled, addUsuarioServer.fulfilled),
        (state, action) => {
          state.status = "updated";
          usuariosAdapter.upsertOne(state, action.payload);
        }
      )
      .addMatcher(
        isAnyOf(
          fetchUsuarios.pending,
          updateUsuarioServer.pending,
          addUsuarioServer.pending,
          deleteUsuarioServer.pending
        ),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        isAnyOf(
          fetchUsuarios.rejected,
          updateUsuarioServer.rejected,
          addUsuarioServer.rejected,
          deleteUsuarioServer.rejected
        ),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  },
});

//selectors

export const {
  selectAll: selectAllUsuarios,
  selectById: selectUsuarioById,
  selectIds: selectUsuarioIds,
} = usuariosAdapter.getSelectors((state) => state.usuarios);

export default usuarios.reducer;
