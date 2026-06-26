import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import logo from '../assets/logo.png';

export default function Usuarios() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', first_name: '', last_name: '', password: '', password2: '', is_staff: false });
  const [error, setError] = useState('');

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = () => API.get('/users/lista/').then(r => setUsuarios(r.data)).catch(() => {});

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editando) {
        await API.put(`/users/lista/${editando.id}/`, form);
      } else {
        await API.post('/users/register/', form);
      }
      setShowModal(false);
      setEditando(null);
      setForm({ username: '', email: '', first_name: '', last_name: '', password: '', password2: '', is_staff: false });
      cargarDatos();
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(' ') : 'Error al guardar usuario.');
    }
  };

  const handleEditar = (u) => {
    setEditando(u);
    setForm({ username: u.username, email: u.email, first_name: u.first_name, last_name: u.last_name, password: '', password2: '', is_staff: u.is_staff });
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Eliminar este usuario?')) {
      await API.delete(`/users/lista/${id}/`);
      cargarDatos();
    }
  };

  return (
    <div id="usuarios-page" style={styles.container}>
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
          <button style={{ ...styles.navBtn, ...styles.navBtnActive }}>👥 Usuarios</button>
        </nav>
        <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>🚪 Cerrar Sesión</button>
      </div>

      <div id="main-content" style={styles.main}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>👥 Gestión de Usuarios</h2>
            <p style={styles.headerSub}>Administra los usuarios del sistema</p>
          </div>
          <button onClick={() => { setEditando(null); setForm({ username: '', email: '', first_name: '', last_name: '', password: '', password2: '', is_staff: false }); setShowModal(true); }} style={styles.btnPrimary}>
            + Nuevo Usuario
          </button>
        </div>

        <div style={styles.tableContainer}>
          <table id="usuarios-table" style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Usuario</th>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Rol</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr><td colSpan={5} style={styles.empty}>No hay usuarios registrados</td></tr>
              ) : usuarios.map(u => (
                <tr key={u.id} style={styles.tr}>
                  <td style={styles.td}><strong>{u.username}</strong></td>
                  <td style={styles.td}>{u.first_name} {u.last_name}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: u.is_staff ? '#eff6ff' : '#f0fdf4', color: u.is_staff ? '#1d4ed8' : '#16a34a' }}>
                      {u.is_staff ? '👑 Admin' : '👤 Usuario'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button onClick={() => handleEditar(u)} style={styles.btnEdit}>✏️ Editar</button>
                      <button onClick={() => handleEliminar(u.id)} style={styles.btnDelete}>🗑️ Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div id="modal-overlay" style={styles.overlay}>
          <div id="modal-form" style={styles.modal}>
            <h3 style={styles.modalTitle}>{editando ? '✏️ Editar Usuario' : '+ Nuevo Usuario'}</h3>
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
                <label style={styles.label}>Usuario</label>
                <input name="username" value={form.username} onChange={handleChange} style={styles.input} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} style={styles.input} required />
              </div>
              {!editando && <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Contraseña</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} style={styles.input} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Confirmar contraseña</label>
                  <input name="password2" type="password" value={form.password2} onChange={handleChange} style={styles.input} required />
                </div>
              </>}
              <div style={{ ...styles.formGroup, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" name="is_staff" checked={form.is_staff} onChange={handleChange} id="is_staff" />
                <label htmlFor="is_staff" style={{ fontSize: '14px', color: '#374151' }}>Es administrador</label>
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.btnCancel}>Cancelar</button>
                <button type="submit" style={styles.btnPrimary}>{editando ? 'Guardar cambios' : 'Crear usuario'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", background: '#f1f5f9' },
  sidebar: { width: '240px', background: 'linear-gradient(180deg, #1a3a6b 0%, #2563eb 100%)', display: 'flex', flexDirection: 'column', padding: '24px 16px' },
  sidebarHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.2)' },
  sidebarLogo: { width: '36px', height: '36px', objectFit: 'contain' },
  sidebarTitle: { color: '#fff', fontWeight: '800', fontSize: '16px', letterSpacing: '2px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  navBtn: { background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', padding: '12px 16px', borderRadius: '10px', textAlign: 'left', cursor: 'pointer', fontSize: '14px' },
  navBtnActive: { background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: '700' },
  logoutBtn: { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', textAlign: 'left' },
  main: { flex: 1, padding: '32px', overflow: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: '#fff', padding: '20px 28px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  headerTitle: { fontSize: '22px', fontWeight: '700', color: '#1a3a6b', margin: 0 },
  headerSub: { fontSize: '13px', color: '#6b7280', margin: '4px 0 0' },
  btnPrimary: { background: 'linear-gradient(135deg, #1a3a6b, #2563eb)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' },
  tableContainer: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8fafc' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#374151' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  empty: { padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' },
  actions: { display: 'flex', gap: '8px' },
  btnEdit: { background: '#eff6ff', color: '#2563eb', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
  btnDelete: { background: '#fef2f2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalTitle: { fontSize: '20px', fontWeight: '700', color: '#1a3a6b', marginBottom: '24px' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  formGroup: { marginBottom: '16px' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' },
  btnCancel: { background: '#f3f4f6', color: '#374151', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
};