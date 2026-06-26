import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <img src={logo} alt="Gestock" style={styles.navLogo} />
          <span style={styles.navTitle}>GESTOCK</span>
        </div>
        <button onClick={() => navigate('/login')} style={styles.navBtn}>
          Iniciar Sesión
        </button>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>Sistema de Gestión de Inventarios</div>
          <h1 style={styles.heroTitle}>
            Controla tu inventario de forma <span style={styles.heroHighlight}>inteligente</span>
          </h1>
          <p style={styles.heroDesc}>
            GESTOCK te permite gestionar productos, categorías y movimientos de inventario
            en tiempo real, con reportes SQL avanzados y control de acceso por roles.
          </p>
          <div style={styles.heroBtns}>
            <button onClick={() => navigate('/register')} style={styles.btnPrimary}>
              Crear cuenta gratis
            </button>
            <button onClick={() => navigate('/login')} style={styles.btnSecondary}>
              Iniciar Sesión
            </button>
          </div>
        </div>
        <div style={styles.heroImage}>
          <img src={logo} alt="Gestock" style={styles.heroLogo} />
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>¿Qué puedes hacer con GESTOCK?</h2>
        <div style={styles.featuresGrid}>
          {[
            { icon: '🔐', title: 'Login Seguro', desc: 'Autenticación con JWT y control de acceso por roles de usuario.' },
            { icon: '📦', title: 'Gestión de Productos', desc: 'Crea, edita y elimina productos con categorías y control de stock.' },
            { icon: '📊', title: 'Reportes SQL', desc: 'Visualiza reportes de stock y movimientos mediante consultas SQL avanzadas.' },
            { icon: '👑', title: 'Panel Admin', desc: 'Dashboard exclusivo para administradores con estadísticas en tiempo real.' },
            { icon: '👤', title: 'Panel Usuario', desc: 'Interfaz simplificada para consulta de inventario disponible.' },
            { icon: '📧', title: 'Recuperación de Clave', desc: 'Sistema de recuperación de contraseña mediante correo electrónico.' },
          ].map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section style={styles.tech}>
        <h2 style={styles.sectionTitleWhite}>Tecnologías utilizadas</h2>
        <div style={styles.techGrid}>
          {[
            { name: 'Python', icon: '🐍' },
            { name: 'Django', icon: '🎸' },
            { name: 'React', icon: '⚛️' },
            { name: 'JWT', icon: '🔑' },
            { name: 'REST API', icon: '🌐' },
            { name: 'SQLite', icon: '🗄️' },
          ].map((t, i) => (
            <div key={i} style={styles.techCard}>
              <span style={styles.techIcon}>{t.icon}</span>
              <span style={styles.techName}>{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>¿Listo para gestionar tu inventario?</h2>
        <p style={styles.ctaDesc}>Únete a GESTOCK y toma el control de tu stock hoy mismo.</p>
        <button onClick={() => navigate('/register')} style={styles.btnPrimary}>
          Comenzar ahora
        </button>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2026 GESTOCK — Sistema de Gestión de Inventarios · Desarrollado por Equipo de dearrollo SENA</p>
      </footer>
    </div>
  );
}
    
const styles = {
  container: { fontFamily: "'Segoe UI', sans-serif", color: '#1f2937' },

  // NAV
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 },
  navBrand: { display: 'flex', alignItems: 'center', gap: '10px' },
  navLogo: { width: '36px', height: '36px', objectFit: 'contain' },
  navTitle: { fontWeight: '800', fontSize: '20px', color: '#1a3a6b', letterSpacing: '2px' },
  navBtn: { background: 'linear-gradient(135deg, #1a3a6b, #2563eb)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },

  // HERO
  hero: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '80px 48px', background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)', minHeight: '85vh' },
  heroContent: { maxWidth: '560px' },
  heroBadge: { display: 'inline-block', background: '#dbeafe', color: '#1d4ed8', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', marginBottom: '20px' },
  heroTitle: { fontSize: '48px', fontWeight: '800', color: '#1a3a6b', lineHeight: '1.2', marginBottom: '20px' },
  heroHighlight: { color: '#2563eb' },
  heroDesc: { fontSize: '18px', color: '#4b5563', lineHeight: '1.7', marginBottom: '36px' },
  heroBtns: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  heroImage: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
  heroLogo: { width: '280px', height: '280px', objectFit: 'contain', opacity: '0.9' },

  // BUTTONS
  btnPrimary: { background: 'linear-gradient(135deg, #1a3a6b, #2563eb)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '16px' },
  btnSecondary: { background: '#fff', color: '#2563eb', border: '2px solid #2563eb', padding: '14px 32px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '16px' },

  // FEATURES
  features: { padding: '80px 48px', background: '#fff' },
  sectionTitle: { textAlign: 'center', fontSize: '32px', fontWeight: '800', color: '#1a3a6b', marginBottom: '48px' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1100px', margin: '0 auto' },
  featureCard: { background: '#f8fafc', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #e5e7eb' },
  featureIcon: { fontSize: '40px', display: 'block', marginBottom: '16px' },
  featureTitle: { fontSize: '18px', fontWeight: '700', color: '#1a3a6b', marginBottom: '10px' },
  featureDesc: { fontSize: '14px', color: '#6b7280', lineHeight: '1.6' },

  // TECH
  tech: { padding: '80px 48px', background: 'linear-gradient(135deg, #1a3a6b 0%, #2563eb 100%)' },
  sectionTitleWhite: { textAlign: 'center', fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '48px' },
  techGrid: { display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto' },
  techCard: { background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '24px 32px', textAlign: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' },
  techIcon: { fontSize: '32px', display: 'block', marginBottom: '8px' },
  techName: { color: '#fff', fontWeight: '600', fontSize: '14px' },

  // CTA
  cta: { padding: '80px 48px', background: '#f0f4ff', textAlign: 'center' },
  ctaTitle: { fontSize: '36px', fontWeight: '800', color: '#1a3a6b', marginBottom: '16px' },
  ctaDesc: { fontSize: '18px', color: '#4b5563', marginBottom: '32px' },

  // FOOTER
  footer: { background: '#1a3a6b', padding: '24px 48px', textAlign: 'center' },
  footerText: { color: 'rgba(255,255,255,0.7)', fontSize: '14px' },
};