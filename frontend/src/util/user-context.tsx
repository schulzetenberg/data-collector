import React from 'react';

const initialValues = {
  name: '',
  email: '',
  session: '',
};

const UserContext = React.createContext<{
  state: any;
  dispatch: any;
}>({ state: null, dispatch: null });

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'reset':
      return initialValues;
    case 'set-user':
      return {
        ...state,
        name: action.payload.name,
        email: action.payload.email,
        session: action.payload.session,
      };
    default:
      console.log(`Invalid action type of ${action.type}`);
      return state;
  }
};

const UserContextProvider = ({ children }: any): any => {
  const [state, dispatch] = React.useReducer(reducer, initialValues);
  const value = { state, dispatch };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const UserProvider = UserContextProvider;
export const UserConsumer = UserContext.Consumer;
export default UserContext;
