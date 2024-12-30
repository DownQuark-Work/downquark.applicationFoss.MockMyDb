"""
Description of any required pre-requisites and how to obtain it/them if applicable.
Initializes application functionality
"""

from .basequark import BaseQuark


def required_before_run():
    print("all required data has been retrieved, parsed, and handled")
    pass


if __name__ == "__main__":
    required_before_run()
    BaseQuark.run()
