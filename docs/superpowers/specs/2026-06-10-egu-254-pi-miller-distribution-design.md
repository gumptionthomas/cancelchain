# EGU #254 — Pi miller distribution: HOWTO + managed appliance kit

**Date:** 2026-06-10
**Issue:** #254 (EGU fleet: 2× Pi 3 + 4× Pi 4; first external member is a
friend's Pi 3 hosting the first "extended" EGU game)
**Status:** design approved (brainstormed 2026-06-10)

## Goal

Make a milling Raspberry Pi reproducible for two audiences with **one
maintained runtime kit**:

1. **Roll-your-own** — a public HOWTO: stock Raspberry Pi OS Lite → milling
   node, including how to update the gumptionchain package.
2. **Managed appliance** — the operator's bench process that produces
   "plug it in and forget it" Pis for EGU members. The member supplies
   power + ethernet; everything else (updates included) is autonomous.

### Decisions locked during brainstorming

- **Distribution = git clone + release tag + `uv sync`.** No PyPI, no
  wheel pipeline today. The auto-update path is designed so an easier
  channel (PyPI, hub-served update channel) can replace the tag-follower
  later without re-imaging devices — the updater updates itself.
- **Appliances are pull-only with NO remote access.** No Tailscale, no
  standing SSH path, no inbound anything. A wedged device is recovered by
  re-flashing an SD card at the bench (or mailing one). This makes the
  update health-gate + rollback the load-bearing safety mechanism.
- **The operator generates each appliance wallet at the bench**, bakes it
  into the device, keeps an **encrypted backup** (re-flash preserves the
  address and its rewards), registers the address in the hub's
  `MILLER_ADDRESSES`, and **delivers a copy of the key to the member** —
  their game backend signs faucet transactions with the same wallet.
  (Role hierarchy: MILLER ⊇ TRANSACTOR, so one allowlist entry covers
  both milling and the game's transacting.)
- **Deliverables = docs + shared runtime artifacts**, validated on gcm-01
  before any member Pi ships.

## Non-goals

- PyPI publishing, GitHub release wheels (future "easier updates" path).
- Hub-managed update channels / fleet telemetry (future; see Updates).
- Docker / golden-image build pipeline (premature for ~7 devices).
- Remote management of shipped appliances (explicitly rejected).
- Wi-Fi onboarding UX. Appliances are **ethernet-first**; Wi-Fi creds can
  be baked at the bench when a member's placement requires it.

## Why outbound-only works (verified in code)

`gumptionchain mill --peer <hub> <address>` runs forever by default
(`--blocks 0`, `command.py mill_command`) and **polls the hub between PoW
rounds**: `Miller.mill_block` calls `poll_latest_blocks()` inside the
milling generator loop (`miller.py`), aborting the current block when a
longer chain appears, and mined blocks are pushed outbound via the
gossip path (`receive_block` → `send_block`, wallet-signed `gc-sig-v1`).
A miller spoke therefore needs **zero inbound ports and never runs the
Flask server**. Hub-and-spoke: every miller peers only with gumption-hub.

## Architecture: one kit, two wrappers

New `deploy/pi/` directory in this repo (public, secret-free):

```
deploy/pi/
  gumptionchain-miller.service     # the milling node
  gumptionchain-update.service     # oneshot: runs update.sh
  gumptionchain-update.timer       # daily + RandomizedDelaySec
  update.sh                        # tag-follower with health gate + rollback
  install.sh                       # idempotent installer (both tiers)
  provision-appliance.sh           # bench-side, ssh-driven (operator tier)
  custom.toml.example              # hand-written imager customization
```

### `gumptionchain-miller.service`

Runs `uv run gumptionchain mill --peer <hub-peer-url> <address>` as the
`gc` user with `WorkingDirectory=` the repo checkout (python-dotenv
autoloads `.env` from CWD). `Restart=always` + `RestartSec` handles
crashes (the mill loop already catches per-block exceptions itself).
`After=network-online.target`. Memory limits sized for the 1 GB Pi 3
(`MemoryMax` guard so a leak degrades to a restart, not a frozen box).
The peer URL and milling address come from an `EnvironmentFile`
(`deploy.env`, written at install time) so the unit file itself is
generic.

### `update.sh` — the tag-follower

Daily (timer with randomized delay to avoid a fleet stampede):

1. `git fetch --tags origin`; resolve the highest semver `v*` tag.
2. Exit 0 if it equals the current checkout or is listed in the
   **bad-tag skip file** (`~/.gumptionchain-skip-tags`).
3. `git checkout <tag>` && `uv sync --frozen`.
4. `uv run gumptionchain db upgrade` (schema migrations).
5. `systemctl restart gumptionchain-miller` + re-copy/`daemon-reload`
   the unit files if the repo's copies changed (the updater updates the
   units and itself — this is the hook that lets the update *mechanism*
   evolve later without re-imaging).
