from celery import Celery

from app.config import settings

celery_app = Celery("docai", broker=settings.redis_url, backend=settings.redis_url, include=["app.tasks"])
celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    # A job that's still queued/processing when polled needs a real terminal result once it
    # finishes, not GET /jobs/:id racing an expired result — a generous ceiling, not a load-bearing
    # cache TTL (docs/06-document-ai.md's pipeline runs in seconds, not this long in practice).
    result_expires=3600,
)
