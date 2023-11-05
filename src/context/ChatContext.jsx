import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";
// import { OpenSidebarContext } from "./OpenSidebarContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  // const { setOpenSidebar } = useContext(OpenSidebarContext);

  const INITIAL_STATE = {
    chatId: "null",
    user: {}
  }

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        // setOpenSidebar(false);
        return {
          user: action.payload,
          chatId: currentUser.uid > action.payload.uid
            ? action.payload.uid + currentUser.uid
            : currentUser.uid + action.payload.uid
        };
      case "LOGOUT":
        return INITIAL_STATE;
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  )
}