6. **Health gate:** `db upgrade` succeeded AND the service is still
   `active` after a 60 s settle. On failure: check out the previous tag,
   `uv sync --frozen`, restart, append the bad tag to the skip file, and
   exit non-zero (visible in the journal). Migrations are **not**
   downgraded — see Release discipline.

### `install.sh` — shared installer (HOWTO step *and* bench step)

Idempotent: installs `uv` if absent, clones (or updates) the repo into
`~gc/gumptionchain`, checks out the latest release tag, `uv sync
--frozen`, `gumptionchain init`, installs + enables the units, prints
the remaining manual steps (wallet, `.env`, hub allowlisting). The HOWTO
walks a person through running it; `provision-appliance.sh` runs it
non-interactively.

### `provision-appliance.sh` — the bench process

SSH-driven, matching how gcm-01 was actually built (more debuggable than
firstboot magic):

1. Operator flashes stock Raspberry Pi OS Lite and **hand-writes
   `custom.toml`** onto the boot partition (hostname `gcm-NN`, `gc` user,
   operator SSH key, optional member Wi-Fi). Hand-written because the
   rpi-imager snap silently drops GUI customization.
2. Pi boots on the bench LAN; the script provisions it over SSH:
   runs `install.sh`, copies the device wallet `.pem` + `.env` +
   `deploy.env`, enables `unattended-upgrades` (security pocket only),
   starts the services.
3. The operator SSH key stays on the device — it is unreachable once the
   appliance is behind the member's NAT (no inbound), but works again if
   the device ever returns to the bench. This is deliberate: bench
   access without standing remote access.

## Config model (per device)

- `.env`: `FLASK_SQLALCHEMY_DATABASE_URI` (**absolute** sqlite path —
  the relative-path-resolves-into-src gotcha is documented),
  `FLASK_SECRET_KEY`, `GC_NODE_HOST`, `GC_WALLET_DIR`,
  `GC_PEERS=["https://<device-address>@<hub-host>"]` (the username is
  the *local* wallet address this node signs as).
- `deploy.env`: `GC_MILL_ADDRESS`, `GC_MILL_PEER` for the unit file, and
  `GC_UPDATE_CHANNEL` for the updater: `tags` (default — highest semver
  `v*` tag) or a branch name (`main`). The canary tracks `main`; member
  appliances track `tags`. This knob is also the seam where a future
  channel (PyPI version, hub-served pointer) plugs in.
- Wallet `.pem` in `GC_WALLET_DIR`. Hub side: the address goes into the
  hub's `GC_MILLER_ADDRESSES`.

## Release discipline (the operator contract)

Tagging a release **is** the fleet deploy trigger. The runbook encodes:

- **gcm-01 is the canary.** It runs the same kit with
  `GC_UPDATE_CHANNEL=main`, so it auto-updates to main nightly; a commit
  soaks there before it gets a `v*` tag.
- **Migrations are forward-only** at a tag boundary: never tag a release
  whose schema migration breaks the *previous* tag's code, because
  rollback reverts code only. (Same constraint most fleets adopt;
  cheap to honor at this scale.)
- A bad tag costs one failed nightly update per device (rollback +
  skip-file), then the fleet waits for the next tag. No crash-loops.

## Docs

1. **`docs/howto-miller-pi.md`** (public, roll-your-own): hardware list,
   flash + `custom.toml`, run `install.sh`, create a wallet, request
   allowlisting from the hub operator, write `.env`, enable services,
   verify milling, updates (auto-default via the timer; manual =
   `git checkout <tag> && uv sync && systemctl restart ...`),
   troubleshooting (journalctl recipes, sync-from-scratch expectations).
2. **`docs/pi-appliance-runbook.md`** (operator): bench inventory +
   fleet roster table, the **wallet ceremony** (generate → encrypted
   backup → hub allowlist → secure key delivery to the member for their
   game), provisioning steps, 24 h bench soak checklist (device mills
   real blocks against the hub before shipping), ship checklist,
   **recovery flow** (re-flash + re-provision from the wallet backup;
   chain DB rebuilds by sync), and the release-discipline section above.

## Testing

- `update.sh` / `install.sh` / `provision-appliance.sh`: `shellcheck` +
  `bash -n` wired into pre-commit (cheap, catches the classic quoting
  bugs); the scripts' tag-resolution logic factored so it can be
  exercised with a local fixture repo in a pytest (no network).
- Unit files: a small pytest asserting they reference existing script
  paths and the `gc` user consistently (string-level sanity, no systemd
  dependency in CI).
- **Real validation is gcm-01**: the runbook's first execution
  re-provisions gcm-01 itself with this kit (it currently runs an
  ad-hoc rsync setup), and gcm-01 then soaks the auto-update path across
  at least one real tag bump before the first member Pi ships.

## PR decomposition

1. **This docs PR** — spec + implementation plan.
2. **One implementation PR** — `deploy/pi/` + the two docs (+ pre-commit
   shellcheck hook). Code-free at the package level; no schema changes.
3. **Operational follow-through (not a PR)** — re-provision gcm-01 via
   the runbook, cut the first `v*` tag, watch one auto-update cycle,
   then build the friend's appliance.
