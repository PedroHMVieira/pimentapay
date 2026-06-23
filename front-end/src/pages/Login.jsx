import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [mensagem, setMensagem] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErro('');
        setMensagem('');

        try {
            const resposta = await axios.post('http://localhost:3000/clientes/login', {
                email,
                senha
            });

            const usuario = resposta.data.cliente;
            localStorage.setItem('usuario', JSON.stringify(usuario));

            setMensagem(`Olá, ${usuario.nome}! Entrando...`);

            setTimeout(() => {
                if (usuario.tipo_usuario?.toLowerCase() === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/home');
                }
            }, 1500);

        } catch (error) {
            if (error.response && error.response.data.mensagem) {
                setErro(error.response.data.mensagem);
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
        backgroundColor: '#f9f9f9'
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
                maxWidth: '380px',
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{ color: '#c0392b', margin: '0', fontSize: '32px', fontWeight: '800' }}>PimentaPay</h1>
                    <p style={{ color: '#7f8c8d', fontSize: '14px', marginTop: '5px' }}>Acesse sua carteira digital</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    <input type="text" style={{ opacity: 0, position: 'absolute', height: 0, width: 0, zIndex: -1 }} />
                    <input type="password" style={{ opacity: 0, position: 'absolute', height: 0, width: 0, zIndex: -1 }} />

                    {erro && (
                        <div style={{ backgroundColor: '#fadbd8', color: '#c0392b', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold' }}>
                            {erro}
                        </div>
                    )}

                    {mensagem && (
                        <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold' }}>
                            {mensagem}
                        </div>
                    )}

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
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        style={inputStyle}
                        autoComplete="off"
                    />

                    <button
                        type="submit"
                        style={{
                            padding: '14px',
                            backgroundColor: '#c0392b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            marginTop: '10px',
                            boxShadow: '0 4px 12px rgba(192, 57, 43, 0.2)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Entrar
                    </button>

                    <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        <p style={{ color: '#95a5a6', fontSize: '14px', margin: '0' }}>
                            Ainda não tem conta? <br />
                            <Link to="/cadastro" style={{ color: '#c0392b', textDecoration: 'none', fontWeight: 'bold' }}>
                                Criar conta agora
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}