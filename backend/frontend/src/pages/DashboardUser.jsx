import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import logo from '../assets/logo.png';

export default function DashboardUser() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [activeTab, setActiveTab] = useState('productos');

  useEffect(() => {
    API.get('/inventario/productos/').then(r => setProductos(r.data));
    API.get('/reportes/movimientos/').then(r => setMovimientos(r.data));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <img src={logo} alt="Gestock" style={styles.sidebarLogo} />
          <span style={styles.sidebarTitle}>GESTOCK</span>
        </div>
        <nav style={styles.nav}>
          {[
            { key: 'productos', label: '📦 Productos' },
            { key: 'movimientos', label: '🔄 Movimientos' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              style={{ ...styles.navBtn, ...(activeTab === item.key ? styles.navBtnActive : {}) }}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Cerrar Sesión</button>
      </div>

      {/* Main */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>Panel de Usuario</h2>
            <p style={styles.headerSub}>Consulta el inventario disponible</p>
          </div>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p style={styles.userName}>{user?.first_name} {user?.last_name}</p>
              <p style={styles.userRole}>👤 Usuario estándar</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <p style={styles.statNum}>{productos.length}</p>
            <p style={styles.statLabel}>Productos disponibles</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statNum}>{productos.filter(p => p.stock > 0).length}</p>
            <p style={styles.statLabel}>En stock</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statNum}>{movimientos.length}</p>
            <p style={styles.statLabel}>Productos con movimientos</p>
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {activeTab === 'productos' && (
            <div>
              <h3 style={styles.tableTitle}>📦 Productos en Inventario</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Nombre</th>
                    <th style={styles.th}>Categoría</th>
                    <th style={styles.th}>Precio</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.length === 0 ? (
                    <tr><td colSpan={5} style={styles.empty}>No hay productos registrados</td></tr>
                  ) : productos.map(p => (
                    <tr key={p.id} style={styles.tr}>
                      <td style={styles.td}>{p.nombre}</td>
                      <td style={styles.td}>{p.categoria_nombre || 'Sin categoría'}</td>
                      <td style={styles.td}>${parseFloat(p.precio).toLocaleString()}</td>
                      <td style={styles.td}>{p.stock}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: p.stock === 0 ? '#fef2f2' : p.stock <= p.stock_minimo ? '#fffbeb' : '#f0fdf4',
                          color: p.stock === 0 ? '#dc2626' : p.stock <= p.stock_minimo ? '#d97706' : '#16a34a'
                        }}>
                          {p.stock === 0 ? 'Agotado' : p.stock <= p.stock_minimo ? 'Stock bajo' : 'Disponible'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'movimientos' && (
            <div>
              <h3 style={styles.tableTitle}>🔄 Resumen de Movimientos (Procedimiento SQL)</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Producto</th>
                    <th style={styles.th}>Total Entradas</th>
                    <th style={styles.th}>Total Salidas</th>
                    <th style={styles.th}>Total Movimientos</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientos.length === 0 ? (
                    <tr><td colSpan={4} style={styles.empty}>No hay movimientos registrados</td></tr>
                  ) : movimientos.map((m, i) => (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.td}>{m.producto}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, background: '#f0fdf4', color: '#16a34a' }}>
                          +{m.total_entradas}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, background: '#fef2f2', color: '#dc2626' }}>
                          -{m.total_salidas}
                        </span>
                      </td>
                      <td style={styles.td}>{m.total_movimientos}</td>
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
  sidebar: { width: '240px', background: 'linear-gradient(180deg, #1a3a6b 0%, #1e90ff 100%)', display: 'flex', flexDirection: 'column', padding: '24px 16px' },
  sidebarHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.2)' },
  sidebarLogo: { width: '36px', height: '36px', objectFit: 'contain' },
  sidebarTitle: { color: '#fff', fontWeight: '800', fontSize: '16px', letterSpacing: '2px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  navBtn: { background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', padding: '12px 16px', borderRadius: '10px', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  navBtnActive: { background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: '700' },
  logoutBtn: { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', textAlign: 'left' },
  main: { flex: 1, padding: '32px', overflow: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', background: '#fff', padding: '20px 28px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  headerTitle: { fontSize: '22px', fontWeight: '700', color: '#1a3a6b', margin: 0 },
  headerSub: { fontSize: '13px', color: '#6b7280', margin: '4px 0 0' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a3a6b, #1e90ff)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700' },
  userName: { margin: 0, fontWeight: '600', fontSize: '15px', color: '#1f2937' },
  userRole: { margin: 0, fontSize: '12px', color: '#6b7280' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' },
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