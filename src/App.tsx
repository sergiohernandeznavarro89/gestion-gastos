import { useEffect } from 'react';
import './App.css';
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
import Category from 'pages/category';
import PaymentsAndInvoices from 'pages/paymentsAndInvoices';


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
        <Route path="/" element={user.userId !== 0 ? <Home userId={user.userId} /> : <Login />} />
        <Route path="/cuentas" element={<Account />} />
        <Route path="/categorias" element={<Category userId={user.userId}/>} />
        <Route path="/paymentsandinvoices" element={<PaymentsAndInvoices userId={user.userId}/>} />
      </Routes>
    </>
  );
}

export default App;
