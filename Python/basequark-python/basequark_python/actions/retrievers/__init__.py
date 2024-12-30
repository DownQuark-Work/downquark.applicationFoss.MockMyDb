"""
Connects to local and/or external data sources.
Also responsible for retrieving and parsing the specified data **only**.
And **only** when requested.

For both:
    - pre-determined static, non-asynchronous, non-dynamic, files such as json / toml / yml
as well as
    - asynchronous and or otherwise dynamic data
The methods in this directory should apply zero logic or functionality to the data it has obtained.

"""

# """
# Primarily `stdout` and or `tkinter` (etc)
# This will also receive all fully parsed content from `./_ui/display`
#     - this level contains the _only_ set of classes that will return visual results to the user
# """
