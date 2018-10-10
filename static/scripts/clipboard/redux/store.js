import rootReducer from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { socketSendMiddleware } from './middleware/socket-send';
import { uploadImagesMiddleware } from './middleware/upload-images';

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(thunkMiddleware, socketSendMiddleware, uploadImagesMiddleware)
    )
  );
  return store;
}