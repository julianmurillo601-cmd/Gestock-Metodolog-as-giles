import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import logo from '../assets/logo.png';

export default function ReporteMovimientos() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => { API.get('/reportes/movimientos/').then(r => setMovimientos(r.data)); }, []);

  const totalEntradas = movimientos.reduce((a, m) => a + m.total_entradas, 0);
  const totalSalidas = movimientos.reduce((a, m) => a + m.total_salidas, 0);

  return (
    <div id="reporte-movimientos-page" style={styles.container}>
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
          <button onClick={() => navigate('/ReporteStock')} style={styles.navBtn}>📊 Reporte Stock</button>
          <button style={{ ...styles.navBtn, ...styles.navBtnActive }}>📈 Reporte Movimientos</button>
          <button onClick={() => navigate('/perfil')} style={styles.navBtn}>👤 Mi Perfil</button>
        </nav>
        <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>🚪 Cerrar Sesión</button>
      </div>

      <div id="main-content" style={styles.main}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>📈 Reporte de Movimientos</h2>
            <p style={styles.headerSub}>Resumen de entradas y salidas por producto</p>
          </div>
        </div>

        <div style={styles.statsRow}>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #16a34a' }}>
            <p style={styles.statNum}>+{totalEntradas}</p>
            <p style={styles.statLabel}>Total Entradas</p>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #dc2626' }}>
            <p style={styles.statNum}>-{totalSalidas}</p>
            <p style={styles.statLabel}>Total Salidas</p>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '4px solid #2563eb' }}>
            <p style={styles.statNum}>{movimientos.length}</p>
            <p style={styles.statLabel}>Productos con movimientos</p>
          </div>
        </div>

        <div style={styles.tableContainer}>
          <table id="reporte-movimientos-table" style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Total Entradas</th>
                <th style={styles.th}>Total Salidas</th>
                <th style={styles.th}>Total Movimientos</th>
                <th style={styles.th}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.length === 0 ? (
                <tr><td colSpan={5} style={styles.empty}>No hay movimientos registrados</td></tr>
              ) : movimientos.map((m, i) => (
                <tr key={i} style={styles.tr}>
                  <td style={styles.td}><strong>{m.producto}</strong></td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: '#f0fdf4', color: '#16a34a' }}>+{m.total_entradas}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: '#fef2f2', color: '#dc2626' }}>-{m.total_salidas}</span>
                  </td>
                  <td style={styles.td}>{m.total_movimientos}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: m.total_entradas >= m.total_salidas ? '#f0fdf4' : '#fef2f2', color: m.total_entradas >= m.total_salidas ? '#16a34a' : '#dc2626' }}>
                      {m.total_entradas - m.total_salidas >= 0 ? '+' : ''}{m.total_entradas - m.total_salidas}
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
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
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