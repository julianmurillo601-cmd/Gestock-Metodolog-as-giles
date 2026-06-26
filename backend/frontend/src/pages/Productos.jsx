import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import logo from '../assets/logo.png';

export default function Productos() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', categoria: '', precio: '', stock: '', stock_minimo: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    API.get('/inventario/productos/').then(r => setProductos(r.data));
    API.get('/inventario/categorias/').then(r => setCategorias(r.data));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editando) {
        await API.put(`/inventario/productos/${editando.id}/`, form);
      } else {
        await API.post('/inventario/productos/', form);
      }
      setShowModal(false);
      setEditando(null);
      setForm({ nombre: '', descripcion: '', categoria: '', precio: '', stock: '', stock_minimo: '' });
      cargarDatos();
    } catch (err) {
      setError('Error al guardar el producto.');
    }
  };

  const handleEditar = (p) => {
    setEditando(p);
    setForm({ nombre: p.nombre, descripcion: p.descripcion, categoria: p.categoria, precio: p.precio, stock: p.stock, stock_minimo: p.stock_minimo });
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      await API.delete(`/inventario/productos/${id}/`);
      cargarDatos();
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div id="productos-page" className="page-container" style={styles.container}>
      {/* Sidebar */}
      <div id="sidebar" className="sidebar" style={styles.sidebar}>
        <div className="sidebar-header" style={styles.sidebarHeader}>
          <img src={logo} alt="Gestock" className="sidebar-logo" style={styles.sidebarLogo} />
          <span className="sidebar-title" style={styles.sidebarTitle}>GESTOCK</span>
        </div>
        <nav className="sidebar-nav" style={styles.nav}>
          <button onClick={() => navigate('/admin')} className="nav-btn" style={styles.navBtn}>🏠 Dashboard</button>
          <button className="nav-btn nav-btn-active" style={{ ...styles.navBtn, ...styles.navBtnActive }}>📦 Productos</button>
          <button onClick={() => navigate('/categorias')} className="nav-btn" style={styles.navBtn}>🏷️ Categorías</button>
          <button onClick={() => navigate('/movimientos')} className="nav-btn" style={styles.navBtn}>🔄 Movimientos</button>
          <button onClick={() => navigate('/usuarios')} className="nav-btn" style={styles.navBtn}>👥 Usuarios</button>
        </nav>
        <button onClick={handleLogout} className="logout-btn" style={styles.logoutBtn}>🚪 Cerrar Sesión</button>
      </div>

      {/* Main */}
      <div id="main-content" className="main-content" style={styles.main}>
        <div className="page-header" style={styles.header}>
          <div>
            <h2 className="page-title" style={styles.headerTitle}>📦 Gestión de Productos</h2>
            <p className="page-subtitle" style={styles.headerSub}>Crea, edita y elimina productos del inventario</p>
          </div>
          <button onClick={() => { setEditando(null); setForm({ nombre: '', descripcion: '', categoria: '', precio: '', stock: '', stock_minimo: '' }); setShowModal(true); }} className="btn-primary" style={styles.btnPrimary}>
            + Nuevo Producto
          </button>
        </div>

        {/* Tabla */}
        <div className="table-container" style={styles.tableContainer}>
          <table id="productos-table" className="data-table" style={styles.table}>
            <thead>
              <tr className="table-header" style={styles.thead}>
                <th className="table-th" style={styles.th}>Nombre</th>
                <th className="table-th" style={styles.th}>Categoría</th>
                <th className="table-th" style={styles.th}>Precio</th>
                <th className="table-th" style={styles.th}>Stock</th>
                <th className="table-th" style={styles.th}>Stock Mín.</th>
                <th className="table-th" style={styles.th}>Estado</th>
                <th className="table-th" style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr><td colSpan={7} className="table-empty" style={styles.empty}>No hay productos registrados</td></tr>
              ) : productos.map(p => (
                <tr key={p.id} className="table-row" style={styles.tr}>
                  <td className="table-td" style={styles.td}>{p.nombre}</td>
                  <td className="table-td" style={styles.td}>{p.categoria_nombre || 'Sin categoría'}</td>
                  <td className="table-td" style={styles.td}>${parseFloat(p.precio).toLocaleString()}</td>
                  <td className="table-td" style={styles.td}>{p.stock}</td>
                  <td className="table-td" style={styles.td}>{p.stock_minimo}</td>
                  <td className="table-td" style={styles.td}>
                    <span className="status-badge" style={{ ...styles.badge, background: p.stock === 0 ? '#fef2f2' : p.stock <= p.stock_minimo ? '#fffbeb' : '#f0fdf4', color: p.stock === 0 ? '#dc2626' : p.stock <= p.stock_minimo ? '#d97706' : '#16a34a' }}>
                      {p.stock === 0 ? 'Agotado' : p.stock <= p.stock_minimo ? 'Stock bajo' : 'Disponible'}
                    </span>
                  </td>
                  <td className="table-td" style={styles.td}>
                    <div className="action-btns" style={styles.actions}>
                      <button onClick={() => handleEditar(p)} className="btn-edit" style={styles.btnEdit}>✏️ Editar</button>
                      <button onClick={() => handleEliminar(p.id)} className="btn-delete" style={styles.btnDelete}>🗑️ Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div id="modal-overlay" className="modal-overlay" style={styles.overlay}>
          <div id="modal-form" className="modal-form" style={styles.modal}>
            <h3 className="modal-title" style={styles.modalTitle}>{editando ? '✏️ Editar Producto' : '+ Nuevo Producto'}</h3>
            {error && <div className="error-msg" style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group" style={styles.formGroup}>
                <label className="form-label" style={styles.label}>Nombre</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} className="form-input" style={styles.input} required />
              </div>
              <div className="form-group" style={styles.formGroup}>
                <label className="form-label" style={styles.label}>Descripción</label>
                <input name="descripcion" value={form.descripcion} onChange={handleChange} className="form-input" style={styles.input} />
              </div>
              <div className="form-group" style={styles.formGroup}>
                <label className="form-label" style={styles.label}>Categoría</label>
                <select name="categoria" value={form.categoria} onChange={handleChange} className="form-select" style={styles.input}>
                  <option value="">Sin categoría</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="form-row" style={styles.formRow}>
                <div className="form-group" style={styles.formGroup}>
                  <label className="form-label" style={styles.label}>Precio</label>
                  <input name="precio" type="number" value={form.precio} onChange={handleChange} className="form-input" style={styles.input} required />
                </div>
                <div className="form-group" style={styles.formGroup}>
                  <label className="form-label" style={styles.label}>Stock</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} className="form-input" style={styles.input} required />
                </div>
                <div className="form-group" style={styles.formGroup}>
                  <label className="form-label" style={styles.label}>Stock Mínimo</label>
                  <input name="stock_minimo" type="number" value={form.stock_minimo} onChange={handleChange} className="form-input" style={styles.input} required />
                </div>
              </div>
              <div className="modal-actions" style={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel" style={styles.btnCancel}>Cancelar</button>
                <button type="submit" className="btn-primary" style={styles.btnPrimary}>{editando ? 'Guardar cambios' : 'Crear producto'}</button>
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
  navBtn: { background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', padding: '12px 16px', borderRadius: '10px', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
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
  modal: { background: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '560px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalTitle: { fontSize: '20px', fontWeight: '700', color: '#1a3a6b', marginBottom: '24px' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  formGroup: { marginBottom: '16px' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' },
  btnCancel: { background: '#f3f4f6', color: '#374151', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
};