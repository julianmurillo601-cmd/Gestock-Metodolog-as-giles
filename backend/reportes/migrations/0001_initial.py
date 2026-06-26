from django.db import migrations

class Migration(migrations.Migration):

    initial = True
    dependencies = []

    operations = [
        migrations.RunSQL(
            sql="""
                CREATE VIEW vista_productos_stock AS
                SELECT
                    p.nombre,
                    COALESCE(c.nombre, 'Sin categoría') AS categoria,
                    p.precio,
                    p.stock,
                    p.stock_minimo,
                    CASE
                        WHEN p.stock = 0 THEN 'Agotado'
                        WHEN p.stock <= p.stock_minimo THEN 'Stock bajo'
                        ELSE 'Disponible'
                    END AS estado
                FROM inventario_producto p
                LEFT JOIN inventario_categoria c ON p.categoria_id = c.id;
            """,
            reverse_sql="DROP VIEW IF EXISTS vista_productos_stock;"
        ),
        migrations.RunSQL(
            sql="""
                CREATE TABLE IF NOT EXISTS reportes_vistaproductosstock AS
                SELECT * FROM vista_productos_stock WHERE 1=0;
            """,
            reverse_sql="DROP TABLE IF EXISTS reportes_vistaproductosstock;"
        ),
    ]