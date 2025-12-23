from rest_framework import serializers
from django.utils import timezone
from django.core.validators import MinLengthValidator
from .models import TaskList


class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer for Task model with enhanced validation and metadata.
    """
    # Read-only fields
    gestionnaire = serializers.CharField(
        source='gestionnaire.username',
        read_only=True,
        help_text="Username of the task owner"
    )

    gestionnaire_id = serializers.IntegerField(
        source='gestionnaire.id',
        read_only=True,
        help_text="ID of the task owner"
    )

    created_at = serializers.DateTimeField(
        format="%d %b %Y %H:%M",
        read_only=True,
        help_text="Task creation date and time"
    )

    updated_at = serializers.DateTimeField(
        format="%d %b %Y %H:%M",
        read_only=True,
        help_text="Last update date and time"
    )

    # Computed fields
    is_recent = serializers.SerializerMethodField(
        help_text="True if task was created within last 24 hours"
    )

    task_length = serializers.SerializerMethodField(
        help_text="Length of the task description"
    )

    status = serializers.SerializerMethodField(
        help_text="Human-readable status of the task"
    )

    class Meta:
        model = TaskList
        fields = [
            'id',
            'task',
            'done',
            'gestionnaire',
            'gestionnaire_id',
            'created_at',
            'updated_at',
            'is_recent',
            'task_length',
            'status',
        ]
        read_only_fields = [
            'gestionnaire',
            'gestionnaire_id',
            'created_at',
            'updated_at',
            'is_recent',
            'task_length',
            'status',
        ]

    def get_is_recent(self, obj):
        """Check if task was created in the last 24 hours"""
        return (timezone.now() - obj.created_at).total_seconds() < 86400  # 24 hours in seconds

    def get_task_length(self, obj):
        """Get length of task description"""
        return len(obj.task)

    def get_status(self, obj):
        """Get human-readable status"""
        return "Completed" if obj.done else "Pending"

    def validate_task(self, value):
        """Validate task field"""
        value = value.strip()

        if len(value) < 3:
            raise serializers.ValidationError(
                "Task must be at least 3 characters long"
            )

        if len(value) > 200:
            raise serializers.ValidationError(
                "Task cannot exceed 200 characters"
            )

        return value

    def validate(self, data):
        """Object-level validation"""
        # Prevent marking empty tasks as done
        if data.get('done') and len(data.get('task', '').strip()) < 3:
            raise serializers.ValidationError({
                'task': 'Task must be at least 3 characters to mark as done'
            })

        return data

    def create(self, validated_data):
        """Create a new task"""
        # The user is set in the view's perform_create method
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Update an existing task"""
        # Log update if needed
        return super().update(instance, validated_data)


class ContactSerializer(serializers.Serializer):
    """
    Serializer for contact form submissions.
    """
    name = serializers.CharField(
        max_length=100,
        min_length=2,
        trim_whitespace=True,
        help_text="Full name of the contact person (2-100 characters)"
    )

    email = serializers.EmailField(
        help_text="Email address for reply"
    )

    subject = serializers.CharField(
        max_length=200,
        min_length=5,
        trim_whitespace=True,
        help_text="Subject of the message (5-200 characters)"
    )

    message = serializers.CharField(
        min_length=10,
        max_length=2000,
        trim_whitespace=True,
        help_text="Content of the message (10-2000 characters)"
    )

    def validate_name(self, value):
        """Validate name field"""
        if not value.replace(' ', '').isalpha():
            raise serializers.ValidationError(
                "Name should contain only letters and spaces"
            )
        return value.title()  # Capitalize each word

    def validate_subject(self, value):
        """Validate subject field"""
        value = value.strip()
        if len(value) < 5:
            raise serializers.ValidationError(
                "Subject must be at least 5 characters long"
            )
        return value

    def validate_message(self, value):
        """Validate message field"""
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError(
                "Message must be at least 10 characters long"
            )
        return value