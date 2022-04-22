import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Button,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Delete, Edit } from "@material-ui/icons";
import { apiUrl, token, apiUrlp } from "./Servicios/Api";
import "./App.css";

//ESTILOS PARA MODALES Y BOTONES
const useStyles = makeStyles((theme) => ({
  modal: {
    width: 300,
    border: "2px solid #000",
    position: "absolute",
    margin: "10% auto",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  iconos: {
    cursor: "pointer",
  },
  inputMaterials: {
    width: "100%",
  },
}));

function App() {
  //ESTADOS
  const styles = useStyles();

  const [data, setData] = useState([]);
  const [modalInsert, setModalInsert] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [seleccion, setSeleccion] = useState({
    id: "",
    name: "",
    gender: "",
    email: "",
    status: "",
  });

  //PETICION POST
  const peticionPost = async () => {
    await axios
      .post(apiUrl, seleccion, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(data.concat(response.data));
        handleModalInsert();
      });
  };

  //PETICION PATCH
  const peticionPatch = async () => {
    await axios
      .patch(
        apiUrlp + seleccion.id,
        {
          name: seleccion.name,
          email: seleccion.email,
          status: seleccion.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        var dataNew = data;
        dataNew.map((el) => {
          if (seleccion.id === el.id) {
            el.name = seleccion.name;
            el.gender = seleccion.gender;
            el.email = seleccion.email;
            el.status = seleccion.status;
          }
        });
        setData(dataNew);
        handleModalEdit();
      });
  };

  //PETICION DELETE
  const peticionDelete = async () => {
    await axios
      .delete(apiUrlp + seleccion.id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(data.filter((select) => select.id !== seleccion.id));
        handleModalDelete();
      });
  };

  //SELECCION EDITAR ELIMINAR
  const seleccionEditarEliminar = (el, caso) => {
    setSeleccion(el);
    caso === "edit" ? handleModalEdit() : handleModalDelete();
  };

  //  ACTUALIZAR TEXFIELD
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeleccion((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    //console.log(seleccion);
  };

  //ABRIR CERRAR MODAL INSERT
  const handleModalInsert = () => {
    setModalInsert(!modalInsert);
  };

  //ABRIR CERRAR MODAL EDIT
  const handleModalEdit = () => {
    setModalEdit(!modalEdit);
  };

  //ABRIR CERRAR MODAL DELETE
  const handleModalDelete = () => {
    setModalDelete(!modalDelete);
  };

  //MODAL PARA INSERTAR
  const bodyModal = (
    <div className={styles.modal}>
      <h3>Insertar nuevo usuario</h3>
      <TextField
        name="name"
        className={styles.inputMaterials}
        label="Nombre"
        onChange={handleChange}
      />
      <br />
      <TextField
        name="gender"
        className={styles.inputMaterials}
        label="Genero"
        onChange={handleChange}
      />
      <br />
      <TextField
        name="email"
        className={styles.inputMaterials}
        label="Email"
        onChange={handleChange}
      />
      <br />
      <TextField
        name="status"
        className={styles.inputMaterials}
        label="Estado"
        onChange={handleChange}
      />
      <br />
      <div align="rigth">
        <Button onClick={() => peticionPost()} color="primary">
          Insertar
        </Button>
        <Button onClick={() => handleModalInsert()}>Cancelar</Button>
      </div>
    </div>
  );

  //MODAL PARA EDITAR
  const bodyModalEdit = (
    <div className={styles.modal}>
      <h3>Editar usuario</h3>
      <TextField
        name="name"
        className={styles.inputMaterials}
        label="Nombre"
        onChange={handleChange}
        value={seleccion && seleccion.name}
      />
      <br />
      <TextField
        name="gender"
        className={styles.inputMaterials}
        label="Genero"
        onChange={handleChange}
        value={seleccion && seleccion.gender}
      />
      <br />
      <TextField
        name="email"
        className={styles.inputMaterials}
        label="Email"
        onChange={handleChange}
        value={seleccion && seleccion.email}
      />
      <br />
      <TextField
        name="status"
        className={styles.inputMaterials}
        label="Estado"
        onChange={handleChange}
        value={seleccion && seleccion.status}
      />
      <br />
      <div align="rigth">
        <Button onClick={() => peticionPatch()} color="primary">
          Editar
        </Button>
        <Button onClick={() => handleModalEdit()}>Cancelar</Button>
      </div>
    </div>
  );

  //MODAL PARA EDITAR
  const bodyModaDelete = (
    <div className={styles.modal}>
      <h3>
        SEGURO QUE DESEA ELIMINAR ESTE REGISTRO
        <b>{seleccion && seleccion.name}</b>?
      </h3>
      <br />
      <div align="rigth">
        <Button color="primary" onClick={() => peticionDelete()}>
          Si, Eliminar
        </Button>
        <Button onClick={() => handleModalDelete()}>Cancelar</Button>
      </div>
    </div>
  );

  //PETICION GET
  const peticionGet = async () => {
    await axios.get(apiUrl).then((response) => {
      //console.log(response.data);
      setData(response.data);
    });
  };

  //USE EFFECT CARGAR
  useEffect(() => {
    const peticion = async () => {
      await peticionGet();
    };
    peticion();
  }, []);

  return (
    <div className="App">
      <br />
      <h1>NUEVO TITULO en rama para actualizacIon en modo prueba git</h1>
      <Button onClick={() => handleModalInsert()}>Insertar</Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Genero</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((el) => (
              <TableRow key={el.id}>
                <TableCell>{el.id}</TableCell>
                <TableCell>{el.name}</TableCell>
                <TableCell>{el.gender}</TableCell>
                <TableCell>{el.email}</TableCell>
                <TableCell>{el.status}</TableCell>
                <TableCell>
                  <Edit
                    className={styles.iconos}
                    onClick={() => seleccionEditarEliminar(el, "edit")}
                  />
                  &nbsp;&nbsp;&nbsp;
                  <Delete
                    className={styles.iconos}
                    onClick={() => seleccionEditarEliminar(el, "delete")}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalInsert} onClose={handleModalInsert}>
        {bodyModal}
      </Modal>

      <Modal open={modalEdit} onClose={handleModalEdit}>
        {bodyModalEdit}
      </Modal>

      <Modal open={modalDelete} onClose={handleModalDelete}>
        {bodyModaDelete}
      </Modal>
    </div>
  );
}

export default App;
