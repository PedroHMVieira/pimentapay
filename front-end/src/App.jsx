import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Sobre from './pages/Sobre';

import ClienteHome from './pages/ClienteHome';
import Cardapio from './pages/Cardapio';
import Extrato from './pages/Extrato';
import EditarDados from './pages/EditarDados';

import AdminHome from './pages/AdminHome';
import AdminClientes from './pages/AdminClientes';
import AdminProdutos from './pages/AdminProdutos';
import AdminSaldo from './pages/AdminSaldo';
import AdminPedidos from './pages/AdminPedidos';
import AdminHistorico from './pages/AdminHistorico';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas de Autenticação e Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/sobre" element={<Sobre />} />
        {/* Rotas do Cliente */}
        <Route path="/home" element={<ClienteHome />} />
        <Route path="/cardapio" element={<Cardapio />} />
        <Route path="/extrato" element={<Extrato />} />
        <Route path="/editar-dados" element={<EditarDados />} />

        {/* Rotas do Admin */}
        <Route path="/admin/historico" element={<AdminHistorico />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/clientes" element={<AdminClientes />} />
        <Route path="/admin/produtos" element={<AdminProdutos />} />
        <Route path="/admin/saldo/:id" element={<AdminSaldo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;