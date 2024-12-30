"""
High Level description of the application.
Description of what the `run` command instantantiates
"""

from .actions.triggers import arguments


class BaseQuark:
    @staticmethod
    def run():
        print("Run DownQuark Python Template with Arguments ", arguments)
