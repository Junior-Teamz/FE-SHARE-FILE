import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { AuthContext } from './auth-context';

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INITIAL':
      return { loading: false, user: action.payload.user };
    case 'LOGIN':
    case 'REGISTER':
      return { ...state, user: action.payload.user };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initialize the authentication state
  const initialize = useCallback(async () => {
    try {
      const response = await axiosInstance.get(endpoints.auth.me);

      if (response.data.isValid) {
        const { user } = response.data;
        dispatch({
          type: 'INITIAL',
          payload: { user },
        });
      } else {
        dispatch({ type: 'INITIAL', payload: { user: null } });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'INITIAL', payload: { user: null } });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const data = { email, password };

    const response = await axiosInstance.post(endpoints.auth.login, data);
    const { user } = response.data;

    dispatch({ type: 'LOGIN', payload: { user } });
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = { email, password, firstName, lastName };

    const response = await axiosInstance.post(endpoints.auth.register, data);
    const { user } = response.data;

    dispatch({ type: 'REGISTER', payload: { user } });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    await axiosInstance.post(endpoints.auth.logout); // Panggil endpoint logout di server
    dispatch({ type: 'LOGOUT' });
  }, []);

  // Status management
  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt', // Untuk kesesuaian dengan header, meskipun token ada di cookie
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
