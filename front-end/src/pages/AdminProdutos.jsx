import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [categoriaAtiva, setCategoriaAtiva] = useState(null);
    const [exibirForm, setExibirForm] = useState(false);

    const [idEditando, setIdEditando] = useState(null);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [imagem, setImagem] = useState('');

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        try {
            const resposta = await axios.get('http://localhost:3000/produtos');
            setProdutos(resposta.data);
        } catch (error) {
            console.error("Erro ao buscar produtos", error);
        }
    };

    const produtosFiltrados = produtos.filter(p => p.categoria === categoriaAtiva);

    const abrirFormNovo = () => {
        setIdEditando(null);
        setNome(''); setDescricao(''); setPreco(''); setImagem('');
        setExibirForm(true);
    };

    const abrirFormEditar = (produto) => {
        setIdEditando(produto.id);
        setNome(produto.nome); setDescricao(produto.descricao); setPreco(produto.preco); setImagem(produto.imagem);
        setExibirForm(true);
    };

    const deletarProduto = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este item?')) {
            try {
                await axios.delete(`http://localhost:3000/produtos/${id}`);
                carregarProdutos();
            } catch (error) {
                alert('Erro ao deletar.');
            }
        }
    };

    const handleSalvar = async (e) => {
        e.preventDefault();
        const dados = { nome, descricao, preco: parseFloat(preco), imagem, categoria: categoriaAtiva, ativo: 1 };

        try {
            if (idEditando) {
                await axios.put(`http://localhost:3000/produtos/${idEditando}`, dados);
            } else {
                await axios.post('http://localhost:3000/produtos', dados);
            }
            setExibirForm(false);
            carregarProdutos();
        } catch (error) {
            alert('Erro ao salvar produto.');
        }
    };

    const btnCategoriaStyle = {
        padding: '40px',
        fontSize: '20px',
        cursor: 'pointer',
        borderRadius: '15px',
        width: '220px',
        border: 'none',
        backgroundColor: 'white',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        color: '#2c3e50',
        fontWeight: 'bold',
        transition: 'all 0.3s ease'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <Header titulo="Gerenciar Produtos" />

            <div style={{ flex: 1, padding: '30px 5%' }}>

                <div style={{ marginBottom: '25px' }}>
                    {categoriaAtiva ? (
                        <button
                            onClick={() => { setCategoriaAtiva(null); setExibirForm(false); }}
                            style={{ padding: '8px 15px', cursor: 'pointer', border: '1.5px solid #c0392b', borderRadius: '25px', backgroundColor: 'transparent', color: '#c0392b', fontWeight: 'bold' }}
                        >
                            ← Categorias
                        </button>
                    ) : (
                        <Link to="/admin" style={{ textDecoration: 'none', color: '#c0392b', fontWeight: 'bold', fontSize: '14px' }}>
                            ← Voltar para o Painel
                        </Link>
                    )}
                </div>

                {!categoriaAtiva && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '50px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setCategoriaAtiva('marmita')}
                            style={btnCategoriaStyle}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <span style={{ display: 'block', fontSize: '40px', marginBottom: '10px' }}>🍱</span>
                            Marmitas
                        </button>
                        <button
                            onClick={() => setCategoriaAtiva('bebida')}
                            style={btnCategoriaStyle}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <span style={{ display: 'block', fontSize: '40px', marginBottom: '10px' }}>🥤</span>
                            Bebidas
                        </button>
                    </div>
                )}

                {categoriaAtiva && (
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #c0392b', paddingBottom: '10px', marginBottom: '25px' }}>
                            <h2 style={{ textTransform: 'capitalize', color: '#2c3e50', margin: 0 }}>{categoriaAtiva}s</h2>
                            {!exibirForm && (
                                <button onClick={abrirFormNovo} style={{ backgroundColor: '#27ae60', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    + Adicionar
                                </button>
                            )}
                        </div>

                        {exibirForm ? (
                            <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{idEditando ? 'Editar Item' : 'Novo Item'}</h3>
                                <input type="text" placeholder="Nome do produto" value={nome} onChange={e => setNome(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                <textarea placeholder="Descrição detalhada" value={descricao} onChange={e => setDescricao(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px' }} />
                                <input type="number" step="0.01" placeholder="Preço (Ex: 25.50)" value={preco} onChange={e => setPreco(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                <input type="url" placeholder="URL da Imagem" value={imagem} onChange={e => setImagem(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />

                                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                    <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar Alterações</button>
                                    <button type="button" onClick={() => setExibirForm(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
                                </div>
                            </form>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {produtosFiltrados.length === 0 && <p style={{ color: '#7f8c8d', textAlign: 'center' }}>Nenhum item cadastrado.</p>}

                                {produtosFiltrados.map((produto) => (
                                    <li key={produto.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px', marginBottom: '12px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                        <div style={{ flex: 1, paddingRight: '20px' }}>
                                            <strong style={{ fontSize: '18px', color: '#2c3e50' }}>{produto.nome}</strong>
                                            <span style={{ color: '#27ae60', fontWeight: 'bold', marginLeft: '10px' }}>R$ {parseFloat(produto.preco).toFixed(2)}</span>
                                            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#7f8c8d', lineHeight: '1.4' }}>{produto.descricao}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => abrirFormEditar(produto)} style={{ padding: '8px 15px', backgroundColor: '#f1c40f', color: '#2c3e50', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>Editar</button>
                                            <button onClick={() => deletarProduto(produto.id)} style={{ padding: '8px 15px', backgroundColor: '#fadbd8', color: '#c0392b', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>Deletar</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}