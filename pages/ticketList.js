import React, { useContext } from "react";
import { DataContext } from "../store/GlobalState";

const TicketList = () => {
  const { state } = useContext(DataContext);
  const { tickets } = state;

  return <div></div>;
};

export default TicketList;
