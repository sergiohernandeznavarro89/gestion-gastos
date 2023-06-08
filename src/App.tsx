import { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from '@nextui-org/react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import { useDispatch, useSelector } from 'react-redux';
import Login from 'pages/login';
import 'primeflex/primeflex.css'
import PrimeReact from "primereact/api";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'react-toastify/dist/ReactToastify.css';
import * as UserActions from "store/actions/UserActions";
import AppLayout from 'Layout/AppLayout';
import Account from 'pages/account';


function App() {

  PrimeReact.ripple = true;
  const user = useSelector((state: any) => state.userState);
  const menu = useSelector((state: any) => state.menuState);

  const dispatch = useDispatch();

  useEffect(() => {
    const userStorage = localStorage.getItem('user');

    if (userStorage) {
      dispatch(UserActions.SetUser(JSON.parse(userStorage)) as any);
    }
  }, [user]);

  return (
    <>
      {user.userId !== 0 && <AppLayout></AppLayout>}
      <Routes>
        <Route path="/" element={user.userId !== 0 ? <Home /> : <Login />} />
        <Route path="/cuentas" element={<Account />} />
      </Routes>
    </>
  );
}

export default App;
