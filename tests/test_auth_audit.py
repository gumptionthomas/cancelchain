"""Demonstration tests for the API authentication threat-modeled audit.

Each test in this module corresponds to one finding in
docs/superpowers/audits/2026-05-31-api-authentication-audit.md
and is marked @pytest.mark.xfail(strict=True). The xfail demonstrates that
the documented gap exists today; strict=True means that if the test starts
unexpectedly passing (because remediation has been applied), CI fails,
forcing the remediation PR to remove the marker.

To verify each xfail genuinely demonstrates a gap (rather than failing for
an unrelated reason), run:

    uv run pytest --runxfail tests/test_auth_audit.py

That runs the xfail tests as if they were unmarked, surfacing the actual
failure mode.

Finding IDs are referenced in each test's docstring and xfail reason string
in the form A<N>.<letter> matching the audit document's per-adversary
sections.
"""
