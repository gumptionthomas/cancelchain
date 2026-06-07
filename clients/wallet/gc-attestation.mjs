// "Verified on GumptionChain" stake attestations: a gc-msg-v1 proof whose
// message is the canonical JSON of a stake claim. verifyStake composes the
// signature (gc-msg-v1), on-chain provenance (injected fetchProvenance), and a
// consistency check. Pure — no I/O. No dependencies beyond sibling modules.
import { BadAttestationError } from './gc-errors.mjs';
import { signMessage, verifyMessage } from './gc-message.mjs';

const KINDS = new Set(['opposition', 'support', 'rescind', 'transfer']);

export { BadAttestationError } from './gc-errors.mjs';

function validateClaim(claim) {
  if (!claim || typeof claim !== 'object') {
    throw new BadAttestationError('claim must be an object');
  }
  const { txid, kind, subject, address, amount, handle } = claim;
  if (typeof txid !== 'string' || !txid) {
    throw new BadAttestationError('txid is required');
  }
  if (!KINDS.has(kind)) {
    throw new BadAttestationError(`invalid kind: ${kind}`);
  }
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new BadAttestationError('amount must be a positive integer (grains)');
  }
  if (kind === 'transfer') {
    if (typeof address !== 'string' || !address) {
      throw new BadAttestationError('transfer requires address');
    }
    if (subject !== undefined) {
      throw new BadAttestationError('transfer must not set subject');
    }
  } else {
    if (typeof subject !== 'string' || !subject) {
      throw new BadAttestationError('stake requires subject');
    }
    if (address !== undefined) {
      throw new BadAttestationError('stake must not set address');
    }
  }
  if (handle !== undefined && handle !== null && typeof handle !== 'string') {
    throw new BadAttestationError('handle must be a string');
  }
}

export function buildStakeMessage(claim) {
  validateClaim(claim);
  const ordered = { txid: claim.txid, kind: claim.kind };
  if (claim.kind === 'transfer') {
    ordered.address = claim.address;
  } else {
    ordered.subject = claim.subject;
  }
  ordered.amount = claim.amount;
  if (claim.handle !== undefined && claim.handle !== null) {
    ordered.handle = claim.handle;
  }
  return JSON.stringify(ordered);
}

export async function signStakeAttestation(wallet, claim, { timestamp } = {}) {
  return signMessage(wallet, buildStakeMessage(claim), { timestamp });
}

export function parseStakeAttestation(proof) {
  if (!proof || typeof proof.message !== 'string') {
    throw new BadAttestationError('proof has no message');
  }
  let claim;
  try {
    claim = JSON.parse(proof.message);
  } catch {
    throw new BadAttestationError('message is not a stake claim');
  }
  validateClaim(claim);
  return claim;
}

function outflowMatches(outflows, claim) {
  return (outflows || []).some(
    (o) => o.kind === claim.kind
      && o.amount === claim.amount
      && (claim.kind === 'transfer'
        ? o.address === claim.address
        : o.subject === claim.subject),
  );
}

// fetchProvenance(txid) MUST resolve to the #176a provenance object, or null
// for an unknown txn. The verifier performs no transport itself.
export async function verifyStake(
  proof,
  { fetchProvenance, maxAge, minConfirmations } = {},
) {
  const claim = parseStakeAttestation(proof);
  const reasons = [];
  const checks = { signature: false, onchain: false, consistent: false };
  const signer = proof.address;

  const sig = await verifyMessage(proof, { maxAge });
  if (sig.valid && sig.address === signer) {
    checks.signature = true;
  } else {
    reasons.push(sig.reason === 'expired' ? 'expired' : 'bad-signature');
  }

  const provenance = await fetchProvenance(claim.txid);
  if (!provenance) {
    reasons.push('txn-not-found');
  } else if (provenance.status !== 'canonical') {
    reasons.push('not-canonical');
  } else if (
    minConfirmations !== undefined
    && (provenance.confirmations ?? 0) < minConfirmations
  ) {
    reasons.push('insufficient-confirmations');
  } else {
    checks.onchain = true;
  }

  if (checks.signature && checks.onchain && provenance) {
    if (provenance.address !== signer) {
      reasons.push('signer-not-staker');
    } else if (!outflowMatches(provenance.outflows, claim)) {
      reasons.push('claim-mismatch');
    } else {
      checks.consistent = true;
    }
  }

  return {
    valid: checks.signature && checks.onchain && checks.consistent,
    checks,
    signer,
    claim,
    provenance: provenance ?? null,
    confirmations: provenance?.confirmations ?? 0,
    reasons,
  };
}
