from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group as DjangoGroup, Permission
from .models import UserProfile, GroupProfile, CustomGroup, Calendar, CalendarEvent

class ModelTestCase(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.user = self.User.objects.create_user(username='testuser', email='test@example.com', password='testpass123')
        self.group = DjangoGroup.objects.create(name='Test Group')
        self.custom_group = CustomGroup.objects.create(group=self.group, name="Test Group")
        self.event = CalendarEvent.objects.create(
            group=self.custom_group,
            event_title='Test Event',
            event_description='Test Description',
            event_start_date='2023-01-01T00:00:00Z',
            event_end_date='2023-01-02T00:00:00Z',
            event_location='Test Location',
            event_priority=1,
            event_status='Active',
            event_created_by=self.user
        )

    def test_custom_user_creation(self):
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertTrue(self.user.has_perm('auth.add_group'))

    def test_user_profile_creation(self):
        self.assertTrue(UserProfile.objects.filter(user=self.user).exists())

    def test_group_profile_creation(self):
        self.assertTrue(GroupProfile.objects.filter(group=self.group).exists())

    def test_custom_group_creation(self):
        self.assertEqual(self.custom_group.group, self.group)

    def test_calendar_creation(self):
        self.assertTrue(Calendar.objects.filter(group=self.custom_group).exists())

    def test_calendar_event_creation(self):
        self.assertEqual(self.event.event_title, 'Test Event')
        self.assertEqual(self.event.event_created_by, self.user)

    def test_group_profile_str_method(self):
        group_profile = self.group.profile
        group_profile.group_description = "Test Description"
        group_profile.save()
        expected_str = "Test Group: Test Description"
        self.assertEqual(str(group_profile), expected_str)

    def test_custom_group_str_method(self):
        self.custom_group.members.add(self.user)
        expected_str = f'{self.group.name} ({self.user.email})'
        self.assertEqual(str(self.custom_group), expected_str)

    def test_calendar_str_method(self):
        calendar = Calendar.objects.get(group=self.custom_group)
        expected_str = f'Calendar for {self.group.name}'
        self.assertEqual(str(calendar), expected_str)

    def test_calendar_event_str_method(self): 
        expected_str = f'Test Event ({self.group.name})'
        self.assertEqual(str(self.event), expected_str)

    def test_user_profile_groups(self):
        self.user.profile.groups.add(self.group)
        self.assertIn(self.group, self.user.profile.groups.all())

    def test_custom_group_members(self):
        self.custom_group.members.add(self.user)
        self.assertIn(self.user, self.custom_group.members.all())