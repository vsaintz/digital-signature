import uuid

from django.conf import settings
from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _


def document_upload_path(instance, filename):
    return f"documents/{instance.owner_id}/{instance.id}/{filename}"


class Document(models.Model):
    class FileType(models.TextChoices):
        CSV = "csv", _("CSV")
        XLSX = "xlsx", _("Excel (.xlsx)")

    class ProcessingStatus(models.TextChoices):
        PENDING = "pending", _("Pending")
        PROCESSING = "processing", _("Processing")
        READY = "ready", _("Ready")
        FAILED = "failed", _("Failed")

    class SigningStatus(models.TextChoices):
        UNSIGNED = "unsigned", _("Unsigned")
        SIGNED = "signed", _("Signed")
        CHANGES_REQUESTED = "changes_requested", _("Changes Requested")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="documents",
    )

    file = models.FileField(upload_to=document_upload_path)
    original_filename = models.CharField(max_length=255)
    file_size = models.PositiveBigIntegerField(help_text="Size in bytes.")
    file_type = models.CharField(max_length=10, choices=FileType.choices)
    file_hash = models.CharField(max_length=64, blank=True)

    processing_status = models.CharField(
        max_length=12,
        choices=ProcessingStatus.choices,
        default=ProcessingStatus.PENDING,
        db_index=True,
    )
    processing_error = models.TextField(blank=True)
    signing_status = models.CharField(
        max_length=20,
        choices=SigningStatus.choices,
        default=SigningStatus.UNSIGNED,
        db_index=True,
    )

    row_count = models.PositiveIntegerField(null=True, blank=True)
    column_count = models.PositiveIntegerField(null=True, blank=True)
    column_names = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "document"
        verbose_name_plural = "documents"

    def __str__(self):
        return f"{self.name} ({self.id})"

    @property
    def file_size_display(self) -> str:
        size = self.file_size
        for unit in ("Bytes", "KB", "MB", "GB"):
            if size < 1024:
                if unit == "Bytes":
                    return f"{int(size)} {unit}"
                return f"{size:.1f} {unit}"
            size /= 1024
        return f"{size:.1f} TB"

    def get_normalized_data(self) -> "DocumentData | None":
        try:
            return self.data  # type: ignore[attr-defined]
        except DocumentData.DoesNotExist:
            return None


class DocumentData(models.Model):
    document = models.OneToOneField(
        Document,
        on_delete=models.CASCADE,
        related_name="data",
        primary_key=True,
    )
    normalized_data = models.JSONField()
    content_hash = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "document data"
        verbose_name_plural = "document data"

    def __str__(self):
        return f"Data for document {self.pk}"


@receiver(post_delete, sender=Document)
def delete_document_file(sender, instance, **kwargs):
    if instance.file:
        instance.file.delete(save=False)
