from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

# Register your models here.
from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser, UserProfile, CustomGroup, GroupProfile

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = "User Profile"

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ["email", "username", "password", ]
    inlines = [UserProfileInline] 

class GroupProfileAdmin(admin.ModelAdmin):
    model = GroupProfile
    list_display = ('group', 'group_description')
    search_fields = ('group__name',)
    ordering = ('group',)

class CustomGroupAdmin(admin.ModelAdmin):
    model = CustomGroup
    list_display = ('group',)
    search_fields = ('group__name',)
    ordering = ('group',)

admin.site.register(UserProfile)  
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(GroupProfile, GroupProfileAdmin)
admin.site.register(CustomGroup, CustomGroupAdmin)