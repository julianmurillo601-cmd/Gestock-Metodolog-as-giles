from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, ProductoViewSet, MovimientoViewSet

router = DefaultRouter()
router.register('categorias', CategoriaViewSet)
router.register('productos', ProductoViewSet)
router.register('movimientos', MovimientoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]