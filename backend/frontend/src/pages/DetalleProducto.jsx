import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import logo from '../assets/logo.png';

export default function DetalleProducto() {
  const { id } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    API.get(`/inventario/productos/${id}/`).then(r => setProducto(r.data));
    API.get('/inventario/movimientos/').then(r => {
      setMovimientos(r.data.filter(m => m.producto === parseInt(id)));
    });
  }, [id]);

  if (!producto) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando...</div>;

  return (
    <div id="detalle-producto-page" style={styles.container}>
      <div id="sidebar" style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <img src={logo} alt="Gestock" style={styles.sidebarLogo} />
          <span style={styles.sidebarTitle}>GESTOCK</span>
        </div>
        <nav style={styles.nav}>
          <button onClick={() => navigate('/admin')} style={styles.navBtn}>🏠 Dashboard</button>
          <button onClick={() => navigate('/productos')} style={{ ...styles.navBtn, ...styles.navBtnActive }}>📦 Productos</button>
          <button onClick={() => navigate('/categorias')} style={styles.navBtn}>🏷️ Categorías</button>
          <button onClick={() => navigate('/movimientos')} style={styles.navBtn}>🔄 Movimientos</button>
          <button onClick={() => navigate('/usuarios')} style={styles.navBtn}>👥 Usuarios</button>
          <button onClick={() => navigate('/reporte-stock')} style={styles.navBtn}>📊 Reporte Stock</button>
          <button onClick={() => navigate('/reporte-movimientos')} style={styles.navBtn}>📈 Reporte Movimientos</button>
          <button onClick={() => navigate('/perfil')} style={styles.navBtn}>👤 Mi Perfil</button>
        </nav>
        <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>🚪 Cerrar Sesión</button>
      </div>

      <div id="main-content" style={styles.main}>
        <div style={styles.header}>
          <div>
            <button onClick={() => navigate('/productos')} style={styles.backBtn}>← Volver a Productos</button>
            <h2 style={styles.headerTitle}>📦 {producto.nombre}</h2>
            <p style={styles.headerSub}>Detalle completo del producto</p>
          </div>
        </div>

        <div style={styles.grid}>
          <div id="info-card" style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Información del Producto</h3>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Nombre</span><span style={styles.infoValue}>{producto.nombre}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Descripción</span><span style={styles.infoValue}>{producto.descripcion || '—'}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Precio</span><span style={styles.infoValue}>${parseFloat(producto.precio).toLocaleString()}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Stock actual</span>
              <span style={{ ...styles.badge, background: producto.stock === 0 ? '#fef2f2' : producto.stock <= producto.stock_minimo ? '#fffbeb' : '#f0fdf4', color: producto.stock === 0 ? '#dc2626' : producto.stock <= producto.stock_minimo ? '#d97706' : '#16a34a' }}>
                {producto.stock} unidades
              </span>
            </div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Stock mínimo</span><span style={styles.infoValue}>{producto.stock_minimo} unidades</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Categoría</span><span style={styles.infoValue}>{producto.categoria_nombre || 'Sin categoría'}</span></div>
          </div>

          <div id="movimientos-card" style={styles.movCard}>
            <h3 style={styles.cardTitle}>Historial de Movimientos</h3>
            <table id="historial-table" style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Tipo</th>
                  <th style={styles.th}>Cantidad</th>
                  <th style={styles.th}>Descripción</th>
                  <th style={styles.th}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.length === 0 ? (
                  <tr><td colSpan={4} style={styles.empty}>Sin movimientos registrados</td></tr>
                ) : movimientos.map(m => (
                  <tr key={m.id} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: m.tipo === 'entrada' ? '#f0fdf4' : '#fef2f2', color: m.tipo === 'entrada' ? '#16a34a' : '#dc2626' }}>
                        {m.tipo === 'entrada' ? '⬆️ Entrada' : '⬇️ Salida'}
                      </span>
                    </td>
                    <td style={styles.td}>{m.cantidad}</td>
                    <td style={styles.td}>{m.descripcion || '—'}</td>
                    <td style={styles.td}>{new Date(m.fecha).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  backBtn: { background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '8px', padding: 0 },
  headerTitle: { fontSize: '22px', fontWeight: '700', color: '#1a3a6b', margin: 0 },
  headerSub: { fontSize: '13px', color: '#6b7280', margin: '4px 0 0' },
  grid: { display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' },
  infoCard: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: 'fit-content' },
  movCard: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1a3a6b', marginBottom: '20px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' },
  infoLabel: { fontSize: '13px', color: '#6b7280', fontWeight: '500' },
  infoValue: { fontSize: '14px', color: '#1f2937', fontWeight: '600' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8fafc' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#374151' },
  empty: { padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' },
};