from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    foto_perfil = models.ImageField(
        upload_to='perfiles/', 
        null=True, 
        blank=True
    )
    es_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.username