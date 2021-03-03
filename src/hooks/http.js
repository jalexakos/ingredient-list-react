import { useReducer, useCallback } from 'react';

const initialState = { 
    loading: false, 
    error: null,
    data: null,
    extra: null,
    identifier: null
 }

const httpReducer = (currentHttp, action) => {
    switch(action.type) {
      case 'SEND':
        return { loading: true, error: null, data: null, extra: null, identifier: action.identifier };
      case 'RESPONSE':
        return { ...currentHttp, loading: false, data: action.responseData, extra: action.extra };
      case 'ERROR':
        return { loading: false, error: action.errorMessage };
      case 'CLEAR':
        return initialState
      default:
        throw new Error('Should not be reached!');
    }
  }

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, { 
        loading: false, 
        error: null,
        data: null,
        extra: null,
        identifier: null
     });

     const clear = useCallback(() => dispatchHttp({type: 'CLEAR'}), []);

        const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
            dispatchHttp({type: 'SEND', identifier: reqIdentifier});
            fetch(process.env.REACT_APP_BASE_URL + url, {
                method,
                body,
                headers: {
                    'Content-Type': 'application/json'
                }
              }).then(response => {
                  return response.json();
              }).then(responseData => {
                dispatchHttp({type: 'RESPONSE', responseData, extra: reqExtra });
              }).catch(error => {
                dispatchHttp({ type: 'ERROR', errorMessage: error.message })
              })
        }, []);

    
    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier,
        clear
    };        
};

export default useHttp;