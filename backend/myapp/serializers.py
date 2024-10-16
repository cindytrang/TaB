from rest_framework import serializers
from .models import CustomUser, UserProfile, CustomGroup, GroupProfile, Calendar, CalendarEvent


class UserSerializer(serializers.ModelSerializer):
    username_or_email = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password', 'username_or_email')
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'read_only': True},
            'email': {'read_only': True}
        }

    def validate(self, data):
        username_or_email = data.get('username_or_email')
        password = data.get('password')

        if not username_or_email:
            raise serializers.ValidationError("Username or email is required.")

        if '@' in username_or_email:
            user = CustomUser.objects.filter(email=username_or_email).first()
        else:
            user = CustomUser.objects.filter(username=username_or_email).first()

        if not user:
            raise serializers.ValidationError("No user found with the provided username or email.")

        if not user.check_password(password):
            raise serializers.ValidationError("Incorrect password.")

        data['user'] = user
        return data

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password')

    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        return value

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
    user_profile = UserProfile()

    class Meta:
        model = UserProfile
        fields = ('id', 'user_profile', 'age', 'groups')

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = UserProfile
        fields = ('user', 'age')

class GroupSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True)

    class Meta:
        model = CustomGroup
        fields = ('id', 'name', 'members')

class GroupProfileSerializer(serializers.ModelSerializer):
    group = GroupSerializer()

    class Meta:
        model = GroupProfile
        fields = ('group', 'group_description')

class CustomGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomGroup
        fields = ['id', 'group', 'members']

class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = ['id', 'group']

class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = ['id', 'group', 'event_title', 'event_description', 'event_start_date', 
                  'event_end_date', 'event_location', 'event_priority', 'event_status', 
                  'event_created_by']
        read_only_fields = ['group', 'event_created_by']