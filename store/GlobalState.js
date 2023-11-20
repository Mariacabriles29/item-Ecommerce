import { createContext, useReducer, useEffect } from "react";
import reducers from "./Reducers";
import { getData, putData } from "../utils/fetchData";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const initialState = {
    notify: {},
    auth: {},
    cart: [],
    modal: [],
    orders: [],
    users: [],
    categories: [],
    tickets: [],
    deleteCategories: [],
    editCategories: [],
  };

  const [state, dispatch] = useReducer(reducers, initialState);
  const { cart, auth } = state;

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      getData("auth/accessToken").then((res) => {
        if (res.err) return localStorage.removeItem("firstLogin");
        dispatch({
          type: "AUTH",
          payload: {
            token: res.access_token,
            user: res.user,
          },
        });
      });
    }

    getData("categories").then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch({
        type: "ADD_CATEGORIES",
        payload: res.categories,
      });
    });

    getData("tickets").then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch({
        type: "ADD_TICKET",
        payload: res.tickets,
      });
    });
  }, []);

  useEffect(() => {
    const __next__cart01__devat = JSON.parse(
      localStorage.getItem("__next__cart01__devat")
    );

    if (__next__cart01__devat)
      dispatch({ type: "ADD_CART", payload: __next__cart01__devat });
  }, []);

  useEffect(() => {
    localStorage.setItem("__next__cart01__devat", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (auth.token) {
      getData("order", auth.token).then((res) => {
        if (res.err)
          return dispatch({ type: "NOTIFY", payload: { error: res.err } });

        dispatch({ type: "ADD_ORDERS", payload: res.orders });
      });

      if (auth.user.role === "admin") {
        getData("user", auth.token).then((res) => {
          if (res.err)
            return dispatch({ type: "NOTIFY", payload: { error: res.err } });

          dispatch({ type: "ADD_USERS", payload: res.users });
        });
      }
    } else {
      dispatch({ type: "ADD_ORDERS", payload: [] });
      dispatch({ type: "ADD_USERS", payload: [] });
    }
  }, [auth.token]);

  const handleEditCategory = async (categoryId, updatedData) => {
    try {
      const res = await putData(`categories/${categoryId}`, updatedData);

      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch({
        type: "EDIT_CATEGORIES",
        payload: res.categories,
      });
    } catch (error) {
      console.error("Error during category edit:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const res = await deleteData(`categories/${categoryId}`);

      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch({
        type: "DELETE_CATEGORIES",
        payload: res.categories,
      });
    } catch (error) {
      console.error("Error during category deletion:", error);
    }
  };

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
