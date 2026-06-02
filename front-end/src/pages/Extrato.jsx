import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Extrato() {
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [idExpandido, setIdExpandido] = useState(null);
    const [itensPedido, setItensPedido] = useState({});

    const navigate = useNavigate();
    const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));

    useEffect(() => {
        if (!usuarioLogado) {
            navigate('/login');
            return;
        }
        carregarExtrato();
    }, []);

    const carregarExtrato = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/pedidos/extrato/${usuarioLogado.id}`);

            const ultimasDez = res.data.slice(0, 10);

            setMovimentacoes(ultimasDez);
            setCarregando(false);
        } catch (error) {
            console.error(error);
            setCarregando(false);
        }
    };

    const togglePedido = async (item) => {
        const pedidoId = item.pedido_id || item.id_pedido;
        if (!pedidoId) return;

        if (idExpandido === item.id) {
            setIdExpandido(null);
            return;
        }

        setIdExpandido(item.id);

        if (!itensPedido[pedidoId]) {
            try {
                const res = await axios.get(`http://localhost:3000/pedidos/${pedidoId}/itens`);
                setItensPedido(prev => ({
                    ...prev,
                    [pedidoId]: res.data
                }));
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (carregando) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#c0392b', fontWeight: 'bold', fontFamily: 'sans-serif' }}>
            Carregando extrato...
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'sans-serif' }}>
            <Header titulo="Seu Extrato" />

            <div style={{ flex: 1, padding: '40px 20px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <div>
                        <h2 style={{ color: '#2c3e50', margin: 0, fontSize: '20px' }}>Histórico</h2>
                        <small style={{ color: '#95a5a6' }}>Exibindo as últimas 10 movimentações</small>
                    </div>
                    <button
                        onClick={() => navigate('/home')}
                        style={{ padding: '8px 18px', backgroundColor: '#fff', color: '#c0392b', border: '1px solid #c0392b', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                    >
                        Voltar
                    </button>
                </div>

                <div style={{ backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #eee' }}>
                    {movimentacoes.length === 0 ? (
                        <p style={{ padding: '40px', textAlign: 'center', color: '#95a5a6', margin: 0 }}>Nenhuma movimentação encontrada.</p>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', padding: '15px 20px', backgroundColor: '#fcfcfc', fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #eee' }}>
                                <div style={{ flex: 1 }}>Data</div>
                                <div style={{ flex: 2 }}>Descrição</div>
                                <div style={{ flex: 1, textAlign: 'right' }}>Valor</div>
                            </div>

                            {movimentacoes.map((item) => {
                                const pId = item.pedido_id || item.id_pedido;
                                const isNegativo = parseFloat(item.valor) < 0;

                                return (
                                    <div key={item.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                        <div
                                            onClick={() => togglePedido(item)}
                                            style={{
                                                display: 'flex',
                                                padding: '18px 20px',
                                                cursor: pId ? 'pointer' : 'default',
                                                backgroundColor: idExpandido === item.id ? '#fff9f9' : 'transparent',
                                                transition: '0.2s',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <div style={{ flex: 1, color: '#95a5a6', fontSize: '13px' }}>
                                                {new Date(item.data_movimentacao).toLocaleDateString('pt-BR')}
                                            </div>
                                            <div style={{ flex: 2, color: '#2c3e50', fontWeight: '600', fontSize: '14px' }}>
                                                {item.descricao} {pId && (
                                                    <span style={{ fontSize: '10px', marginLeft: '5px', color: '#c0392b' }}>
                                                        {idExpandido === item.id ? '▲' : '▼'}
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ flex: 1, textAlign: 'right', fontWeight: '800', color: isNegativo ? '#e74c3c' : '#27ae60', fontSize: '14px' }}>
                                                {isNegativo ? '-' : '+'} R$ {Math.abs(parseFloat(item.valor)).toFixed(2)}
                                            </div>
                                        </div>

                                        {idExpandido === item.id && (
                                            <div style={{ backgroundColor: '#fdfdfd', padding: '15px', margin: '0 20px 15px 20px', borderRadius: '12px', border: '1px dashed #ddd' }}>
                                                <h4 style={{ margin: '0 0 10px 0', fontSize: '10px', color: '#bdc3c7', textTransform: 'uppercase' }}>Detalhes do Pedido:</h4>
                                                {itensPedido[pId] ? (
                                                    itensPedido[pId].map((sub, i) => (
                                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: i !== itensPedido[pId].length - 1 ? '1px solid #f1f1f1' : 'none' }}>
                                                            <span style={{ color: '#555' }}>{sub.produto_nome}</span>
                                                            <strong style={{ color: '#2c3e50' }}>R$ {parseFloat(sub.preco_final).toFixed(2)}</strong>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>Carregando itens...</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}