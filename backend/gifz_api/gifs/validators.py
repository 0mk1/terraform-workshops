from django.core.validators import FileExtensionValidator


validate_gif_file_extension = FileExtensionValidator(
    allowed_extensions=['gif'],
)
