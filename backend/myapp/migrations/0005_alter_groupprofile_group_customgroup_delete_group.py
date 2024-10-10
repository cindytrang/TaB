# Generated by Django 5.1.1 on 2024-10-10 16:08

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('myapp', '0004_group_groupprofile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='groupprofile',
            name='group',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to='auth.group'),
        ),
        migrations.CreateModel(
            name='CustomGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('group', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='auth.group')),
                ('members', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.DeleteModel(
            name='Group',
        ),
    ]
