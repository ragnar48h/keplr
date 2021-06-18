import React from 'react';
import AppContainer from './src/navigation';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {Provider} from 'react-redux';
import {store, persistor} from './src/redux';

export default function App() {

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppContainer />
      </PersistGate>
    </Provider>
  );
}
