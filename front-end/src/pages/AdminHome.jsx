import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminHome() {
    const cardStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '240px',
        height: '180px',
        backgroundColor: '#ffffff',
        borderTop: '5px solid #c0392b',
        borderRadius: '12px',
        textDecoration: 'none',
        color: '#2c3e50',
        boxShadow: '0 8px 15px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        fontFamily: 'sans-serif'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
            <Header titulo="Painel do Administrador" />

            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                gap: '40px',
                padding: '80px 20px',
                flexWrap: 'wrap',
                alignContent: 'flex-start'
            }}>

                <Link
                    to="/admin/produtos"
                    style={cardStyle}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <span style={{ fontSize: '50px', marginBottom: '15px' }}>🍔</span>
                    <strong style={{ fontSize: '16px', letterSpacing: '0.5px' }}>Gerenciar Produtos</strong>
                </Link>

                <Link
                    to="/admin/clientes"
                    style={cardStyle}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <span style={{ fontSize: '50px', marginBottom: '15px' }}>👥</span>
                    <strong style={{ fontSize: '16px', letterSpacing: '0.5px' }}>Gerenciar Clientes</strong>
                </Link>

                <Link
                    to="/admin/pedidos"
                    style={cardStyle}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <span style={{ fontSize: '50px', marginBottom: '15px' }}>📋</span>
                    <strong style={{ fontSize: '16px', letterSpacing: '0.5px' }}>Ver Pedidos</strong>
                </Link>

            </div>

            <Footer />
        </div>
    );
}