import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminSaldo() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [cliente, setCliente] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    const [acaoSaldo, setAcaoSaldo] = useState('adicionar');
    const [modoDesconto, setModoDesconto] = useState('manual');

    const [valorAdicionar, setValorAdicionar] = useState('');
    const [valorManual, setValorManual] = useState('');
    const [descontoManual, setDescontoManual] = useState('');
    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    const [carrinho, setCarrinho] = useState([]);

    useEffect(() => {
        carregarDados();
    }, [id]);

    const carregarDados = async () => {
        try {
            const resCliente = await axios.get(`http://localhost:3000/clientes/${id}`);
            setCliente(resCliente.data);

            const resProdutos = await axios.get('http://localhost:3000/produtos');
            setProdutos(resProdutos.data);
        } catch (error) {
            setMensagem({ texto: 'Erro ao carregar dados do cliente.', tipo: 'erro' });
        }
    };

    const adicionarAoCarrinho = () => {
        if (!produtoSelecionado) return;

        const produto = produtos.find(p => p.id === parseInt(produtoSelecionado));
        if (!produto) return;

        const isMarmita = produto.categoria && produto.categoria.toLowerCase() === 'marmita';
        const precoBase = parseFloat(produto.preco);
        const descontoItem = isMarmita ? 2.00 : 0;
        const precoFinal = Math.max(0, precoBase - descontoItem);

        const novoItem = {
            ...produto,
            precoBase,
            descontoItem,
            precoFinal,
            idUnico: Date.now()
        };

        setCarrinho([...carrinho, novoItem]);
        setProdutoSelecionado('');
    };

    const removerDoCarrinho = (idUnico) => {
        setCarrinho(carrinho.filter(item => item.idUnico !== idUnico));
    };

    const calcularTotalCarrinho = () => {
        return carrinho.reduce((total, item) => total + item.precoFinal, 0);
    };

    const handleSalvar = async (e) => {
        e.preventDefault();
        setMensagem({ texto: '', tipo: '' });

        try {
            let valorAjuste = 0;
            let saldoAtual = parseFloat(cliente.saldo || 0);
            let novoSaldoCalculado = saldoAtual;

            if (acaoSaldo === 'adicionar') {
                if (!valorAdicionar || parseFloat(valorAdicionar) <= 0) {
                    return setMensagem({ texto: 'Informe um valor válido para adicionar.', tipo: 'erro' });
                }
                valorAjuste = parseFloat(valorAdicionar);
                novoSaldoCalculado = saldoAtual + valorAjuste;
            } else {
                if (modoDesconto === 'manual') {
                    const valor = parseFloat(valorManual || 0);
                    const desc = parseFloat(descontoManual || 0);
                    valorAjuste = valor - desc;
                } else {
                    if (carrinho.length === 0) {
                        return setMensagem({ texto: 'Adicione itens ao pedido.', tipo: 'erro' });
                    }
                    valorAjuste = calcularTotalCarrinho();
                }

                if (valorAjuste <= 0) {
                    return setMensagem({ texto: 'O valor do desconto deve ser maior que zero.', tipo: 'erro' });
                }

                if (saldoAtual - valorAjuste < 0) {
                    return setMensagem({ texto: 'Saldo insuficiente para esta operação.', tipo: 'erro' });
                }
                novoSaldoCalculado = saldoAtual - valorAjuste;
            }

            await axios.put(`http://localhost:3000/clientes/${id}/saldo`, {
                novoSaldo: novoSaldoCalculado
            });

            setMensagem({ texto: 'Operação realizada com sucesso!', tipo: 'sucesso' });
            setCliente(prev => ({ ...prev, saldo: novoSaldoCalculado }));
            setValorAdicionar('');
            setValorManual('');
            setDescontoManual('');
            setCarrinho([]);

        } catch (error) {
            const msgErro = error.response?.data?.erro || 'Erro ao conectar com o servidor.';
            setMensagem({ texto: msgErro, tipo: 'erro' });
        }
    };

    if (!cliente) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <Header titulo="Gerenciar Saldo" />

            <div style={{ flex: 1, padding: '30px 5%', maxWidth: '700px', margin: '0 auto', width: '100%' }}>

                <div style={{ marginBottom: '20px' }}>
                    <Link to="/admin/clientes" style={{ textDecoration: 'none', color: '#c0392b', fontWeight: 'bold', fontSize: '14px' }}>
                        ← Voltar para Clientes
                    </Link>
                </div>

                <div style={{ backgroundColor: '#2c3e50', color: 'white', padding: '30px', borderRadius: '15px', marginBottom: '25px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ margin: '0 0 5px 0' }}>{cliente.nome}</h2>
                    <p style={{ margin: '0', fontSize: '13px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Saldo Disponível</p>
                    <h1 style={{ margin: '10px 0 0 0', color: parseFloat(cliente.saldo) > 0 ? '#2ecc71' : '#e74c3c', fontSize: '36px' }}>
                        R$ {parseFloat(cliente.saldo || 0).toFixed(2)}
                    </h1>
                </div>

                {mensagem.texto && (
                    <div style={{
                        padding: '15px',
                        marginBottom: '25px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        backgroundColor: mensagem.tipo === 'sucesso' ? '#d4edda' : '#f8d7da',
                        color: mensagem.tipo === 'sucesso' ? '#155724' : '#721c24',
                        border: `1px solid ${mensagem.tipo === 'sucesso' ? '#c3e6cb' : '#f5c6cb'}`
                    }}>
                        {mensagem.texto}
                    </div>
                )}

                <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                        <button
                            onClick={() => setAcaoSaldo('adicionar')}
                            style={{
                                flex: 1, padding: '15px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold',
                                backgroundColor: acaoSaldo === 'adicionar' ? '#2ecc71' : '#f1f2f6',
                                color: acaoSaldo === 'adicionar' ? 'white' : '#7f8c8d'
                            }}
                        >
                            ➕ Recarga
                        </button>
                        <button
                            onClick={() => setAcaoSaldo('descontar')}
                            style={{
                                flex: 1, padding: '15px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold',
                                backgroundColor: acaoSaldo === 'descontar' ? '#c0392b' : '#f1f2f6',
                                color: acaoSaldo === 'descontar' ? 'white' : '#7f8c8d'
                            }}
                        >
                            💸 Novo Pedido
                        </button>
                    </div>

                    <form onSubmit={handleSalvar}>
                        {acaoSaldo === 'adicionar' && (
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#2c3e50' }}>Valor do Depósito:</label>
                                <input
                                    type="number" step="0.01" min="0.01" required
                                    value={valorAdicionar}
                                    onChange={e => setValorAdicionar(e.target.value)}
                                    placeholder="0,00"
                                    style={{ width: '100%', padding: '15px', boxSizing: 'border-box', fontSize: '20px', borderRadius: '10px', border: '2px solid #f1f2f6', textAlign: 'center' }}
                                />
                            </div>
                        )}

                        {acaoSaldo === 'descontar' && (
                            <>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setModoDesconto('manual')}
                                        style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: modoDesconto === 'manual' ? '#34495e' : '#f1f2f6', color: modoDesconto === 'manual' ? 'white' : '#7f8c8d', fontSize: '13px', fontWeight: 'bold' }}
                                    >
                                        Valor Avulso
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setModoDesconto('itens')}
                                        style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: modoDesconto === 'itens' ? '#34495e' : '#f1f2f6', color: modoDesconto === 'itens' ? 'white' : '#7f8c8d', fontSize: '13px', fontWeight: 'bold' }}
                                    >
                                        Lista de Itens
                                    </button>
                                </div>

                                {modoDesconto === 'manual' && (
                                    <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Bruto:</label>
                                            <input type="number" step="0.01" value={valorManual} onChange={e => setValorManual(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Desconto:</label>
                                            <input type="number" step="0.01" value={descontoManual} onChange={e => setDescontoManual(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                                        </div>
                                    </div>
                                )}

                                {modoDesconto === 'itens' && (
                                    <div style={{ marginBottom: '25px' }}>
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                            <select value={produtoSelecionado} onChange={e => setProdutoSelecionado(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
                                                <option value="">Selecione um produto...</option>
                                                {produtos.map(prod => (
                                                    <option key={prod.id} value={prod.id}>{prod.nome} - R$ {parseFloat(prod.preco).toFixed(2)}</option>
                                                ))}
                                            </select>
                                            <button type="button" onClick={adicionarAoCarrinho} style={{ padding: '0 20px', backgroundColor: '#f1c40f', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                                        </div>
                                        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', border: '1px solid #eee' }}>
                                            {carrinho.length === 0 && <p style={{ fontSize: '13px', color: '#95a5a6', textAlign: 'center' }}>Carrinho vazio</p>}
                                            {carrinho.map(item => (
                                                <div key={item.idUnico} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f1f1', fontSize: '14px' }}>
                                                    <span>{item.nome}</span>
                                                    <span style={{ fontWeight: 'bold' }}>
                                                        R$ {item.precoFinal.toFixed(2)}
                                                        <button type="button" onClick={() => removerDoCarrinho(item.idUnico)} style={{ color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer', marginLeft: '10px', fontWeight: 'bold' }}>×</button>
                                                    </span>
                                                </div>
                                            ))}
                                            {carrinho.length > 0 && (
                                                <div style={{ textAlign: 'right', marginTop: '15px', fontWeight: 'bold', fontSize: '18px', color: '#2c3e50' }}>
                                                    Total: R$ {calcularTotalCarrinho().toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <button
                            type="submit"
                            style={{
                                width: '100%', padding: '18px', backgroundColor: '#2c3e50', color: 'white',
                                border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold',
                                fontSize: '16px', marginTop: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        >
                            Finalizar Lançamento
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}