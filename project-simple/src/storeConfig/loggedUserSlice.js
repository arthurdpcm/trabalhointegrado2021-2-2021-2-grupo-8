import { createSlice } from "@reduxjs/toolkit";

export const loggedUser = createSlice({
  name: "loggedUser",
  initialState: {
    id: 36,
    equipeAtiva: {
      info: {},
      gerente: {},
      isGerente: -1,
      membros: [],
    },
  },
  reducers: {
    setEquipeAtiva: {
      reducer(state, { payload }) {
        state.equipeAtiva.info = payload.equipe;
        state.equipeAtiva.membros = payload.membros;
        state.equipeAtiva.gerente = payload.gerente;
        payload.gerente.id === state.id
          ? (state.equipeAtiva.isGerente = 1)
          : (state.equipeAtiva.isGerente = 0);
      },
      prepare(equipe, membros, gerente) {
        return {
          payload: {
            equipe: equipe,
            membros: membros,
            gerente: gerente,
          },
        };
      },
    },
  },
});

//Selectors:

export const getEquipeAtiva = (state) => state.loggedUser.equipeAtiva;
export const getIsGerente = (state) => state.loggedUser.equipeAtiva.isGerente;
export const getIdUser = (state) => state.loggedUser.id;

export const { setEquipeAtiva } = loggedUser.actions;

export default loggedUser.reducer;
