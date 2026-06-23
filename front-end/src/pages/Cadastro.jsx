import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [telefone, setTelefone] = useState('');

    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');

    const navigate = useNavigate();

    const handleCadastro = async (e) => {
        e.preventDefault();
        setMensagem('');
        setErro('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return setErro('Por favor, insira um e-mail válido.');
        }

        if (senha.length < 8) {
            return setErro('A senha deve ter pelo menos 8 caracteres.');
        }

        const telefoneLimpo = telefone.replace(/\D/g, '');
        if (telefoneLimpo.length < 8) {
            return setErro('O telefone deve ter pelo menos 8 dígitos.');
        }

        try {
            const resposta = await axios.post('http://localhost:3000/clientes', {
                nome,
                email,
                senha,
                telefone
            });

            setMensagem(resposta.data.mensagem);

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {
            if (error.response && error.response.data.erro) {
                setErro(error.response.data.erro);
            } else {
                setErro('Erro ao conectar com o servidor.');
            }
        }
    };

    const inputStyle = {
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.3s'
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            padding: '20px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '15px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: '#c0392b', margin: '0 0 10px 0', fontSize: '28px' }}>PimentaPay</h2>
                    <p style={{ color: '#7f8c8d', margin: 0 }}>Crie sua conta agora</p>
                </div>

                <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    {erro && (
                        <div style={{ backgroundColor: '#fadbd8', color: '#c0392b', padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                            {erro}
                        </div>
                    )}

                    {mensagem && (
                        <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                            {mensagem}
                        </div>
                    )}

                    <input
                        type="text"
                        placeholder="Nome completo"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        style={inputStyle}
                    />

                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                        autoComplete="off"
                    />

                    <input
                        type="password"
                        placeholder="Crie uma senha (mín. 8 caracteres)"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        style={inputStyle}
                        autoComplete="new-password"
                    />

                    <input
                        type="text"
                        placeholder="Telefone (com DDD)"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        required
                        style={inputStyle}
                    />

                    <button
                        type="submit"
                        style={{
                            padding: '14px',
                            backgroundColor: '#c0392b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            marginTop: '10px',
                            transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a93226'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
                    >
                        Cadastrar Agora
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
                        <span style={{ color: '#7f8c8d' }}>Já tem uma conta? </span>
                        <Link to="/" style={{ color: '#c0392b', textDecoration: 'none', fontWeight: 'bold' }}>Fazer Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}