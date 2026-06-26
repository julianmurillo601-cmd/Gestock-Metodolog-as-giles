import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import logo from '../assets/logo.png';

export default function Movimientos() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ producto: '', tipo: 'entrada', cantidad: '', descripcion: '' });
  const [error, setError] = useState('');

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = () => {
    API.get('/inventario/movimientos/').then(r => setMovimientos(r.data));
    API.get('/inventario/productos/').then(r => setProductos(r.data));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/inventario/movimientos/', form);
      setShowModal(false);
      setForm({ producto: '', tipo: 'entrada', cantidad: '', descripcion: '' });
      cargarDatos();
    } catch {
      setError('Error al registrar el movimiento.');
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Eliminar este movimiento?')) {
      await API.delete(`/inventario/movimientos/${id}/`);
      cargarDatos();
    }
  };

  return (
    <div id="movimientos-page" style={styles.container}>
      <div id="sidebar" style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <img src={logo} alt="Gestock" style={styles.sidebarLogo} />
          <span style={styles.sidebarTitle}>GESTOCK</span>
        </div>
        <nav style={styles.nav}>
          <button onClick={() => navigate('/admin')} style={styles.navBtn}>🏠 Dashboard</button>
          <button onClick={() => navigate('/productos')} style={styles.navBtn}>📦 Productos</button>
          <button onClick={() => navigate('/categorias')} style={styles.navBtn}>🏷️ Categorías</button>
          <button style={{ ...styles.navBtn, ...styles.navBtnActive }}>🔄 Movimientos</button>
          <button onClick={() => navigate('/usuarios')} style={styles.navBtn}>👥 Usuarios</button>
        </nav>
        <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>🚪 Cerrar Sesión</button>
      </div>

      <div id="main-content" style={styles.main}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>🔄 Gestión de Movimientos</h2>
            <p style={styles.headerSub}>Registra entradas y salidas del inventario</p>
          </div>
          <button onClick={() => setShowModal(true)} style={styles.btnPrimary}>+ Nuevo Movimiento</button>
        </div>

        <div style={styles.tableContainer}>
          <table id="movimientos-table" style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Cantidad</th>
                <th style={styles.th}>Descripción</th>
                <th style={styles.th}>Usuario</th>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.length === 0 ? (
                <tr><td colSpan={7} style={styles.empty}>No hay movimientos registrados</td></tr>
              ) : movimientos.map(m => (
                <tr key={m.id} style={styles.tr}>
                  <td style={styles.td}>{m.producto_nombre}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: m.tipo === 'entrada' ? '#f0fdf4' : '#fef2f2', color: m.tipo === 'entrada' ? '#16a34a' : '#dc2626' }}>
                      {m.tipo === 'entrada' ? '⬆️ Entrada' : '⬇️ Salida'}
                    </span>
                  </td>
                  <td style={styles.td}>{m.cantidad}</td>
                  <td style={styles.td}>{m.descripcion || '—'}</td>
                  <td style={styles.td}>{m.usuario_nombre}</td>
                  <td style={styles.td}>{new Date(m.fecha).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <button onClick={() => handleEliminar(m.id)} style={styles.btnDelete}>🗑️ Eliminar</button>
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
            <h3 style={styles.modalTitle}>+ Nuevo Movimiento</h3>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Producto</label>
                <select name="producto" value={form.producto} onChange={handleChange} style={styles.input} required>
                  <option value="">Selecciona un producto</option>
                  {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo</label>
                <select name="tipo" value={form.tipo} onChange={handleChange} style={styles.input}>
                  <option value="entrada">⬆️ Entrada</option>
                  <option value="salida">⬇️ Salida</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Cantidad</label>
                <input name="cantidad" type="number" min="1" value={form.cantidad} onChange={handleChange} style={styles.input} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Descripción</label>
                <input name="descripcion" value={form.descripcion} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.btnCancel}>Cancelar</button>
                <button type="submit" style={styles.btnPrimary}>Registrar</button>
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