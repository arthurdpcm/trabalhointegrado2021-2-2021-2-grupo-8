import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function MenuHome() {

  const equipeAtiva = useSelector(state => state.equipeAtiva)

  const [display, setDisplay] = useState("");
  

  useEffect(() => {
    equipeAtiva.isGerente ? setDisplay("") : setDisplay("hide");
  }, [equipeAtiva]);

  
    return (
      <section className="menu ">
        <Link className={`${display}`} to={"/"+ equipeAtiva.info.id +"/novaTarefa"}>
          <span className="btn btn-primary">Criar Tarefa</span>
        </Link>
        <Link to={"/"+ equipeAtiva.info.id +"/eventos"}>
          <span className="btn btn-primary">Eventos</span>
        </Link>
        <Link className={`${display}`} to={"/"+ equipeAtiva.info.id + "/gerenciarEquipe"}>
          <span className="btn btn-primary">Gerenciar Equipe</span>
        </Link>  
        <Link to={"/"}>
          <span className="btn btn-secondary">Minhas Equipes</span>
        </Link>
      </section>
    );

  }


export default MenuHome;
