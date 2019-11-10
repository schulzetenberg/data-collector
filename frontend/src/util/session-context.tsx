import React, { useState } from 'react';
import * as Cookies from 'js-cookie';

export const setSessionCookie = (session: any): void => {
  Cookies.remove('session');
  if (session) Cookies.set('session', session, { expires: 30 });
};

export const getSessionCookie: any = (): any => {
  const sessionCookie = Cookies.getJSON('session');
  return sessionCookie || {};
};

export const SessionContext = React.createContext(getSessionCookie());

const SessionContextProvider = ({ children }: any): any => {
  const [session, setSessionState] = useState(getSessionCookie());

  const setSession = (val: any): void => {
    setSessionState(val);
    setSessionCookie(val);
  };

  return <SessionContext.Provider value={{ session, setSession }}>{children}</SessionContext.Provider>;
};

export const SessionProvider = SessionContextProvider;
