import { Link } from 'react-router-dom';
import logoPimenta from '../assets/logo.png';

export default function Header({ titulo }) {
    const usuarioStorage = localStorage.getItem('usuario');
    const usuarioLogado = usuarioStorage ? JSON.parse(usuarioStorage) : null;

    const isAdm = usuarioLogado?.tipo_usuario === 'admin';

    return (
        <>
            <style>
                {`
                    .header-link {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        color: white;
                        text-decoration: none;
                        font-size: 14px;
                        background-color: rgba(255, 255, 255, 0.1);
                        padding: 8px 16px;
                        border-radius: 24px;
                        font-weight: 500;
                        transition: all 0.2s ease-in-out;
                        border: 1px solid transparent;
                    }
                    .header-link:hover {
                        background-color: rgba(255, 255, 255, 0.2);
                        transform: translateY(-1px);
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    }
                    .header-btn-sair {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        color: white;
                        text-decoration: none;
                        font-size: 14px;
                        border: 1.5px solid rgba(255, 255, 255, 0.6);
                        padding: 7px 16px;
                        border-radius: 24px;
                        font-weight: 600;
                        transition: all 0.2s ease-in-out;
                    }
                    .header-btn-sair:hover {
                        background-color: white;
                        color: #c0392b;
                        transform: translateY(-1px);
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    }
                `}
            </style>

            <header style={{
                background: 'linear-gradient(135deg, #c0392b 0%, #a93226 100%)',
                padding: '12px 5%',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                backdropFilter: 'blur(10px)'
            }}>

                <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>
                    <Link to={isAdm ? "/admin" : "/home"} style={{
                        color: 'white',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'opacity 0.2s'
                    }}>
                        <img
                            src={logoPimenta}
                            alt="Logo PimentaPay"
                            style={{
                                width: '48px',
                                height: '48px',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.3))',
                                border: '2px solid rgba(255, 255, 255, 0.8)',
                                borderRadius: '50%',
                                padding: '4px',
                                backgroundColor: 'rgba(255, 255, 255, 0.15)'
                            }}
                        />
                        <span style={{ tracking: 'tight' }}>PimentaPay</span>
                    </Link>
                </h1>

                <span style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    display: 'inline-block',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    padding: '6px 16px',
                    borderRadius: '8px'
                }}>
                    {titulo}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                    <Link to="/editar-dados" className="header-link" title="Editar Perfil">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                        Perfil
                    </Link>

                    {!isAdm && (
                        <Link to="/extrato" className="header-link">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                            </svg>
                            Extrato
                        </Link>
                    )}

                    <Link to="/" className="header-btn-sair" onClick={() => localStorage.removeItem('usuario')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sair
                    </Link>
                </div>

            </header>
        </>
    );
}