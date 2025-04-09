from flask.cli import FlaskGroup
from flask import Flask

from src import app

cli = FlaskGroup(app)

if __name__ == '__main__':
    cli()