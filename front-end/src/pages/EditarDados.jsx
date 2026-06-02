import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function EditarDados() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));
    const [nome, setNome] = useState(usuarioLogado?.nome || "");
    const [senhaAntiga, setSenhaAntiga] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ texto: "", tipo: "" });

        if (!senhaAntiga) {
            return setMensagem({ texto: "Digite sua senha atual para confirmar.", tipo: "erro" });
        }

        try {
            await axios.put(`http://localhost:3000/clientes/perfil/${usuarioLogado.id}`, {
                nome,
                senhaAntiga,
                novaSenha
            });

            setMensagem({ texto: "Dados atualizados! Redirecionando...", tipo: "sucesso" });

            const novoUsuario = { ...usuarioLogado, nome: nome };
            localStorage.setItem('usuario', JSON.stringify(novoUsuario));

            setTimeout(() => navigate('/home'), 2000);
        } catch (error) {
            setMensagem({
                texto: error.response?.data?.erro || "Erro ao atualizar dados.",
                tipo: "erro"
            });
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <Header titulo="Editar Perfil" />
            <div style={{ flex: 1, padding: '40px 20px', maxWidth: '400px', margin: '0 auto', width: '100%' }}>

                <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Meus Dados</h3>

                    {mensagem.texto && (
                        <div style={{ padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', backgroundColor: mensagem.tipo === 'erro' ? '#fee2e2' : '#dcfce7', color: mensagem.tipo === 'erro' ? '#dc2626' : '#16a34a' }}>
                            {mensagem.texto}
                        </div>
                    )}

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '13px', color: '#7f8c8d' }}>Nome de Usuário</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px' }} required />
                    </div>

                    <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />
                    <p style={{ fontSize: '12px', color: '#95a5a6', marginBottom: '15px' }}>Para alterar a senha ou confirmar mudanças, preencha abaixo:</p>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '13px', color: '#7f8c8d' }}>Senha Atual</label>
                        <input type="password" value={senhaAntiga} onChange={(e) => setSenhaAntiga(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px' }} placeholder="Obrigatório" />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ fontSize: '13px', color: '#7f8c8d' }}>Nova Senha (opcional)</label>
                        <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px' }} placeholder="Deixe em branco para não mudar" />
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Salvar Alterações
                    </button>

                    <button type="button" onClick={() => navigate('/home')} style={{ width: '100%', marginTop: '10px', padding: '10px', background: 'none', border: 'none', color: '#7f8c8d', cursor: 'pointer' }}>
                        Cancelar
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}