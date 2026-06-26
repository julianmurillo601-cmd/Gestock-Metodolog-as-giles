import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import logo from '../assets/logo.png';

export default function Categorias() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [error, setError] = useState('');

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = () => API.get('/inventario/categorias/').then(r => setCategorias(r.data));

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editando) {
        await API.put(`/inventario/categorias/${editando.id}/`, form);
      } else {
        await API.post('/inventario/categorias/', form);
      }
      setShowModal(false);
      setEditando(null);
      setForm({ nombre: '', descripcion: '' });
      cargarDatos();
    } catch {
      setError('Error al guardar la categoría.');
    }
  };

  const handleEditar = (c) => {
    setEditando(c);
    setForm({ nombre: c.nombre, descripcion: c.descripcion });
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Eliminar esta categoría?')) {
      await API.delete(`/inventario/categorias/${id}/`);
      cargarDatos();
    }
  };

  return (
    <div id="categorias-page" className="page-container" style={styles.container}>
      <div id="sidebar" className="sidebar" style={styles.sidebar}>
        <div className="sidebar-header" style={styles.sidebarHeader}>
          <img src={logo} alt="Gestock" style={styles.sidebarLogo} />
          <span style={styles.sidebarTitle}>GESTOCK</span>
        </div>
        <nav style={styles.nav}>
          <button onClick={() => navigate('/admin')} style={styles.navBtn}>🏠 Dashboard</button>
          <button onClick={() => navigate('/productos')} style={styles.navBtn}>📦 Productos</button>
          <button style={{ ...styles.navBtn, ...styles.navBtnActive }}>🏷️ Categorías</button>
          <button onClick={() => navigate('/movimientos')} style={styles.navBtn}>🔄 Movimientos</button>
          <button onClick={() => navigate('/usuarios')} style={styles.navBtn}>👥 Usuarios</button>
        </nav>
        <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>🚪 Cerrar Sesión</button>
      </div>

      <div id="main-content" style={styles.main}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>🏷️ Gestión de Categorías</h2>
            <p style={styles.headerSub}>Crea, edita y elimina categorías de productos</p>
          </div>
          <button onClick={() => { setEditando(null); setForm({ nombre: '', descripcion: '' }); setShowModal(true); }} style={styles.btnPrimary}>
            + Nueva Categoría
          </button>
        </div>

        <div style={styles.tableContainer}>
          <table id="categorias-table" style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Descripción</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length === 0 ? (
                <tr><td colSpan={4} style={styles.empty}>No hay categorías registradas</td></tr>
              ) : categorias.map((c, i) => (
                <tr key={c.id} style={styles.tr}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={styles.td}><strong>{c.nombre}</strong></td>
                  <td style={styles.td}>{c.descripcion || '—'}</td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button onClick={() => handleEditar(c)} style={styles.btnEdit}>✏️ Editar</button>
                      <button onClick={() => handleEliminar(c.id)} style={styles.btnDelete}>🗑️ Eliminar</button>
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
            <h3 style={styles.modalTitle}>{editando ? '✏️ Editar Categoría' : '+ Nueva Categoría'}</h3>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} style={styles.input} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} style={{ ...styles.input, height: '80px', resize: 'vertical' }} />
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.btnCancel}>Cancelar</button>
                <button type="submit" style={styles.btnPrimary}>{editando ? 'Guardar cambios' : 'Crear categoría'}</button>
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
  empty: { padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' },
  actions: { display: 'flex', gap: '8px' },
  btnEdit: { background: '#eff6ff', color: '#2563eb', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
  btnDelete: { background: '#fef2f2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalTitle: { fontSize: '20px', fontWeight: '700', color: '#1a3a6b', marginBottom: '24px' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' },
  btnCancel: { background: '#f3f4f6', color: '#374151', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
};