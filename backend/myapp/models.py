from django.db import models
# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save 
from django.dispatch import receiver

class CustomUser(AbstractUser):
    pass

    def __str__(self):
        return self.email
    
class UserProfile(models.Model): 
    user = models.OneToOneField("CustomUser",on_delete=models.CASCADE, related_name="profile")
    age = models.PositiveIntegerField(null=True, blank=True)
    
    def __str__(self):
        fields = [f'{field.name}: {getattr(self, field.name)}' for field in self._meta.fields]
        return ', '.join(fields)

@receiver(post_save, sender=CustomUser)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    else:
        instance.profile.save()
