import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import logo from '../assets/logo.png';

export default function DashboardAdmin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [activeTab, setActiveTab] = useState('productos');

  useEffect(() => {
    API.get('/inventario/productos/').then(r => setProductos(r.data));
    API.get('/inventario/categorias/').then(r => setCategorias(r.data));
    API.get('/reportes/stock/').then(r => setReportes(r.data));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div id="dashboard-admin" style={styles.container}>
      {/* Sidebar */}
      <div id="sidebar" style={styles.sidebar}>
        <div id="sidebar-header" style={styles.sidebarHeader}>
          <img src={logo} alt="Gestock" style={styles.sidebarLogo} />
          <span style={styles.sidebarTitle}>GESTOCK</span>
        </div>
        <nav id="sidebar-nav" style={styles.nav}>
          <p style={styles.navSection}>VISTAS</p>
          {[
            { key: 'productos', label: '📦 Productos' },
            { key: 'categorias', label: '🏷️ Categorías' },
            { key: 'reportes', label: '📊 Reportes Stock' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              style={{ ...styles.navBtn, ...(activeTab === item.key ? styles.navBtnActive : {}) }}
            >
              {item.label}
            </button>
          ))}
          <hr style={styles.divider} />
          <p style={styles.navSection}>GESTIÓN CRUD</p>
          <button onClick={() => navigate('/productos')} style={styles.navBtn}>⚙️ Gestión Productos</button>
          <button onClick={() => navigate('/categorias')} style={styles.navBtn}>⚙️ Gestión Categorías</button>
          <button onClick={() => navigate('/movimientos')} style={styles.navBtn}>⚙️ Gestión Movimientos</button>
          <button onClick={() => navigate('/usuarios')} style={styles.navBtn}>⚙️ Gestión Usuarios</button>
          <button onClick={() => navigate('/productos')} style={styles.navBtn}>⚙️ Detalle Producto</button>
          <button onClick={() => navigate('/perfil')} style={styles.navBtn}>⚙️ Perfil Usuario</button>
          <button onClick={() => navigate('/reporte-movimientos')} style={styles.navBtn}>⚙️ Registro Movimientos</button>
          <button onClick={() => navigate('/reporte-stock')} style={styles.navBtn}>⚙️ Reportes Stock</button>
          
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Cerrar Sesión</button>
      </div>

      {/* Main */}
      <div id="main-content" style={styles.main}>
        {/* Header */}
        <div id="page-header" style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>Panel Administrador</h2>
            <p style={styles.headerSub}>Bienvenido al sistema de gestión</p>
          </div>
          <div id="user-info" style={styles.userInfo}>
            <div id="user-avatar" style={styles.avatar}>
              {user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p style={styles.userName}>{user?.first_name} {user?.last_name}</p>
              <p style={styles.userRole}>Administrador</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div id="stats-grid" style={styles.stats}>
          <div className="stat-card" style={styles.statCard}>
            <p style={styles.statNum}>{productos.length}</p>
            <p style={styles.statLabel}>Productos</p>
          </div>
          <div className="stat-card" style={styles.statCard}>
            <p style={styles.statNum}>{categorias.length}</p>
            <p style={styles.statLabel}>Categorías</p>
          </div>
          <div className="stat-card" style={styles.statCard}>
            <p style={styles.statNum}>{reportes.filter(r => r.estado === 'Agotado').length}</p>
            <p style={styles.statLabel}>Agotados</p>
          </div>
          <div className="stat-card" style={styles.statCard}>
            <p style={styles.statNum}>{reportes.filter(r => r.estado === 'Stock bajo').length}</p>
            <p style={styles.statLabel}>Stock Bajo</p>
          </div>
        </div>

        {/* Content */}
        <div id="content-area" style={styles.content}>
          {activeTab === 'productos' && (
            <div>
              <h3 style={styles.tableTitle}>📦 Listado de Productos</h3>
              <table id="productos-table" style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Nombre</th>
                    <th style={styles.th}>Categoría</th>
                    <th style={styles.th}>Precio</th>
                    <th style={styles.th}>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.length === 0 ? (
                    <tr><td colSpan={4} style={styles.empty}>No hay productos registrados</td></tr>
                  ) : productos.map(p => (
                    <tr key={p.id} style={styles.tr}>
                      <td style={styles.td}>{p.nombre}</td>
                      <td style={styles.td}>{p.categoria_nombre || 'Sin categoría'}</td>
                      <td style={styles.td}>${parseFloat(p.precio).toLocaleString()}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, background: p.stock === 0 ? '#fef2f2' : p.stock <= p.stock_minimo ? '#fffbeb' : '#f0fdf4', color: p.stock === 0 ? '#dc2626' : p.stock <= p.stock_minimo ? '#d97706' : '#16a34a' }}>
                          {p.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'categorias' && (
            <div>
              <h3 style={styles.tableTitle}>🏷️ Categorías</h3>
              <table id="categorias-table" style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Nombre</th>
                    <th style={styles.th}>Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.length === 0 ? (
                    <tr><td colSpan={2} style={styles.empty}>No hay categorías registradas</td></tr>
                  ) : categorias.map(c => (
                    <tr key={c.id} style={styles.tr}>
                      <td style={styles.td}>{c.nombre}</td>
                      <td style={styles.td}>{c.descripcion || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reportes' && (
            <div>
              <h3 style={styles.tableTitle}>📊 Reporte de Stock (Vista SQL)</h3>
              <table id="reportes-table" style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Producto</th>
                    <th style={styles.th}>Categoría</th>
                    <th style={styles.th}>Precio</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.length === 0 ? (
                    <tr><td colSpan={5} style={styles.empty}>No hay datos en el reporte</td></tr>
                  ) : reportes.map((r, i) => (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.td}>{r.nombre}</td>
                      <td style={styles.td}>{r.categoria}</td>
                      <td style={styles.td}>${parseFloat(r.precio).toLocaleString()}</td>
                      <td style={styles.td}>{r.stock}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, background: r.estado === 'Agotado' ? '#fef2f2' : r.estado === 'Stock bajo' ? '#fffbeb' : '#f0fdf4', color: r.estado === 'Agotado' ? '#dc2626' : r.estado === 'Stock bajo' ? '#d97706' : '#16a34a' }}>
                          {r.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
  navSection: { color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', margin: '8px 0 4px 16px' },
  divider: { border: '1px solid rgba(255,255,255,0.2)', margin: '8px 0' },
  navBtn: { background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', padding: '10px 16px', borderRadius: '10px', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  navBtnActive: { background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: '700' },
  logoutBtn: { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', textAlign: 'left' },
  main: { flex: 1, padding: '32px', overflow: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', background: '#fff', padding: '20px 28px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  headerTitle: { fontSize: '22px', fontWeight: '700', color: '#1a3a6b', margin: 0 },
  headerSub: { fontSize: '13px', color: '#6b7280', margin: '4px 0 0' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a3a6b, #2563eb)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700' },
  userName: { margin: 0, fontWeight: '600', fontSize: '15px', color: '#1f2937' },
  userRole: { margin: 0, fontSize: '12px', color: '#6b7280' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' },
  statCard: { background: '#fff', borderRadius: '14px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statNum: { fontSize: '32px', fontWeight: '800', color: '#1a3a6b', margin: '0 0 4px' },
  statLabel: { fontSize: '13px', color: '#6b7280', margin: 0 },
  content: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  tableTitle: { fontSize: '16px', fontWeight: '700', color: '#1a3a6b', marginBottom: '16px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8fafc' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#374151' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  empty: { padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' },
};