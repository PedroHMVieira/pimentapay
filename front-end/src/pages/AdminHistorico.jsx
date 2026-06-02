import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminHistorico() {
    const [historico, setHistorico] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        carregarHistorico();
    }, []);

    const carregarHistorico = async () => {
        try {
            const res = await axios.get('http://localhost:3000/pedidos');
            const finalizados = res.data.filter(p => p.status === 'concluido' || p.status === 'não atendido');
            setHistorico(finalizados);
        } catch (error) {
            console.error("Erro ao carregar histórico", error);
        }
    };

    const executarLimpeza = async () => {
        try {
            await axios.delete('http://localhost:3000/pedidos/historico');
            setHistorico([]);
            setModalAberto(false);
        } catch (error) {
            alert("Erro ao limpar histórico.");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'sans-serif' }}>
            <Header titulo="Histórico de Pedidos" />

            <div style={{ flex: 1, padding: '30px 5%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                    <button
                        onClick={() => navigate('/admin/pedidos')}
                        style={{
                            padding: '10px 20px',
                            cursor: 'pointer',
                            border: '1.5px solid #c0392b',
                            borderRadius: '25px',
                            backgroundColor: 'transparent',
                            color: '#c0392b',
                            fontWeight: 'bold',
                            transition: 'all 0.3s'
                        }}
                    >
                        ← Voltar para Pedidos
                    </button>

                    {historico.length > 0 && (
                        <button
                            onClick={() => setModalAberto(true)}
                            style={{
                                backgroundColor: '#c0392b',
                                color: 'white',
                                border: 'none',
                                padding: '12px 25px',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 6px rgba(192, 57, 43, 0.2)'
                            }}
                        >
                            🗑️ Limpar Histórico Definitivamente
                        </button>
                    )}
                </div>

                {historico.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '80px' }}>
                        <p style={{ fontSize: '18px', color: '#95a5a6' }}>O histórico está vazio no momento.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#2c3e50', color: 'white', textAlign: 'left' }}>
                                    <th style={{ padding: '18px' }}>ID</th>
                                    <th style={{ padding: '18px' }}>Cliente</th>
                                    <th style={{ padding: '18px' }}>Total</th>
                                    <th style={{ padding: '18px' }}>Status</th>
                                    <th style={{ padding: '18px' }}>Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historico.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                                        <td style={{ padding: '15px', color: '#7f8c8d' }}>#{p.id}</td>
                                        <td style={{ padding: '15px' }}><strong style={{ color: '#2c3e50' }}>{p.cliente_nome}</strong></td>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>R$ {parseFloat(p.total).toFixed(2)}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                backgroundColor: p.status === 'concluido' ? '#d4edda' : '#f8d7da',
                                                color: p.status === 'concluido' ? '#155724' : '#721c24',
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '11px',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase',
                                                display: 'inline-block'
                                            }}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', color: '#7f8c8d' }}>{new Date(p.data_pedido).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {modalAberto && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '15px', width: '90%', maxWidth: '450px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                        <div style={{ fontSize: '50px', marginBottom: '15px' }}>⚠️</div>
                        <h3 style={{ marginTop: 0, color: '#c0392b', fontSize: '22px' }}>Atenção Irreversível</h3>
                        <p style={{ fontSize: '16px', color: '#555', marginBottom: '30px', lineHeight: '1.5' }}>
                            Esta ação excluirá permanentemente todos os registros concluídos do banco de dados. <strong>Esta operação não pode ser desfeita.</strong>
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                            <button
                                onClick={() => setModalAberto(false)}
                                style={{ padding: '12px 25px', borderRadius: '25px', border: '1px solid #ddd', backgroundColor: '#f8f9fa', cursor: 'pointer', fontWeight: 'bold', color: '#7f8c8d' }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={executarLimpeza}
                                style={{ padding: '12px 25px', borderRadius: '25px', border: 'none', backgroundColor: '#c0392b', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Sim, Excluir Tudo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}