import AsyncStorage from '@react-native-async-storage/async-storage';
// import { AsyncStorage } from "react-native";
import { persistReducer } from 'redux-persist';

export default reducers => {
  const persistedReducer = persistReducer(
    {
      key: 'titonMobile',
      storage: AsyncStorage,
      whitelist: ['auth', 'user'],
    },
    reducers,
  );

  return persistedReducer;
};
