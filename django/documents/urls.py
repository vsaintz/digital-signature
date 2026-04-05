from django.urls import path

from .views import (
    DocumentDataView,
    DocumentDetailView,
    DocumentDownloadView,
    DocumentListCreateView,
)

urlpatterns = [
    path("", DocumentListCreateView.as_view(), name="document-list-create"),
    path("<uuid:pk>/", DocumentDetailView.as_view(), name="document-detail"),
    path("<uuid:pk>/data/", DocumentDataView.as_view(), name="document-data"),
    path(
        "<uuid:pk>/download/", DocumentDownloadView.as_view(), name="document-download"
    ),
]
