
import React, { useState ,useContext } from 'react';
import {DataContext} from '../store/GlobalState'
import { Button, TextField } from '@mui/material';


const TicketForm = () => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const {state, dispatch} = useContext(DataContext)
  const { auth } = state
  const handleSubmit = () => {
    const newTicket = {
      id: Date.now(),
      title,
      description,
    };

    dispatch({ type: 'ADD_TICKET', payload: newTicket });

    setTitle('');
    setDescription('');
  };

  return (
    <div>
      <h2>Agregar Nuevo Ticket</h2>
      <form>
        <div>
          <TextField
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="Descripción"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button variant="contained" onClick={handleSubmit}>
          Agregar Ticket
        </Button>
      </form>
    </div>
  );
};

export default TicketForm;
