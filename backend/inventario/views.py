from rest_framework import viewsets, permissions
from .models import Categoria, Producto, Movimiento
from .serializers import CategoriaSerializer, ProductoSerializer, MovimientoSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [permissions.IsAuthenticated]


class MovimientoViewSet(viewsets.ModelViewSet):
    queryset = Movimiento.objects.all().order_by('-fecha')
    serializer_class = MovimientoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        movimiento = serializer.save(usuario=self.request.user)
        producto = movimiento.producto
        if movimiento.tipo == 'entrada':
            producto.stock += movimiento.cantidad
        else:
            producto.stock -= movimiento.cantidad
        producto.save()