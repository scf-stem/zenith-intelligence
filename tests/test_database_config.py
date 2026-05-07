import importlib
import os
import sys
import tempfile
import unittest
from pathlib import Path

from flask import Flask

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

import app.config as config_module  # noqa: E402
from app import _create_all_with_lock, _sqlite_database_path  # noqa: E402
from app.extensions import db  # noqa: E402
from app.models import Feedback, SiteEvent, SiteVisit  # noqa: F401, E402


class DatabaseConfigTestCase(unittest.TestCase):
    def _reload_config_with_env(self, **updates):
        keys = {
            "DATABASE_URL",
            "ZENITH_DATA_DIR",
            "DATA_DIR",
            "FLASK_ENV",
            "NODE_ENV",
        }
        saved = {key: os.environ.get(key) for key in keys}
        try:
            for key in keys:
                os.environ.pop(key, None)
            os.environ.update(updates)
            return importlib.reload(config_module)
        finally:
            for key, value in saved.items():
                if value is None:
                    os.environ.pop(key, None)
                else:
                    os.environ[key] = value

    def tearDown(self):
        importlib.reload(config_module)

    def test_production_defaults_to_zeabur_data_mount(self):
        module = self._reload_config_with_env(FLASK_ENV="production")

        self.assertEqual(module.Config.SQLALCHEMY_DATABASE_URI, "sqlite:////data/app.db")

    def test_zenith_data_dir_overrides_default_sqlite_path(self):
        module = self._reload_config_with_env(
            FLASK_ENV="production",
            ZENITH_DATA_DIR="/mnt/zenith",
        )

        self.assertEqual(module.Config.SQLALCHEMY_DATABASE_URI, "sqlite:////mnt/zenith/app.db")

    def test_database_url_still_overrides_sqlite_default(self):
        module = self._reload_config_with_env(
            FLASK_ENV="production",
            DATABASE_URL="postgresql://user:pass@example.com/zenith",
        )

        self.assertEqual(
            module.Config.SQLALCHEMY_DATABASE_URI,
            "postgresql://user:pass@example.com/zenith",
        )

    def test_create_app_creates_sqlite_file_parent_directory(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            db_path = Path(tmp_dir) / "nested" / "app.db"
            app = Flask(__name__)
            app.config.update(
                SQLALCHEMY_DATABASE_URI=f"sqlite:///{db_path}",
                SQLALCHEMY_TRACK_MODIFICATIONS=False,
            )
            db.init_app(app)

            _create_all_with_lock(app)

            self.assertTrue(db_path.exists())
            self.assertTrue((db_path.parent / ".schema.lock").exists())

    def test_sqlite_memory_database_does_not_use_file_path(self):
        self.assertIsNone(_sqlite_database_path("sqlite:///:memory:"))


if __name__ == "__main__":
    unittest.main()
