/**
 * The designated agent for copyright notices, as registered with the U.S.
 * Copyright Office (DMCA Designated Agent Directory). Shown on /dmca.
 *
 * Copy each value exactly as it appears in the registration: the law
 * protects us only while the details on our site match the directory.
 * Leave a field empty until it is known; never fill it with a guess.
 * While any field is empty, /dmca says the details are being published and
 * points to the online form, which reaches the same team.
 */
export interface DmcaAgent {
  /** The agent's name, or a position such as "Copyright Agent". */
  name: string;
  /** The service provider as registered, e.g. "Companies Center LLC". */
  organization: string;
  /** Registration number from the directory, e.g. "DMCA-1234567". */
  registrationNumber: string;
  /** Full postal address, one line per entry. */
  address: string[];
  phone: string;
  email: string;
}

export const DMCA_AGENT: DmcaAgent = {
  name: "",
  organization: "",
  registrationNumber: "",
  address: [],
  phone: "",
  email: "",
};

/** Every field the page shows is filled in. */
export function dmcaAgentComplete(agent: DmcaAgent = DMCA_AGENT): boolean {
  return (
    [agent.name, agent.organization, agent.registrationNumber, agent.phone, agent.email].every(
      (v) => v.trim().length > 0,
    ) && agent.address.some((l) => l.trim().length > 0)
  );
}
