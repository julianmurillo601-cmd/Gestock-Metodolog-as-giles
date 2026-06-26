from django.urls import path
from .views import VistaProductosStockView, ResumenMovimientosView

urlpatterns = [
    path('stock/', VistaProductosStockView.as_view(), name='vista_stock'),
    path('movimientos/', ResumenMovimientosView.as_view(), name='resumen_movimientos'),
]