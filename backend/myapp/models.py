from django.db import models
# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save 
from django.dispatch import receiver
from django.contrib.auth.models import Group as DjangoGroup, Permission

class CustomUser(AbstractUser):        
    pass

    def __str__(self):
        return self.email
    
class UserProfile(models.Model): 
    user = models.OneToOneField("CustomUser",on_delete=models.CASCADE, related_name="profile")
    age = models.PositiveIntegerField(null=True, blank=True)
    groups = models.ManyToManyField(DjangoGroup, related_name='user_profiles', blank=True)

    def __str__(self):
        fields = [f'{field.name}: {getattr(self, field.name)}' for field in self._meta.fields]
        return ', '.join(fields)

@receiver(post_save, sender=CustomUser)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    else:
        instance.profile.save()

@receiver(post_save, sender=CustomUser)
def add_group_permission(sender, instance, created, **kwargs):
    if created:
        permission = Permission.objects.get(codename='add_group')
        instance.user_permissions.add(permission)

@receiver(post_save, sender=DjangoGroup)
def create_group_profile(sender, instance, created, **kwargs):
    if created:
        GroupProfile.objects.create(group=instance)
class GroupProfile(models.Model):
    group = models.OneToOneField(DjangoGroup, on_delete=models.CASCADE, related_name="profile")
    group_description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f'{self.group.name}: {self.group_description}'
    
class CustomGroup(models.Model):
    group = models.OneToOneField(DjangoGroup, on_delete=models.CASCADE)
    members = models.ManyToManyField(CustomUser)

    def __str__(self):
        members_str = ', '.join([str(member) for member in self.members.all()])
        return f'{self.name} ({members_str})'    