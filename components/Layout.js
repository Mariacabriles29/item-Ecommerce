import React from "react";
import NavBar from "./NavBar";
import Notify from "./Notify";
import Modal from "./Modal";

function Layout({ children }) {
  return (
    <>
      <NavBar />
      <div className="container-fluid pl-5 pr-5 pt-5">
        <Notify />
        <Modal />
        {children}
      </div>
    </>
  );
}

export default Layout;
