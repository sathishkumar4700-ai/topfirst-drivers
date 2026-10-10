from __future__ import annotations

import argparse
import logging

from app.db.session import init_db, get_engine
from app.services.pipeline import DailyPipeline
from app.services.scheduler import start_scheduler
from sqlalchemy.orm import sessionmaker

logging.basicConfig(level=logging.INFO)


def main() -> None:
    parser = argparse.ArgumentParser(description="Tamil Nadu News Automation CLI")
    sub = parser.add_subparsers(dest="command")

    sub.add_parser("init-db", help="Create database tables")
    run_p = sub.add_parser("run", help="Run daily pipeline once")
    run_p.add_argument("--stage", default="full", choices=["full", "collect"])
    sub.add_parser("serve", help="Start API server with scheduler")
    sub.add_parser("youtube-auth", help="Authorize YouTube OAuth (requires client secrets)")
    sub.add_parser("youtube-whoami", help="Show OAuth email and YouTube channel (verifies expected account)")

    args = parser.parse_args()
    if args.command == "init-db":
        init_db()
        print("Database initialized.")
    elif args.command == "run":
        init_db()
        Session = sessionmaker(bind=get_engine())
        db = Session()
        try:
            run = DailyPipeline(db).run(stage=args.stage)
            print(f"Run {run.id} completed with status {run.status.value}")
        finally:
            db.close()
    elif args.command == "serve":
        import uvicorn

        uvicorn.run("app.main:app", host="0.0.0.0", port=8080, reload=False)
    elif args.command == "youtube-auth":
        from app.services.youtube import YouTubeUploadService

        svc = YouTubeUploadService()
        try:
            identity = svc.connected_channel()
            print("YouTube authorization successful.")
            print(f"  Email:   {identity['email']}")
            print(f"  Channel: {identity['channel_title']}")
            print(f"  URL:     {identity['channel_url']}")
        except Exception as exc:
            print(f"Authorization issue: {exc}")
    elif args.command == "youtube-whoami":
        from app.services.youtube import YouTubeUploadService

        svc = YouTubeUploadService()
        identity = svc.connected_channel()
        print(f"Email:        {identity['email']}")
        print(f"Channel ID:   {identity['channel_id']}")
        print(f"Channel name: {identity['channel_title']}")
        print(f"Channel URL:  {identity['channel_url']}")
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
