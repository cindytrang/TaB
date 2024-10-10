from rest_framework import serializers
from .models import CustomUser, UserProfile, CustomGroup, GroupProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}  # NOTE Make password write-only  and dont store it as JSON

    def create(self, validated_data):   
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])  # NOTE Hash the password
        user.save()
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