import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminClientes() {
    const [clientes, setClientes] = useState([]);
    const [clienteExpandido, setClienteExpandido] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        carregarClientes();
    }, []);

    const carregarClientes = async () => {
        try {
            const resposta = await axios.get('http://localhost:3000/clientes');
            const apenasClientes = resposta.data.filter(c =>
                !c.tipo_usuario || c.tipo_usuario.toLowerCase() !== 'admin'
            );
            setClientes(apenasClientes);
        } catch (error) {
            console.error("Erro ao buscar clientes", error);
        }
    };

    const toggleDetalhesCliente = (id) => {
        setClienteExpandido(clienteExpandido === id ? null : id);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9f9f9', fontFamily: 'sans-serif' }}>
            <Header titulo="Gerenciar Clientes" />

            <div style={{ flex: 1, padding: '30px 5%' }}>
                <div style={{ marginBottom: '25px', maxWidth: '800px', margin: '0 auto 20px auto' }}>
                    <Link to="/admin" style={{
                        textDecoration: 'none',
                        color: '#c0392b',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        ← Voltar para o Painel
                    </Link>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ color: '#2c3e50', marginBottom: '20px', borderBottom: '2px solid #c0392b', display: 'inline-block', paddingBottom: '5px' }}>
                        Clientes Cadastrados
                    </h2>

                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
                        {clientes.length === 0 && (
                            <p style={{ textAlign: 'center', color: '#7f8c8d', marginTop: '40px' }}>Nenhum cliente encontrado.</p>
                        )}

                        {clientes.map(cliente => {
                            const isExpandido = clienteExpandido === cliente.id;

                            return (
                                <li key={cliente.id} style={{
                                    backgroundColor: 'white',
                                    padding: '20px',
                                    marginBottom: '15px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                    transition: 'transform 0.2s ease'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div onClick={() => toggleDetalhesCliente(cliente.id)} style={{ cursor: 'pointer', flex: 1 }}>
                                            <strong style={{ fontSize: '18px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {cliente.nome}
                                                <span style={{ fontSize: '12px', color: '#c0392b' }}>{isExpandido ? '▲' : '▼'}</span>
                                            </strong>
                                            <p style={{
                                                margin: '8px 0 0 0',
                                                fontWeight: 'bold',
                                                fontSize: '15px',
                                                color: parseFloat(cliente.saldo) >= 0 ? '#27ae60' : '#c0392b'
                                            }}>
                                                Saldo: R$ {parseFloat(cliente.saldo).toFixed(2)}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/admin/saldo/${cliente.id}`)}
                                            style={{
                                                padding: '10px 20px',
                                                backgroundColor: '#c0392b',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '25px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '13px',
                                                boxShadow: '0 2px 4px rgba(192, 57, 43, 0.3)'
                                            }}
                                        >
                                            💰 Gerenciar Saldo
                                        </button>
                                    </div>

                                    {isExpandido && (
                                        <div style={{
                                            marginTop: '15px',
                                            paddingTop: '15px',
                                            borderTop: '1px solid #f0f0f0',
                                            color: '#555',
                                            fontSize: '14px',
                                            animation: 'fadeIn 0.3s ease'
                                        }}>
                                            <p style={{ margin: '0 0 10px 0' }}>
                                                <strong style={{ color: '#2c3e50' }}>✉️ E-mail:</strong> {cliente.email || 'Não informado'}
                                            </p>
                                            <p style={{ margin: '0' }}>
                                                <strong style={{ color: '#2c3e50' }}>📱 Telefone:</strong> {cliente.telefone || 'Não informado'}
                                            </p>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
            <Footer />
        </div>
    );
}