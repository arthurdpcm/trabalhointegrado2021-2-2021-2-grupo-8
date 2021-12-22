import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdicionarMembro from "./components/AdicionarMembro/AdicionarMembro";
import Eventos from "./components/Eventos/Eventos";
import GerenciarEquipe from "./components/GerenciarEquipe/GerenciarEquipe";
import GerenciarEventos from "./components/GerenciarEventos/GerenciarEventos";
import Home from "./components/Home/Home";
import MinhasEquipes from "./components/MinhasEquipes/MinhasEquipes";
import NovaEquipe from "./components/NovaEquipe/NovaEquipe";
import NovaTarefa from "./components/NovaTarefa/NovaTarefa";
import NovoEvento from "./components/NovoEvento/NovoEvento";
import userSheet from "./data/dataUser.json";
import teamsSheet from "./data/dataTeams.json";
import membersSheet from "./data/dataMembers.json";
import tasksSheet from "./data/dataTasks.json";
import eventsSheet from "./data/dataEvents.json";
import Tarefa from "./components/Tarefa/Tarefa";
import FormTarefa from "./components/Tarefa/FormTarefa";
import AtribuirTarefa from "./components/Tarefa/AtribuirTarefa";

function App() {
  const [login, setLogin] = useState({ id: 1061 });
  const [equipes, setEquipes] = useState({
    gerenciadas: [],
    outras: [],
  });

  const [equipeAtiva, setEquipeAtiva] = useState({
    info: {},
    gerente: {},
    isGerente: -1,
    membros: [],
    eventos: [],
    tarefas: [],
  });

  useEffect(() => {
    let gerenciadas = teamsSheet.filter((equipe) => {
      return equipe.gerente === login.id;
    });

    const membroEquipe = membersSheet.filter((element) => {
      return element.idUser === login.id;
    });

    let outras = [];

    membroEquipe.forEach((element) => {
      const equipe = teamsSheet.filter((e) => {
        return e.id === element.idTeam;
      });
      outras.push(equipe[0]);
    });

    setEquipes({
      gerenciadas: gerenciadas,
      outras: outras,
    });
  }, [login]);

  const handleEquipeAtiva = (gerente, info, membros, eventos) => {
    let e = Object.assign({}, equipeAtiva);
    e.gerente = gerente;
    e.info = info;
    e.membros = membros;
    e.eventos = eventos;
    e.tarefas = tasksSheet.filter((t) => {
      return info.id === t.idTeam;
    });

    const isGerente = () => {
      if (login.id == info.gerente) return 1;
      else return 0;
    };

    e.isGerente = isGerente();

    setEquipeAtiva(e);
  };

  const handleExcluirTarefa = (tarefa) => {
    let tarefas = [...equipeAtiva.tarefas];

    tarefas.splice(
      tarefas.findIndex((t) => {
        return t.idTask === tarefa.idTask;
      }),
      1
    );

    let novoEstado = Object.assign({}, equipeAtiva);
    novoEstado.tarefas = tarefas;

    setEquipeAtiva(novoEstado);
  };

  const handleAtribuirTarefa = (tarefa, idMembro) => {
    let novaTarefa = tarefa;
    novaTarefa.idResponsavel = idMembro;

    let tarefas = [...equipeAtiva.tarefas];

    tarefas.splice(
      tarefas.findIndex((t) => {
        return t.idTask === tarefa.idTask;
      }),
      1
    );

    tarefas.push(novaTarefa);

    let novoEstado = Object.assign({}, equipeAtiva);
    novoEstado.tarefas = tarefas;

    setEquipeAtiva(novoEstado);
  };

  const handleDevolverTarefa = (tarefa) => {
    let novaTarefa = tarefa;
    novaTarefa.idResponsavel = 0;

    let tarefas = [...equipeAtiva.tarefas];

    tarefas.splice(
      tarefas.findIndex((t) => {
        return t.idTask === tarefa.idTask;
      }),
      1
    );

    tarefas.push(novaTarefa);

    let novoEstado = Object.assign({}, equipeAtiva);
    novoEstado.tarefas = tarefas;

    setEquipeAtiva(novoEstado);
  };

  const handleExcluirMembro = (membro) => {
    let membros = [...equipeAtiva.membros];
    membros.splice(
      membros.findIndex((m) => {
        return membro.id === m.id;
      }),
      1
    );
    
    

    let novoEstado = Object.assign({}, equipeAtiva);
    novoEstado.membros = membros;
    setEquipeAtiva(novoEstado);
  };

  const handleExcluirEvento = (evento) =>{
    let eventos = [...equipeAtiva.eventos];
    eventos.splice(
      eventos.findIndex((e)=>{
        return evento.idEvent === e.idEvent;
      }),1
    );

    let novoEstado = Object.assign({}, equipeAtiva);
    novoEstado.eventos = eventos;
    setEquipeAtiva(novoEstado);
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MinhasEquipes
              equipes={equipes}
              setEquipeAtiva={handleEquipeAtiva}
            />
          }
        />
        <Route
          path="/:idTeam/home"
          element={<Home login={login} equipe={equipeAtiva} />}
        />

        <Route
          path="/:idTeam/task/:idTask"
          element={
            <Tarefa
              login={login}
              equipe={equipeAtiva}
              atribuirTarefa={handleAtribuirTarefa}
              excluirTarefa={handleExcluirTarefa}
              devolverTarefa={handleDevolverTarefa}
            />
          }
        />
        <Route
          path="/:idTeam/task/:idTask/atribuir"
          element={
            <AtribuirTarefa
              equipe={equipeAtiva}
              atribuirTarefa={handleAtribuirTarefa}
            />
          }
        />

        <Route
          path="/:idTeam/eventos"
          element={<Eventos eventos={equipeAtiva.eventos}
          excluirEvento={handleExcluirEvento}/>}
        />

        <Route
          path="/:idTeam/gerenciarEquipe"
          element={
            <GerenciarEquipe
              membros={equipeAtiva.membros}
              excluirMembro={handleExcluirMembro}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
