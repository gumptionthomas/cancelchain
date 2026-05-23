from cancelchain.config import EnvAppSettings


def test_environ_settings():
    s = EnvAppSettings.from_env()
    assert s.READER_ADDRESSES == [
        'CCB9JajrPayCVUqRU7RrDAVfZ1QPj135moCyrKkNwMwEtRCC',
        'CC3QfbBDAEktCNPzcTg8DPz4a1qY5zMKvenQjr5nFoaKXaCC',
    ]


def test_flask_config(config_app):
    assert config_app.config.get('SECRET_KEY') == 'testkey'
