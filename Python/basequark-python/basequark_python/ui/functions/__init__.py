"""
This will be for any functionality:
1. not contained within the `hexagonal pattern` business logic
2. obtained from the `hexagonal pattern` business logic that needs to be mutated for a specific `layout` implementation.
    - No updates should be made to the data once it is received by a `layout` class.
    - it will _only_ hold and referenve data that is defined in this file's `data` sibling directory.
"""
