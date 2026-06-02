import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer style={{
            backgroundColor: '#c0392b',
            color: '#ffffff',
            padding: '40px 5%',
            marginTop: 'auto',
            width: '100%',
            boxShadow: '0px -4px 10px rgba(0,0,0,0.15)',
            fontFamily: 'sans-serif'
        }}>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '30px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>

                <div style={{ flex: '1', minWidth: '250px' }}>
                    <h4 style={{
                        marginBottom: '15px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontSize: '16px'
                    }}>
                        Onde estamos
                    </h4>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', opacity: '0.9' }}>
                        Av. Comendador Norberto Marcondes, 3391<br />
                        Jardim Conrado, Campo Mourão - PR<br />
                        87308-200
                    </p>
                </div>

                <div style={{ flex: '1', minWidth: '250px', textAlign: 'center' }}>
                    <h4 style={{ marginBottom: '15px', fontSize: '16px' }}>Contato</h4>
                    <p style={{ fontSize: '15px', fontWeight: '500' }}>pimentapay@gmail.com</p>
                    <p style={{ fontSize: '12px', marginTop: '25px', opacity: '0.7' }}>
                        © {new Date().getFullYear()} PimentaPay. Todos os direitos reservados.
                    </p>
                </div>

                <div style={{ flex: '1', minWidth: '250px', textAlign: 'right' }}>
                    <h4 style={{ marginBottom: '15px', fontSize: '16px' }}>Links</h4>
                    <Link to="/sobre" style={{
                        color: 'white',
                        textDecoration: 'none',
                        border: '1.5px solid white',
                        padding: '8px 20px',
                        borderRadius: '25px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        display: 'inline-block'
                    }}>
                        Sobre a PimentaPay
                    </Link>
                </div>

            </div>
        </footer>
    );
}