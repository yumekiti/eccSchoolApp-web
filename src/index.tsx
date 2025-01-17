import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import userDataState from 'globalState/userDataState';

const initializeState = (mutableSnapshot: MutableSnapshot) => {
  const uuid = localStorage.getItem('uuid');
  const token = localStorage.getItem('token');
  if (uuid !== null || token !== null)
    mutableSnapshot.set(userDataState, { uuid, token });
};

ReactDOM.render(
  <RecoilRoot initializeState={initializeState}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </RecoilRoot>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
