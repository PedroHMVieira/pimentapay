import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Sobre() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            fontFamily: "'Inter', 'Segoe UI', sans-serif"
        }}>

            <Header titulo="Sobre Nós" />

            <style>
                {`
                    .sobre-card {
                        background: white;
                        border-radius: 12px;
                        padding: 40px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                        margin-bottom: 30px;
                        transition: transform 0.3s ease;
                    }
                    .sobre-card:hover {
                        transform: translateY(-5px);
                    }
                    .btn-voltar {
                        display: inline-block;
                        background-color: #c0392b;
                        color: white;
                        text-decoration: none;
                        padding: 12px 24px;
                        border-radius: 25px;
                        font-weight: 600;
                        transition: background-color 0.2s;
                        margin-top: 20px;
                    }
                    .btn-voltar:hover {
                        background-color: #a93226;
                    }
                `}
            </style>

            <main style={{
                flex: '1',
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto',
                padding: '40px 20px'
            }}>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{
                        color: '#c0392b',
                        fontSize: '32px',
                        marginBottom: '10px',
                        fontWeight: '800'
                    }}>
                        Essa é a nossa união!
                    </h2>
                    <p style={{ color: '#555', fontSize: '18px' }}>
                        Conheça o objetivo por trás do PimentaPay.
                    </p>
                </div>

                <div className="sobre-card">
                    <h3 style={{ color: '#333', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>
                        🌶️ A Nossa Missão
                    </h3>
                    <p style={{ color: '#555', lineHeight: '1.8', fontSize: '16px' }}>
                        O PimentaPay tem como objetivo modernizar e melhorar a experiência de pagamento em nosso estabelecimento, facilitando a sua e a nossa vida, quem sabe não expandindo para outros estabelecimentos!
                    </p>
                </div>

                <div className="sobre-card">
                    <h3 style={{ color: '#333', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>
                        💡 Como Funciona?
                    </h3>
                    <ul style={{ color: '#555', lineHeight: '1.8', fontSize: '16px', paddingLeft: '20px' }}>
                        <li style={{ marginBottom: '10px' }}><strong>Para o Cliente:</strong> Uma interface simples onde ele pode ver o cardápio, fazer o pedido e o valor é descontado automaticamente do seu saldo.</li>
                        <li style={{ marginBottom: '10px' }}><strong>Para o Administrador:</strong> Gestão completa de produtos, controle de status dos pedidos (Pendente, Preparando, Concluído) e controle de todos os clientes fidelizados!</li>
                        <li><strong>Estorno Automático:</strong> Se um pedido for cancelado, o sistema é inteligente o suficiente para devolver o dinheiro ao cliente instantaneamente.</li>
                    </ul>
                </div>

                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <p style={{ color: '#777', fontSize: '14px', marginBottom: '15px' }}>
                        Desenvolvido com tecnologia Node.js, React.
                    </p>
                    <Link to="/home" className="btn-voltar">
                        Voltar para a Página Inicial
                    </Link>
                </div>

            </main>

            <Footer />
        </div>
    );
}