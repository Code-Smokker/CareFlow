import logging

from celery import Celery
from celery.signals import worker_process_init

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
    timezone="UTC",
    beat_schedule={
        # Voice notes are kept only with consent and only briefly (24 h, or until the visit is signed).
        "purge-expired-audio": {"task": "docai.purge_expired_audio", "schedule": 15 * 60.0},
    },
)


@worker_process_init.connect
def _warm_models(**_: object) -> None:
    """Best effort: a failure here just means the first document pays the load cost, as before."""
    try:
        from app.extract.gliner_ner import warm

        warm()
    except Exception as exc:  # noqa: BLE001 - never stop a worker from starting over a model
        logging.getLogger(__name__).warning("model warm-up skipped: %s", exc)
