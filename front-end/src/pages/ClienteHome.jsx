import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ClienteHome() {
    const [cliente, setCliente] = useState(null);
    const [ultimoPedido, setUltimoPedido] = useState(null);
    const [itensUltimoPedido, setItensUltimoPedido] = useState([]);
    const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
    const [modalCancelar, setModalCancelar] = useState({ aberto: false, pedidoId: null });

    const navigate = useNavigate();
    const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));

    useEffect(() => {
        if (!usuarioLogado) {
            navigate('/login');
            return;
        }
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const resCli = await axios.get(`http://localhost:3000/clientes/${usuarioLogado.id}`);
            setCliente(resCli.data);

            const resPedidos = await axios.get('http://localhost:3000/pedidos');
            const pedidosDoCliente = resPedidos.data.filter(p => p.cliente_nome === resCli.data.nome);

            if (pedidosDoCliente.length > 0) {
                const pedidoMaisRecente = pedidosDoCliente.sort((a, b) => b.id - a.id)[0];
                setUltimoPedido(pedidoMaisRecente);

                const resItens = await axios.get(`http://localhost:3000/pedidos/${pedidoMaisRecente.id}/itens`);
                setItensUltimoPedido(resItens.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const executarCancelamento = async () => {
        try {
            await axios.put(`http://localhost:3000/pedidos/${modalCancelar.pedidoId}/status`, { status: 'cancelado' });
            setModalCancelar({ aberto: false, pedidoId: null });
            carregarDados();
        } catch (error) {
            alert("Erro ao cancelar o pedido.");
        }
    };

    const renderBadgeStatus = (status) => {
        const atual = status || 'pendente';
        let corBg = '#f1c40f';
        if (atual === 'em andamento') corBg = '#3498db';
        if (atual === 'concluido') corBg = '#2ecc71';
        if (atual === 'não atendido' || atual === 'cancelado') corBg = '#e74c3c';

        return (
            <span style={{ backgroundColor: corBg, color: '#fff', padding: '5px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {atual}
            </span>
        );
    };

    if (!cliente) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#c0392b', fontWeight: 'bold', fontFamily: 'sans-serif' }}>
            Carregando...
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'sans-serif' }}>
            <Header titulo={`Olá, ${cliente.nome}!`} />

            <div style={{ flex: 1, padding: '40px 20px', maxWidth: '500px', margin: '0 auto', width: '100%' }}>

                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #eee', marginBottom: '30px' }}>
                    <h3 style={{ color: '#7f8c8d', margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Saldo Disponível</h3>
                    <h1 style={{ fontSize: '3.5rem', margin: 0, color: '#c0392b', fontWeight: '800' }}>
                        R$ {parseFloat(cliente.saldo).toFixed(2)}
                    </h1>
                </div>

                {ultimoPedido && (
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #eee', textAlign: 'left', marginBottom: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px', marginBottom: '15px' }}>
                            <h3 style={{ color: '#2c3e50', margin: 0, fontSize: '16px' }}>Último Pedido</h3>
                            <span style={{ color: '#95a5a6', fontSize: '12px', fontWeight: 'bold' }}>#{ultimoPedido.id}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#34495e' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Data:</span>
                                <strong>{new Date(ultimoPedido.data_pedido).toLocaleDateString('pt-BR')}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Total:</span>
                                <strong style={{ color: '#27ae60' }}>R$ {parseFloat(ultimoPedido.total).toFixed(2)}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Status:</span>
                                {renderBadgeStatus(ultimoPedido.status)}
                            </div>
                        </div>

                        <button
                            onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
                            style={{ width: '100%', marginTop: '15px', padding: '10px', background: '#f8f9fa', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold' }}
                        >
                            {mostrarDetalhes ? '▲ Ocultar Itens' : '▼ Ver Itens do Pedido'}
                        </button>

                        {mostrarDetalhes && (
                            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fcfcfc', borderRadius: '8px', border: '1px dashed #ddd' }}>
                                {itensUltimoPedido.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '5px 0', borderBottom: index !== itensUltimoPedido.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                                        <span>{item.produto_nome}</span>
                                        <strong>R$ {parseFloat(item.preco_final).toFixed(2)}</strong>
                                    </div>
                                ))}
                            </div>
                        )}

                        {(!ultimoPedido.status || ultimoPedido.status === 'pendente') && (
                            <button
                                onClick={() => setModalCancelar({ aberto: true, pedidoId: ultimoPedido.id })}
                                style={{ width: '100%', padding: '14px', marginTop: '20px', backgroundColor: '#fff', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Cancelar Pedido
                            </button>
                        )}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate('/cardapio')}
                        style={{ width: '100%', padding: '18px', fontSize: '1.1rem', backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(192, 57, 43, 0.2)' }}
                    >
                        🛒 Fazer Novo Pedido
                    </button>
                    <button
                        onClick={() => navigate('/extrato')}
                        style={{ background: 'none', border: 'none', color: '#7f8c8d', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}
                    >
                        Ver Extrato Completo
                    </button>
                </div>
            </div>

            {modalCancelar.aberto && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(3px)' }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '350px', textAlign: 'center' }}>
                        <h3 style={{ color: '#2c3e50', marginTop: 0 }}>Deseja cancelar?</h3>
                        <p style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '25px' }}>O valor retornará ao seu saldo.</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setModalCancelar({ aberto: false, pedidoId: null })} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd', background: 'none', cursor: 'pointer' }}>Voltar</button>
                            <button onClick={executarCancelamento} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#e74c3c', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Sim</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}