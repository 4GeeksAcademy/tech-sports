import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
//import ModalTeam from "../component/modalteams";
import { Link, useNavigate } from "react-router-dom";
import imgLogo from "../../img/LogoTS.jpg";
import teamlist from "../../img/perfil/teamlist.jpg";

const TeamLista = () => {

    const { store, actions } = useContext(Context)
    const navigate = useNavigate();

    useEffect(()=>{
        if (!store.accessToken) {
            navigate("/");
          }
      }, [store.accessToken]);

    const [operation, setOperation] = useState("Equipo Nuevo");
    const [indice, setIndice] = useState("");
    const [idEquipo, setIdEquipo] = useState(0);
    const [teamToDelete, setTeamToDelete] = useState("");
    const [idToDelete, setIdToDelete] = useState("");

    useEffect(()=>{
        actions.getUserTeams()
        setOperation("Equipo Nuevo");
      }, []);

    const handleEdit = (e, id_tm, indx) => {
        //console.log("ID a editar:", id_tm, indx)
        //setSelectedTeam(teamData.find(t => t.id == e.target.id))
        setOperation("Editar Equipo");
        setIndice(indx);
        setIdEquipo(id_tm);
    }

    const handleDelete = (e, id_team, nom, ind)=>{
        //console.log("ID a borrar:", id_team, nom, ind)
        setIdToDelete(id_team);
        setTeamToDelete(nom);
        setIndice(ind);
        console.log("A borrar, id:", idToDelete, " nombre:", teamToDelete, " index:", indice);
    }
    const createEquipo = () => {
        setOperation("Equipo Nuevo");
        setIndice("n");
        limpiarDataEquipo();
    }
    const handleChange = (e, propertyName) => {
        /*const currentTeam = Object.assign({}, selectedTeam);
        currentTeam[propertyName] = e.target.value;
        setSelectedTeam(currentTeam)*/
    }
    /////////////////////////////////////////////////////////////////7
    const [editar, setEditar] = useState(false);
    const [fechaActual, setFechaActual] = useState("");
    const formulario = document.getElementById("formTeam");
    const [teamFormData, setTeamFormData] = useState(operation=="Equipo Nuevo"? {
      nombre_equipo: "",
      jugadores: "",
      //fecha_registro: fechaActual,
      fecha_registro: "",
      logotipo: "",
      id_user: "",
      id: ""
    }:store.userTeam[indice]);
      

      useEffect(()=>{
        console.log("ESTA ES LA OPERACION:", operation);
        if (operation=="Editar Equipo"){
          setTeamFormData(store.userTeam[indice]);
          console.log(teamFormData.fecha_registro);
        } else {
          let teamData = {...teamFormData};
          let currentDate = new Date();
          for (let value in teamData){
            teamData[value] = "";
            if (value == "fecha_registro"){
              //teamData[value] = currentDate.toString();
              teamData[value] = currentDate;
              console.log("LA FECHA ACTUAL ES:", currentDate);
            }
          }
          setTeamFormData(teamData);
          setFechaActual(currentDate);
        }
      }, [indice]);

      useEffect(()=>{
        limpiarDataEquipo();
      }, []);

    const handleTeamChange = (e) => {
      //console.log("TARGET", e.target);
      const { name, value } = e.target;
      setTeamFormData({
        ...teamFormData,
        [name]: value,
      });
      setEditar(true);
    };

    const limpiarDataEquipo = () => {
        setTeamFormData({
            id: "",
            nombre_equipo: "",
            jugadores: "",
            fecha_registro: fechaActual,
            logotipo: "",
            id_user: ""});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const nombre_equipo=data.get("nombre_equipo").trim();
        const jugadores=data.get("jugadores").trim();
        const logotipo = data.get("logotipo").trim();
        //console.log("Equipo a editar:", teamFormData)
        let teamDataSinEsp = { ...teamFormData };
        teamDataSinEsp.nombre_equipo = nombre_equipo;
        teamDataSinEsp.jugadores = jugadores;
        teamDataSinEsp.logotipo = logotipo;
        if (nombre_equipo=="" || jugadores=="" || logotipo == ""){
            alert("No debe haber datos vacíos o espacios en blanco")
        /*} else if (operation=="Editar Equipo" && editar==false){
          //console.log("no es necesario editar");
          alert("Equipo actualizado");
          formulario.reset();*/
          } else if (nombre_equipo.length <3) {
            alert("El nombre debe tener al menos 2 caracteres")
          } else {
              let resp ="";
              let oper ="";
              //console.log("OPERACIÓN:", operation)
              if (operation=="Equipo Nuevo"){
                  const {newTeam} = actions;
                  //console.log("Equipo a registrar:", teamDataSinEsp);
                  resp = await newTeam(teamDataSinEsp);
                  oper = "creado";
                } else {
                    //Si estamos editando el equipo
                //console.log("Equipo a editar:", teamFormData, "indice:", indice)
                const {editTeam} = actions;
                resp = await editTeam(teamDataSinEsp, indice);
                oper = "actualizado";
              }
              //console.log({resp})
              //console.log(resp.code)
              limpiarDataEquipo();
              if (resp=="Ok"){
                alert("Equipo " + oper + " exitosamente");
                if (operation=="Equipo Nuevo")
                    limpiarDataEquipo();
              } else if (resp.code == 405 ){
                    alert("Equipo ya existe");
                } else {
                    alert("Error al registrar Equipo");
                }
              formulario.reset();
              //window.location.reload(false)
            }
      };
      ////////////////////////////////////////////////////
    return (
        <div className="contSuperior fatherBody" style={{minHeight:"500px"}}>
            <div className="container">
                <div className="card mb-4">
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <div className="col-2 text-center">
                            <img className="rounded" src={teamlist} style={{ maxWidth: '100px', maxHeight: '100px', border: "solid #0D6EFD" }}></img>
                        </div>
                        <div className="col-6 text-center">
                            <h2>Lista de Equipos</h2>
                            </div>
                        <div className="col-4">
                            <Link to="/cuenta">
                                <button className="btn btn-primary mx-3" type="button">Volver a Perfil</button>
                            </Link>
                            <button className="btn btn-primary" onClick={() => createEquipo()} data-bs-toggle="modal" data-bs-target="#staticBackdrop" type="button">Crear Equipo</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
            <div className="table-responsive">
            <table className="table align-middle mb-0 bg-white" id='theTeamstable'>
                <thead className="bg-light">
                    <tr>
                        <th>Nombre del Equipo</th>
                        <th>Jugadores</th>
                        <th>Fecha de Registro</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {store.userTeam.map((theTeam, index) => (
                        <tr key={theTeam.id}>
                            <td>
                                <div className="d-flex align-items-center">
                                    <img
                                        src={theTeam.logotipo}
                                        alt=""
                                        style={{ width: '45px', height: '45px' }}
                                        className="rounded-circle"
                                    />
                                    <div className="ms-3">
                                        <p className="fw-bold mb-1"></p>
                                        <p className="text-muted mb-0">{theTeam.nombre_equipo}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <p className="fw-normal mb-1">{theTeam.jugadores}</p>
                            </td>
                            <td>{theTeam.fecha_registro==""? "": new Date(theTeam.fecha_registro).toLocaleString()}</td>
                            <td>
                                <button id={theTeam.id} onClick={(e) => handleEdit(e, theTeam.id, index)} className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button className="btn btn-primary btn-sm m-2"
                                    onClick={(e) => handleDelete(e, theTeam.id, theTeam.nombre_equipo, index)}
                                    data-bs-toggle="modal" data-bs-target="#staticBackdrop1">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                                {/*<div className="col-4">
                                    <button className="btn btn-primary">
                                        Jugadores
                                    </button>
                                </div>*/}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            </div>
           <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{operation}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/*<ModalTeam operacion={operation} indice={indice} idEquipo={idEquipo}/>*/}

                            <div className="row">
                                <form onSubmit={handleSubmit} id="formTeam">
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="nombre_equipo">
                                            Nombre del Equipo
                                            </label>
                                            <div className="form-outline mb-4">
                                            <input
                                                type="text"
                                                id="nombre_equipo"
                                                name="nombre_equipo"
                                                maxLength="50"
                                                value={teamFormData.nombre_equipo}
                                                className="form-control white-background-input"
                                                onChange={handleTeamChange}
                                                required
                                            />
                                            </div>
                                        </div>
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="jugadores">
                                            Jugadores
                                            </label>
                                            <div className="form-outline mb-4">
                                            <input
                                                type="text"
                                                id="jugadores"
                                                name="jugadores"
                                                value={teamFormData.jugadores}
                                                maxLength="100"
                                                className="form-control white-background-input"
                                                onChange={handleTeamChange}
                                                required
                                            />
                                            </div>
                                        </div>
                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="logotipo">
                                            Logotipo
                                            </label>
                                            <div className="form-outline mb-4">
                                            <input
                                                type="text"
                                                id="logotipo"
                                                name="logotipo"
                                                value={teamFormData.logotipo}
                                                maxLength="150"
                                                className="form-control white-background-input"
                                                onChange={handleTeamChange}
                                                required
                                            />
                                            </div>
                                        </div>
                                        <div className='text-center'>
                                            <button type="submit" className="btn btn-primary btn-block mx-4 mb-4" data-bs-dismiss={operation=="Editar Equipo"? "modal":""}>
                                            Guardar
                                            </button>
                                            <button type="button" className="btn btn-secondary btn-block mb-4" data-bs-dismiss="modal">Cancelar</button>
                                        </div>
                                </form>
                            </div>

                        </div>
                        <div className="modal-footer">
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdrop1Label" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdrop1Label">Eliminar Equipo</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            ¿Estás seguro que quieres eliminar el equipo {teamToDelete}?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={() => actions.deleteTeam(idToDelete, indice)} data-bs-dismiss="modal">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default TeamLista;


