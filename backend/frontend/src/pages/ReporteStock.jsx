import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import logo from '../assets/logo.png';

export default function ReporteStock() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [reportes, setReportes] = useState([]);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => { API.get('/reportes/stock/').then(r => setReportes(r.data)); }, []);

  const filtrados = filtro === 'todos' ? reportes : reportes.filter(r => r.estado.toLowerCase().replace(' ', '_') === filtro);

  return (
    <div id="reporte-stock-page" style={styles.container}>
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
          <button style={{ ...styles.navBtn, ...styles.navBtnActive }}>📊 Reporte Stock</button>
          <button onClick={() => navigate('/reporte-movimientos')} style={styles.navBtn}>📈 Reporte Movimientos</button>
          <button onClick={() => navigate('/perfil')} style={styles.navBtn}>👤 Mi Perfil</button>
        </nav>
        <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>🚪 Cerrar Sesión</button>
      </div>

      <div id="main-content" style={styles.main}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>📊 Reporte de Stock</h2>
            <p style={styles.headerSub}>Vista SQL — Estado actual del inventario</p>
          </div>
          <div style={styles.filtros}>
            {['todos', 'disponible', 'stock_bajo', 'agotado'].map(f => (
              <button key={f} onClick={() => setFiltro(f)} style={{ ...styles.filtroBtn, ...(filtro === f ? styles.filtroBtnActive : {}) }}>
                {f === 'todos' ? 'Todos' : f === 'stock_bajo' ? 'Stock Bajo' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.statsRow}>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #16a34a' }}>
            <p style={styles.statNum}>{reportes.filter(r => r.estado === 'Disponible').length}</p>
            <p style={styles.statLabel}>Disponibles</p>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #d97706' }}>
            <p style={styles.statNum}>{reportes.filter(r => r.estado === 'Stock bajo').length}</p>
            <p style={styles.statLabel}>Stock Bajo</p>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #dc2626' }}>
            <p style={styles.statNum}>{reportes.filter(r => r.estado === 'Agotado').length}</p>
            <p style={styles.statLabel}>Agotados</p>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #2563eb' }}>
            <p style={styles.statNum}>{reportes.length}</p>
            <p style={styles.statLabel}>Total Productos</p>
          </div>
        </div>

        <div style={styles.tableContainer}>
          <table id="reporte-stock-table" style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Categoría</th>
                <th style={styles.th}>Precio</th>
                <th style={styles.th}>Stock Actual</th>
                <th style={styles.th}>Stock Mínimo</th>
                <th style={styles.th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan={6} style={styles.empty}>No hay datos para mostrar</td></tr>
              ) : filtrados.map((r, i) => (
                <tr key={i} style={styles.tr}>
                  <td style={styles.td}><strong>{r.nombre}</strong></td>
                  <td style={styles.td}>{r.categoria}</td>
                  <td style={styles.td}>${parseFloat(r.precio).toLocaleString()}</td>
                  <td style={styles.td}>{r.stock}</td>
                  <td style={styles.td}>{r.stock_minimo}</td>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: '#fff', padding: '20px 28px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  headerTitle: { fontSize: '22px', fontWeight: '700', color: '#1a3a6b', margin: 0 },
  headerSub: { fontSize: '13px', color: '#6b7280', margin: '4px 0 0' },
  filtros: { display: 'flex', gap: '8px' },
  filtroBtn: { background: '#f3f4f6', color: '#374151', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  filtroBtnActive: { background: 'linear-gradient(135deg, #1a3a6b, #2563eb)', color: '#fff' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statNum: { fontSize: '28px', fontWeight: '800', color: '#1a3a6b', margin: '0 0 4px' },
  statLabel: { fontSize: '13px', color: '#6b7280', margin: 0 },
  tableContainer: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8fafc' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#374151' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  empty: { padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' },
};