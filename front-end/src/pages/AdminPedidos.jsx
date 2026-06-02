import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [modal, setModal] = useState({ aberto: false, pedidoId: null, novoStatus: '', mensagem: '' });

    const navigate = useNavigate();

    useEffect(() => {
        carregarPedidos();
    }, []);

    const carregarPedidos = async () => {
        try {
            setCarregando(true);
            const resposta = await axios.get('http://localhost:3000/pedidos');
            const ativos = resposta.data.filter(p =>
                p.status === 'pendente' || p.status === 'em andamento' || !p.status
            );
            setPedidos(ativos);
        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
            alert("Erro ao carregar os pedidos.");
        } finally {
            setCarregando(false);
        }
    };

    const confirmarAcao = (pedidoId, novoStatus) => {
        if (novoStatus === 'não atendido') {
            setModal({
                aberto: true,
                pedidoId: pedidoId,
                novoStatus: novoStatus,
                mensagem: "Tem certeza que deseja recusar este pedido? O saldo será devolvido ao cliente."
            });
        } else if (novoStatus === 'concluido') {
            setModal({
                aberto: true,
                pedidoId: pedidoId,
                novoStatus: novoStatus,
                mensagem: "Deseja marcar este pedido como concluído?"
            });
        } else {
            executarAtualizacao(pedidoId, novoStatus);
        }
    };

    const executarAtualizacao = async (pedidoId, novoStatus) => {
        try {
            await axios.put(`http://localhost:3000/pedidos/${pedidoId}/status`, { status: novoStatus });
            setModal({ aberto: false, pedidoId: null, novoStatus: '', mensagem: '' });
            carregarPedidos();
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            alert("Erro ao mudar o status do pedido.");
        }
    };

    const renderBadgeStatus = (status) => {
        const atual = status || 'pendente';
        let corBg = atual === 'em andamento' ? '#3498db' : '#f1c40f';

        return (
            <span style={{
                backgroundColor: corBg,
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
            }}>
                {atual}
            </span>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'sans-serif' }}>
            <Header titulo="Gerenciar Pedidos Ativos" />

            <div style={{ flex: 1, padding: '30px 5%' }}>
                <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => navigate('/admin')}
                            style={{ padding: '10px 20px', cursor: 'pointer', border: '1.5px solid #c0392b', borderRadius: '25px', backgroundColor: 'transparent', color: '#c0392b', fontWeight: 'bold' }}
                        >
                            ← Painel
                        </button>
                        <button
                            onClick={() => navigate('/admin/historico')}
                            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '25px', fontWeight: 'bold' }}
                        >
                            📋 Histórico
                        </button>
                    </div>
                </div>

                {carregando ? (
                    <p style={{ textAlign: 'center', color: '#7f8c8d' }}>Carregando pedidos ativos...</p>
                ) : pedidos.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '60px' }}>
                        <p style={{ fontSize: '18px', color: '#95a5a6' }}>Nenhum pedido pendente no momento.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#2c3e50', color: 'white', textAlign: 'left' }}>
                                    <th style={{ padding: '18px' }}>ID</th>
                                    <th style={{ padding: '18px' }}>Cliente</th>
                                    <th style={{ padding: '18px' }}>Horário</th>
                                    <th style={{ padding: '18px' }}>Total</th>
                                    <th style={{ padding: '18px' }}>Status</th>
                                    <th style={{ padding: '18px', textAlign: 'center' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map((pedido) => (
                                    <tr key={pedido.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                                        <td style={{ padding: '15px', color: '#7f8c8d' }}>#{pedido.id}</td>
                                        <td style={{ padding: '15px' }}><strong style={{ color: '#2c3e50' }}>{pedido.cliente_nome}</strong></td>
                                        <td style={{ padding: '15px', fontSize: '14px' }}>{new Date(pedido.data_pedido).toLocaleTimeString('pt-BR')}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: '#27ae60' }}>R$ {parseFloat(pedido.total).toFixed(2)}</td>
                                        <td style={{ padding: '15px' }}>{renderBadgeStatus(pedido.status)}</td>
                                        <td style={{ padding: '15px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            {(!pedido.status || pedido.status === 'pendente') && (
                                                <>
                                                    <button onClick={() => confirmarAcao(pedido.id, 'em andamento')} style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                                                        Aceitar
                                                    </button>
                                                    <button onClick={() => confirmarAcao(pedido.id, 'não atendido')} style={{ backgroundColor: '#c0392b', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                                                        Recusar
                                                    </button>
                                                </>
                                            )}
                                            {pedido.status === 'em andamento' && (
                                                <button onClick={() => confirmarAcao(pedido.id, 'concluido')} style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                                                    Concluir
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {modal.aberto && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '15px', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Confirmação</h3>
                        <p style={{ fontSize: '16px', color: '#555', marginBottom: '25px', lineHeight: '1.5' }}>{modal.mensagem}</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                            <button
                                onClick={() => setModal({ aberto: false, pedidoId: null, novoStatus: '', mensagem: '' })}
                                style={{ padding: '10px 20px', borderRadius: '25px', border: '1px solid #ddd', backgroundColor: '#f8f9fa', cursor: 'pointer', fontWeight: 'bold', color: '#7f8c8d' }}
                            >
                                Voltar
                            </button>
                            <button
                                onClick={() => executarAtualizacao(modal.pedidoId, modal.novoStatus)}
                                style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', backgroundColor: modal.novoStatus === 'não atendido' ? '#c0392b' : '#27ae60', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}