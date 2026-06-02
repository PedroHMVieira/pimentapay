import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Cardapio() {
    const [produtos, setProdutos] = useState([]);
    const [carrinho, setCarrinho] = useState([]);
    const [cliente, setCliente] = useState(null);
    const [carregando, setCarregando] = useState(true);

    const [modalPagamento, setModalPagamento] = useState(false);
    const [modalSucesso, setModalSucesso] = useState(false);
    const [produtosExpandidos, setProdutosExpandidos] = useState({});

    const navigate = useNavigate();
    const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));

    useEffect(() => {
        if (!usuarioLogado || !usuarioLogado.id) {
            navigate('/');
            return;
        }
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            const resProd = await axios.get('http://localhost:3000/produtos');
            setProdutos(resProd.data);

            const resCli = await axios.get(`http://localhost:3000/clientes/${usuarioLogado.id}`);
            setCliente(resCli.data);
        } catch (error) {
            console.error("Erro ao carregar cardápio:", error);
        } finally {
            setCarregando(false);
        }
    };

    const adicionarAoCarrinho = (produto) => {
        const isMarmita = produto.categoria?.toLowerCase() === 'marmita';
        const precoOriginal = parseFloat(produto.preco);
        const precoComDesconto = isMarmita ? Math.max(0, precoOriginal - 2) : precoOriginal;

        const novoItem = {
            ...produto,
            precoFinal: precoComDesconto,
            idUnico: Date.now() + Math.random()
        };
        setCarrinho([...carrinho, novoItem]);
    };

    const removerDoCarrinho = (idUnico) => {
        setCarrinho(carrinho.filter(item => item.idUnico !== idUnico));
    };

    const toggleDescricao = (id) => {
        setProdutosExpandidos(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const totalPedido = carrinho.reduce((acc, item) => acc + item.precoFinal, 0);
    const saldoAtual = parseFloat(cliente?.saldo || 0);
    const saldoInsuficiente = saldoAtual < totalPedido;

    const abrirConfirmacao = () => {
        if (totalPedido > saldoAtual) return;
        setModalPagamento(true);
    };

    const confirmarEPagar = async () => {
        try {
            setModalPagamento(false);
            await axios.post('http://localhost:3000/pedidos', {
                cliente_id: cliente.id,
                total: totalPedido,
                itens: carrinho
            });

            if (usuarioLogado) {
                usuarioLogado.saldo = saldoAtual - totalPedido;
                localStorage.setItem('usuario', JSON.stringify(usuarioLogado));
            }
            setModalSucesso(true);
        } catch (error) {
            alert("Erro ao processar pedido.");
        }
    };

    if (carregando) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                <h2 style={{ color: '#c0392b' }}>Temperando o cardápio...</h2>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <Header titulo="Cardápio Digital" />

            <div style={{ flex: 1, padding: '30px 5%', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>

                {/* LISTA DE PRODUTOS */}
                <div style={{ flex: 2, minWidth: '350px' }}>
                    <button
                        onClick={() => navigate('/home')}
                        style={{ marginBottom: '20px', padding: '8px 15px', cursor: 'pointer', background: 'none', border: '1px solid #c0392b', color: '#c0392b', borderRadius: '8px', fontWeight: 'bold' }}
                    >
                        ← Voltar para Home
                    </button>

                    <h2 style={{ color: '#2c3e50', marginBottom: '25px' }}>O que vamos pedir hoje?</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {produtos.map(prod => (
                            <div key={prod.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
                                <strong style={{ fontSize: '1.2rem', color: '#2c3e50' }}>{prod.nome}</strong>

                                <div
                                    onClick={() => toggleDescricao(prod.id)}
                                    style={{ cursor: 'pointer', color: '#c0392b', fontSize: '13px', margin: '10px 0', fontWeight: 'bold' }}
                                >
                                    {produtosExpandidos[prod.id] ? '▲ Ocultar detalhes' : '▼ Ver detalhes'}
                                </div>

                                {produtosExpandidos[prod.id] && (
                                    <div style={{ backgroundColor: '#fff5f5', padding: '10px', borderRadius: '8px', marginBottom: '10px', fontSize: '13px', color: '#666' }}>
                                        {prod.descricao || 'Receita exclusiva PimentaPay.'}
                                    </div>
                                )}

                                <p style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '1.4rem', margin: '10px 0' }}>
                                    R$ {parseFloat(prod.preco).toFixed(2)}
                                </p>

                                {prod.categoria?.toLowerCase() === 'marmita' && (
                                    <div style={{ fontSize: '11px', color: '#e67e22', fontWeight: 'bold', marginBottom: '15px', backgroundColor: '#fff3e0', padding: '4px', borderRadius: '4px', textAlign: 'center' }}>
                                        🔥 DESCONTO DE R$ 2,00 NO CARRINHO
                                    </div>
                                )}

                                <button
                                    onClick={() => adicionarAoCarrinho(prod)}
                                    style={{ width: '100%', padding: '12px', backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a93226'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
                                >
                                    Adicionar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CARRINHO FIXO */}
                <div style={{ flex: 1, minWidth: '320px' }}>
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', border: '1px solid #ddd', position: 'sticky', top: '20px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #f8f9fa', paddingBottom: '10px' }}>Seu Carrinho</h3>

                        {carrinho.length === 0 ? (
                            <p style={{ color: '#95a5a6', textAlign: 'center', padding: '20px 0' }}>O estômago está vazio...</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto' }}>
                                {carrinho.map(item => (
                                    <li key={item.idUnico} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f8f9fa', fontSize: '14px' }}>
                                        <span style={{ color: '#34495e' }}>{item.nome}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <strong>R$ {item.precoFinal.toFixed(2)}</strong>
                                            <button onClick={() => removerDoCarrinho(item.idUnico)} style={{ color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', color: '#2c3e50', marginBottom: '10px' }}>
                                <span>Total:</span>
                                <span>R$ {totalPedido.toFixed(2)}</span>
                            </div>
                            <div style={{ textAlign: 'center', color: saldoInsuficiente ? '#c0392b' : '#27ae60', fontSize: '13px', fontWeight: 'bold' }}>
                                Seu saldo: R$ {saldoAtual.toFixed(2)}
                            </div>
                        </div>

                        <button
                            onClick={abrirConfirmacao}
                            disabled={carrinho.length === 0 || saldoInsuficiente}
                            style={{
                                width: '100%', padding: '15px', marginTop: '15px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px',
                                backgroundColor: (carrinho.length > 0 && !saldoInsuficiente) ? '#27ae60' : '#ddd',
                                color: 'white', cursor: (carrinho.length > 0 && !saldoInsuficiente) ? 'pointer' : 'not-allowed'
                            }}
                        >
                            {saldoInsuficiente ? 'Saldo Insuficiente' : 'Finalizar Pedido'}
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL DE PAGAMENTO */}
            {modalPagamento && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', maxWidth: '400px', textAlign: 'center' }}>
                        <h2 style={{ color: '#2c3e50' }}>Confirmar?</h2>
                        <p>O valor de <strong style={{ color: '#27ae60', fontSize: '1.5rem' }}>R$ {totalPedido.toFixed(2)}</strong> será debitado da sua carteira.</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                            <button onClick={() => setModalPagamento(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={confirmarEPagar} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#27ae60', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE SUCESSO */}
            {modalSucesso && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', maxWidth: '400px', textAlign: 'center' }}>
                        <div style={{ fontSize: '50px', marginBottom: '20px' }}>🌶️</div>
                        <h2 style={{ color: '#c0392b' }}>Pedido Realizado!</h2>
                        <p>O PimentaPay confirmou seu pagamento. Agora é só aguardar o preparo!</p>
                        <button onClick={() => navigate('/home')} style={{ width: '100%', padding: '15px', marginTop: '20px', borderRadius: '10px', border: 'none', backgroundColor: '#2c3e50', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>OK</button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}