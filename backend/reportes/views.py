from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db import connection

class VistaProductosStockView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
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
                LEFT JOIN inventario_categoria c ON p.categoria_id = c.id
            """)
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()
        data = [dict(zip(columns, row)) for row in rows]
        return Response(data)


class ResumenMovimientosView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    p.nombre AS producto,
                    SUM(CASE WHEN m.tipo = 'entrada' THEN m.cantidad ELSE 0 END) AS total_entradas,
                    SUM(CASE WHEN m.tipo = 'salida' THEN m.cantidad ELSE 0 END) AS total_salidas,
                    COUNT(m.id) AS total_movimientos
                FROM inventario_movimiento m
                JOIN inventario_producto p ON m.producto_id = p.id
                GROUP BY p.nombre
                ORDER BY total_movimientos DESC
            """)
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()
        data = [dict(zip(columns, row)) for row in rows]
        return Response(data)