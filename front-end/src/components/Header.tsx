import { Link } from 'react-router-dom';
import logoPimenta from '../assets/logo.png';

export default function Header({ titulo }) {
    return (
        <header style={{
            backgroundColor: '#c0392b',
            padding: '12px 5%',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
            fontFamily: 'sans-serif'
        }}>
            <h1 style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <Link to="/home" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>

                    { }
                    <img
                        src={logoPimenta}
                        alt="Logo PimentaPay"
                        style={{
                            width: '45px',
                            height: '45px',
                            objectFit: 'contain'
                        }}
                    />

                    PimentaPay
                </Link>
            </h1>

            <span style={{
                fontSize: '16px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'inline-block'
            }}>
                {titulo}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link to="/editar-dados" style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '13px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    padding: '8px 14px',
                    borderRadius: '20px',
                    fontWeight: '600',
                    transition: 'background 0.3s'
                }} title="Editar Perfil">
                    ⚙️ Perfil
                </Link>

                <Link to="/extrato" style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '13px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    padding: '8px 14px',
                    borderRadius: '20px',
                    fontWeight: '600',
                    transition: 'background 0.3s'
                }}>
                    📄 Extrato
                </Link>

                <Link to="/" style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '13px',
                    border: '1.5px solid rgba(255, 255, 255, 0.6)',
                    padding: '7px 14px',
                    borderRadius: '20px',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                }} onClick={() => localStorage.removeItem('usuario')}>
                    Sair
                </Link>
            </div>
        </header>
    );
}