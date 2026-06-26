import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import logo from '../assets/logo.png';

export default function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '', email: user?.email || '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await API.put('/users/profile/', form);
      setSuccess('Perfil actualizado correctamente.');
    } catch {
      setError('Error al actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="perfil-page" style={styles.container}>
      <div id="sidebar" style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <img src={logo} alt="Gestock" style={styles.sidebarLogo} />
          <span style={styles.sidebarTitle}>GESTOCK</span>
        </div>
        <nav style={styles.nav}>
          <button onClick={() => navigate('/admin')} style={styles.navBtn}>🏠 Dashboard</button>
          <button onClick={() => navigate('/productos')} style={styles.navBtn}>📦 Productos</button>
          <button onClick={() => navigate('/categorias')} style={styles.navBtn}>🏷️ Categorías</button>
          <button onClick={() => navigate('/movimientos')} style={styles.navBtn}>🔄 Movimientos</button>
          <button onClick={() => navigate('/usuarios')} style={styles.navBtn}>👥 Usuarios</button>
          <button onClick={() => navigate('/reporte-stock')} style={styles.navBtn}>📊 Reporte Stock</button>
          <button onClick={() => navigate('/reporte-movimientos')} style={styles.navBtn}>📈 Reporte Movimientos</button>
          <button style={{ ...styles.navBtn, ...styles.navBtnActive }}>👤 Mi Perfil</button>
        </nav>
        <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>🚪 Cerrar Sesión</button>
      </div>

      <div id="main-content" style={styles.main}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>👤 Mi Perfil</h2>
            <p style={styles.headerSub}>Actualiza tu información personal</p>
          </div>
        </div>

        <div style={styles.profileGrid}>
          <div id="avatar-card" style={styles.avatarCard}>
            <div style={styles.avatarBig}>
              {user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
            </div>
            <h3 style={styles.avatarName}>{user?.first_name} {user?.last_name}</h3>
            <p style={styles.avatarUsername}>@{user?.username}</p>
            <span style={{ ...styles.badge, background: user?.is_staff ? '#eff6ff' : '#f0fdf4', color: user?.is_staff ? '#1d4ed8' : '#16a34a' }}>
              {user?.is_staff ? '👑 Administrador' : '👤 Usuario'}
            </span>
          </div>

          <div id="form-card" style={styles.formCard}>
            <h3 style={styles.formTitle}>Editar información</h3>
            {success && <div style={styles.success}>{success}</div>}
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nombre</label>
                  <input name="first_name" value={form.first_name} onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Apellido</label>
                  <input name="last_name" value={form.last_name} onChange={handleChange} style={styles.input} />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Correo electrónico</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Usuario</label>
                <input value={user?.username} style={{ ...styles.input, background: '#f3f4f6', color: '#9ca3af' }} disabled />
              </div>
              <button type="submit" style={styles.btnPrimary} disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", background: '#f1f5f9' },
  sidebar: { width: '240px', background: 'linear-gradient(180deg, #1a3a6b 0%, #2563eb 100%)', display: 'flex', flexDirection: 'column', padding: '24px 16px' },
  sidebarHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.2)' },
  sidebarLogo: { width: '36px', height: '36px', objectFit: 'contain' },
  sidebarTitle: { color: '#fff', fontWeight: '800', fontSize: '16px', letterSpacing: '2px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  navBtn: { background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', padding: '10px 16px', borderRadius: '10px', textAlign: 'left', cursor: 'pointer', fontSize: '13px' },
  navBtnActive: { background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: '700' },
  logoutBtn: { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', textAlign: 'left' },
  main: { flex: 1, padding: '32px', overflow: 'auto' },
  header: { marginBottom: '24px', background: '#fff', padding: '20px 28px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  headerTitle: { fontSize: '22px', fontWeight: '700', color: '#1a3a6b', margin: 0 },
  headerSub: { fontSize: '13px', color: '#6b7280', margin: '4px 0 0' },
  profileGrid: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' },
  avatarCard: { background: '#fff', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: 'fit-content' },
  avatarBig: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a3a6b, #2563eb)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '700', margin: '0 auto 16px' },
  avatarName: { fontSize: '18px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px' },
  avatarUsername: { fontSize: '14px', color: '#6b7280', margin: '0 0 16px' },
  badge: { padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  formCard: { background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  formTitle: { fontSize: '18px', fontWeight: '700', color: '#1a3a6b', marginBottom: '24px' },
  success: { background: '#f0fdf4', color: '#16a34a', padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid #bbf7d0' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  btnPrimary: { background: 'linear-gradient(135deg, #1a3a6b, #2563eb)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '15px', marginTop: '8px' },
};