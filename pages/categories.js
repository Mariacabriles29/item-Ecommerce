import React, { useState, useContext } from "react";
import Head from "next/head";
import { DataContext } from "../store/GlobalState";
import { updateItem } from "../store/Actions";

import { postData, putData, deleteData } from "../utils/fetchData";

const Categories = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const { state, dispatch } = useContext(DataContext);
  const { categories, auth } = state;

  const handleOpenModal = () => {
    setShowModal(true);
    setName("");
    setId("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setName("");
    setId("");
  };

  const handleOpenDeleteModal = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setCategoryToDelete(null);
    setShowDeleteModal(false);
  };

  const createCategory = async () => {
    if (auth.user.role !== "admin") {
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Authentication is not valid." },
      });
    }

    if (!name) {
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Name can not be left blank." },
      });
    }

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    let res;
    if (id) {
      res = await putData(`categories/${id}`, { name }, auth.token);
      if (res.err) {
        dispatch({ type: "NOTIFY", payload: { error: res.err } });
      } else {
        dispatch(updateItem(categories, id, res.category, "ADD_CATEGORIES"));
        handleCloseModal();
      }
    } else {
      res = await postData("categories", { name }, auth.token);
      if (res.err) {
        dispatch({ type: "NOTIFY", payload: { error: res.err } });
      } else {
        dispatch({
          type: "ADD_CATEGORIES",
          payload: [...categories, res.newCategory],
        });
        handleCloseModal();
      }
    }

    dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const res = await deleteData(`categories/${categoryId}`, auth.token);

      if (res.err) {
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      }

      const newCatagories = categories.filter((c) => c._id != categoryId);

      dispatch({
        type: "ADD_CATEGORIES",
        payload: [...newCatagories],
      });

      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    } catch (error) {
      console.error("Error during category deletion:", error);
    }
  };

  const handleEditCategory = (category) => {
    setId(category._id);
    setName(category.name);
    setShowModal(true);
  };

  return (
    <div className="container">
      <Head>
        <title>Categories</title>
      </Head>
      <h3 className="text-center">List Categories</h3>
      <button
        className="btn btn-secondary ml-1"
        data-toggle="modal"
        data-target="#exampleModal2"
        onClick={handleOpenModal}
      >
        Create
      </button>

      <table className="table table-bordered mt-3">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Category Name</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>
                <i
                  className="fas fa-edit mr-2 text-info"
                  onClick={() => handleEditCategory(category)}
                  data-toggle="modal"
                  data-target="#exampleModal2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-pencil-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                  </svg>
                </i>

                <i
                  className="fas fa-trash-alt text-danger"
                  data-toggle="modal"
                  data-target="#deleteCategoryModal"
                  onClick={() => handleOpenDeleteModal(category)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-trash3-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                  </svg>
                </i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className="modal fade"
        id="exampleModal2"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel1"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {id ? "Edit Category" : "Add Category"}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {/* Contenido del formulario */}
              <input
                type="text"
                className="form-control"
                placeholder="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={createCategory}
                data-dismiss="modal"
              >
                {id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="deleteCategoryModal"
        tabIndex="-1"
        aria-labelledby="deleteCategoryModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteCategoryModalLabel">
                Confirm Deletion
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseDeleteModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete the category
              {categoryToDelete && categoryToDelete.name}?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={handleCloseDeleteModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={() => {
                  handleDeleteCategory(categoryToDelete._id);
                  handleCloseDeleteModal();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
