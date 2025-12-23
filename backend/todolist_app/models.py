from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator, MaxLengthValidator
from django.utils import timezone


class TaskList(models.Model):
    """
    Task model representing user tasks.
    Each task belongs to a user (gestionnaire) and has status tracking.
    """
    id = models.AutoField(primary_key=True, verbose_name="ID")

    gestionnaire = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="tasks",
        verbose_name="Owner",
        help_text="User who owns this task"
    )

    task = models.CharField(
        max_length=200,
        verbose_name="Task Description",
        validators=[
            MinLengthValidator(3, "Task must be at least 3 characters long"),
            MaxLengthValidator(200, "Task cannot exceed 200 characters")
        ],
        help_text="Description of the task (3-200 characters)"
    )

    done = models.BooleanField(
        default=False,
        verbose_name="Completed",
        help_text="Whether the task is completed"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At",
        help_text="Date and time when task was created"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Updated At",
        help_text="Date and time when task was last updated"
    )

    # Optional: Add due date field for future enhancement
    # due_date = models.DateTimeField(null=True, blank=True, verbose_name="Due Date")

    class Meta:
        ordering = ['-created_at']  # Show newest tasks first
        verbose_name = "Task"
        verbose_name_plural = "Tasks"
        indexes = [
            models.Index(fields=['gestionnaire', 'done']),
            models.Index(fields=['created_at']),
            models.Index(fields=['done']),
        ]
        permissions = [
            ("can_view_all_tasks", "Can view all tasks (admin permission)"),
        ]

    def __str__(self):
        """String representation of the task"""
        status = "✅ Done" if self.done else "⏳ Pending"
        return f"{self.task[:30]}... - {status}"

    def clean(self):
        """Custom validation logic"""
        super().clean()

        # Strip whitespace from task
        if self.task:
            self.task = self.task.strip()

        # Validate task length
        if len(self.task) < 3:
            from django.core.exceptions import ValidationError
            raise ValidationError({
                'task': 'Task must be at least 3 characters long'
            })

    def save(self, *args, **kwargs):
        """Override save to ensure validation runs"""
        self.full_clean()  # Run validation
        super().save(*args, **kwargs)

    @property
    def is_overdue(self):
        """Check if task is overdue (for future due_date implementation)"""
        # This is a placeholder for future enhancement
        return False

    @property
    def time_since_creation(self):
        """Get time since task was created"""
        return timezone.now() - self.created_at