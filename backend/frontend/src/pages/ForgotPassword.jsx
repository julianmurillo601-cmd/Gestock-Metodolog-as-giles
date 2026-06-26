import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import logo from '../assets/logo.png';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await API.post('/users/password-reset/', { email });
      setMessage('Te enviamos un correo con las instrucciones para restablecer tu contraseña.');
    } catch {
      setError('No existe una cuenta con ese correo electrónico.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={logo} alt="Gestock" style={styles.logo} />
        <h1 style={styles.title}>GESTOCK</h1>
        <p style={styles.subtitle}>Recuperar contraseña</p>

        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </form>

        <div style={styles.links}>
          <Link to="/login" style={styles.link}>← Volver al inicio de sesión</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a3a6b 0%, #2563eb 50%, #1e90ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  logo: { width: '80px', height: '80px', objectFit: 'contain', marginBottom: '12px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1a3a6b', margin: '0 0 4px', letterSpacing: '3px' },
  subtitle: { fontSize: '13px', color: '#6b7280', marginBottom: '32px' },
  success: {
    background: '#f0fdf4', color: '#16a34a', padding: '12px 16px',
    borderRadius: '8px', fontSize: '14px', marginBottom: '16px',
    border: '1px solid #bbf7d0', lineHeight: '1.5',
  },
  error: {
    background: '#fef2f2', color: '#dc2626', padding: '10px 16px',
    borderRadius: '8px', fontSize: '14px', marginBottom: '16px',
    border: '1px solid #fecaca',
  },
  form: { textAlign: 'left' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
  input: {
    width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb',
    borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  },
  button: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #1a3a6b, #2563eb)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '16px', fontWeight: '700', cursor: 'pointer', letterSpacing: '1px',
  },
  links: { marginTop: '24px' },
  link: { color: '#2563eb', fontSize: '13px', textDecoration: 'none', fontWeight: '500' },
};