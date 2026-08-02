/**
 * Where to point an <img> for someone's profile photo.
 *
 * One place for this so the fallback cannot drift: it used to be the PanchayatX
 * logo, which meant every villager who had not uploaded a photo appeared to be
 * an official account.
 */

export const DEFAULT_AVATAR = "/avatar-placeholder.svg";

/** The uploaded photo if there is one, otherwise the neutral placeholder. */
export const avatarSrc = (profile) =>
  typeof profile === "string" && profile.trim() ? profile : DEFAULT_AVATAR;
