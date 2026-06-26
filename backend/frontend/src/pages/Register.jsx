import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import logo from '../assets/logo.png';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', first_name: '',
    last_name: '', password: '', password2: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/users/register/', form);
      navigate('/login');
    } catch (err) {
      const data = err.response?.data;
      const msg = data ? Object.values(data).flat().join(' ') : 'Error al registrar.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={logo} alt="Gestock" style={styles.logo} />
        <h1 style={styles.title}>GESTOCK</h1>
        <p style={styles.subtitle}>Crear nueva cuenta</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nombre</label>
              <input name="first_name" value={form.first_name} onChange={handleChange} style={styles.input} placeholder="Nombre" required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Apellido</label>
              <input name="last_name" value={form.last_name} onChange={handleChange} style={styles.input} placeholder="Apellido" required />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Usuario</label>
            <input name="username" value={form.username} onChange={handleChange} style={styles.input} placeholder="Nombre de usuario" required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo electrónico</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} style={styles.input} placeholder="correo@ejemplo.com" required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} style={styles.input} placeholder="Mínimo 8 caracteres" required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirmar contraseña</label>
            <input type="password" name="password2" value={form.password2} onChange={handleChange} style={styles.input} placeholder="Repite tu contraseña" required />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div style={styles.links}>
          <Link to="/login" style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Link>
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
    padding: '24px',
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  logo: { width: '70px', height: '70px', objectFit: 'contain', marginBottom: '10px' },
  title: { fontSize: '26px', fontWeight: '800', color: '#1a3a6b', margin: '0 0 4px', letterSpacing: '3px' },
  subtitle: { fontSize: '13px', color: '#6b7280', marginBottom: '28px' },
  error: {
    background: '#fef2f2', color: '#dc2626', padding: '10px 16px',
    borderRadius: '8px', fontSize: '14px', marginBottom: '16px', border: '1px solid #fecaca',
  },
  form: { textAlign: 'left' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
  input: {
    width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb',
    borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  },
  button: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #1a3a6b, #2563eb)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '4px', letterSpacing: '1px',
  },
  links: { marginTop: '20px' },
  link: { color: '#2563eb', fontSize: '13px', textDecoration: 'none', fontWeight: '500' },
};