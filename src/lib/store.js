import { REWARD_EURO, statusLabel } from "./constants";
import { seedState } from "../data/seed";

export const STORAGE_KEY = "wohnbruecke.v1";
export const SESSION_KEY = "wohnbruecke.session";

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.users)) return seedState();
    return parsed;
  } catch {
    return seedState();
  }
}

export function loadSession() {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function emailOf(value) {
  return String(value || "").trim().toLowerCase();
}

export function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;
}

export function findUserByEmail(state, email) {
  const needle = emailOf(email);
  return state.users.find((user) => emailOf(user.email) === needle) || null;
}

export function referralCodeFor(name) {
  const base =
    String(name || "ROOM")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 6)
      .toUpperCase() || "ROOM";
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}-${suffix}`;
}

function uniqueCode(state, name) {
  const taken = new Set(state.users.map((user) => user.referralCode).filter(Boolean));
  let code = referralCodeFor(name);
  while (taken.has(code)) code = referralCodeFor(name);
  return code;
}

export function authenticate(state, email, password) {
  const user = findUserByEmail(state, email);
  if (!user) return { error: "No account uses that email." };
  if (user.password !== password) return { error: "That password does not match." };
  return { user };
}

export function registerUser(state, input) {
  const email = emailOf(input.email);
  if (!input.name?.trim()) return { error: "Enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email." };
  if (findUserByEmail(state, email)) {
    return { error: "An account with that email already exists. Log in instead." };
  }
  if (!input.password || input.password.length < 6) {
    return { error: "Use at least 6 characters for the password." };
  }

  const role = input.role === "landlord" ? "landlord" : "seeker";
  const code = String(input.referralCode || "").trim().toUpperCase();
  let referredBy = null;
  let referrer = null;
  if (role === "seeker" && code) {
    referrer = state.users.find((user) => user.referralCode === code && user.role === "seeker");
    if (!referrer) return { error: "That referral code is not active. Clear it or ask your friend to resend it." };
    referredBy = code;
  }

  const createdAt = new Date().toISOString();
  const user = {
    id: uid("u"),
    role,
    name: input.name.trim(),
    email,
    password: input.password,
    phone: String(input.phone || "").trim(),
    city: String(input.city || "").trim(),
    occupation: input.occupation || "",
    institution: "",
    budget: "",
    germanLevel: "",
    referralCode: role === "seeker" ? uniqueCode(state, input.name) : "",
    referredBy,
    ownerId: "",
    saved: [],
    createdAt,
  };

  let owners = state.owners;
  if (role === "landlord") {
    const owner = {
      id: uid("o"),
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      notes: "Joined from the website.",
      createdAt,
    };
    user.ownerId = owner.id;
    owners = [owner, ...owners];
  }

  let referrals = state.referrals;
  const requests = state.requests.map((request) =>
    !request.userId && emailOf(request.email) === email ? { ...request, userId: user.id } : request,
  );
  if (referrer) {
    const alreadyPlaced = requests.some((request) => request.userId === user.id && request.status === "placed");
    referrals = [
      {
        id: uid("r"),
        referrerId: referrer.id,
        referredUserId: user.id,
        code: referredBy,
        status: alreadyPlaced ? "earned" : "registered",
        amount: REWARD_EURO,
        createdAt,
      },
      ...referrals,
    ];
  }

  return {
    user,
    state: { ...state, users: [user, ...state.users], owners, referrals, requests },
  };
}

export function submitRequest(state, input, user) {
  const now = new Date().toISOString();
  const request = {
    id: uid("q"),
    userId: user?.id || null,
    listingId: input.listingId || "",
    assignedListingId: input.listingId || "",
    name: input.name.trim(),
    email: emailOf(input.email),
    phone: input.phone.trim(),
    occupation: input.occupation,
    institution: String(input.institution || "").trim(),
    cities: input.cities,
    budget: Number(input.budget),
    moveIn: input.moveIn,
    stay: input.stay,
    roomType: input.roomType,
    germanLevel: input.germanLevel || "",
    smoking: input.smoking || "no",
    pets: Boolean(input.pets),
    anmeldung: Boolean(input.anmeldung),
    proof: Boolean(input.proof),
    notes: String(input.notes || "").trim(),
    referralCode: String(input.referralCode || "").trim().toUpperCase(),
    status: "new",
    landlordNote: "",
    history: [
      {
        at: now,
        status: "new",
        note: "Request received. The desk will match it against the owner network.",
        by: "desk",
      },
    ],
    createdAt: now,
  };

  let users = state.users;
  let referrals = state.referrals;
  if (user?.role === "seeker" && !user.referredBy && request.referralCode) {
    const referrer = state.users.find(
      (item) => item.referralCode === request.referralCode && item.id !== user.id && item.role === "seeker",
    );
    if (referrer) {
      users = users.map((item) => (item.id === user.id ? { ...item, referredBy: request.referralCode } : item));
      referrals = [
        {
          id: uid("r"),
          referrerId: referrer.id,
          referredUserId: user.id,
          code: request.referralCode,
          status: "registered",
          amount: REWARD_EURO,
          createdAt: now,
        },
        ...referrals,
      ];
    }
  }

  return { request, state: { ...state, users, referrals, requests: [request, ...state.requests] } };
}

export function reviewRequest(state, { id, status, note, assignedListingId }) {
  const current = state.requests.find((request) => request.id === id);
  if (!current) return state;
  const changed = status && status !== current.status;
  const history = [...current.history];
  if (changed || note?.trim()) {
    history.push({
      at: new Date().toISOString(),
      status: status || current.status,
      note: note?.trim() || `Status set to ${statusLabel(status)}.`,
      by: "desk",
    });
  }
  const next = {
    ...current,
    status: status || current.status,
    assignedListingId: assignedListingId ?? current.assignedListingId,
    history,
  };
  const referrals = changed && next.status === "placed" ? awardReferral(state, next) : state.referrals;
  return {
    ...state,
    referrals,
    requests: state.requests.map((request) => (request.id === id ? next : request)),
  };
}

function awardReferral(state, request) {
  const seeker =
    state.users.find((user) => user.id === request.userId) ||
    state.users.find((user) => emailOf(user.email) === emailOf(request.email));
  if (!seeker?.referredBy) return state.referrals;
  const existing = state.referrals.find((ref) => ref.referredUserId === seeker.id);
  if (!existing) {
    const referrer = state.users.find((user) => user.referralCode === seeker.referredBy);
    if (!referrer) return state.referrals;
    return [
      {
        id: uid("r"),
        referrerId: referrer.id,
        referredUserId: seeker.id,
        code: seeker.referredBy,
        status: "earned",
        amount: REWARD_EURO,
        createdAt: new Date().toISOString(),
      },
      ...state.referrals,
    ];
  }
  return state.referrals.map((ref) =>
    ref.referredUserId === seeker.id && ref.status === "registered" ? { ...ref, status: "earned" } : ref,
  );
}

export function markReferralPaid(state, id) {
  return {
    ...state,
    referrals: state.referrals.map((ref) =>
      ref.id === id && ref.status === "earned"
        ? { ...ref, status: "paid", paidAt: new Date().toISOString() }
        : ref,
    ),
  };
}

export function saveListing(state, input) {
  if (input.id) {
    return {
      ...state,
      listings: state.listings.map((listing) => (listing.id === input.id ? { ...listing, ...input } : listing)),
    };
  }
  const listing = {
    ...input,
    id: uid("l"),
    createdAt: new Date().toISOString(),
    status: input.status || "pending",
  };
  return { ...state, listings: [listing, ...state.listings] };
}

export function toggleSaved(state, userId, listingId) {
  return {
    ...state,
    users: state.users.map((user) => {
      if (user.id !== userId) return user;
      const has = user.saved.includes(listingId);
      return { ...user, saved: has ? user.saved.filter((id) => id !== listingId) : [...user.saved, listingId] };
    }),
  };
}

export function updateProfile(state, userId, input) {
  const user = state.users.find((item) => item.id === userId);
  if (!user) return { error: "Account missing." };
  const email = emailOf(input.email);
  if (!input.name?.trim()) return { error: "Enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email." };
  if (state.users.some((item) => item.id !== userId && emailOf(item.email) === email)) {
    return { error: "Another account uses that email." };
  }
  const next = {
    ...user,
    name: input.name.trim(),
    email,
    phone: String(input.phone || "").trim(),
    city: input.city || "",
    occupation: input.occupation || "",
    institution: input.institution || "",
    budget: input.budget === "" || input.budget === undefined ? "" : Number(input.budget),
    germanLevel: input.germanLevel || "",
  };
  if (input.nextPassword) {
    if (user.password !== input.currentPassword) return { error: "Current password does not match." };
    if (input.nextPassword.length < 6) return { error: "Use at least 6 characters." };
    next.password = input.nextPassword;
  }
  return {
    state: {
      ...state,
      users: state.users.map((item) => (item.id === userId ? next : item)),
      owners: state.owners.map((owner) =>
        owner.userId === userId
          ? { ...owner, name: next.name, email: next.email, phone: next.phone, city: next.city }
          : owner,
      ),
      requests: state.requests.map((request) =>
        request.userId === userId ? { ...request, name: next.name, email: next.email, phone: next.phone } : request,
      ),
    },
  };
}

export function setLandlordNote(state, id, note) {
  const current = state.requests.find((request) => request.id === id);
  if (!current) return state;
  const trimmed = note.trim();
  const history =
    trimmed && trimmed !== current.landlordNote
      ? [...current.history, { at: new Date().toISOString(), status: current.status, note: `Owner: ${trimmed}`, by: "owner" }]
      : current.history;
  return {
    ...state,
    requests: state.requests.map((request) =>
      request.id === id ? { ...request, landlordNote: trimmed, history } : request,
    ),
  };
}

export function addLead(state, input) {
  const lead = {
    id: uid("lead"),
    name: input.name.trim(),
    email: emailOf(input.email),
    phone: input.phone.trim(),
    city: input.city,
    roomCount: String(input.roomCount || "").trim(),
    message: String(input.message || "").trim(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  return { lead, state: { ...state, leads: [lead, ...state.leads] } };
}

export function setLeadStatus(state, id, status) {
  return {
    ...state,
    leads: state.leads.map((lead) => (lead.id === id ? { ...lead, status } : lead)),
  };
}

export function addOwnerAccount(state, input) {
  const email = emailOf(input.email);
  if (!input.name?.trim()) return { error: "Enter the owner's name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email." };
  if (findUserByEmail(state, email)) return { error: "That email already has an account." };
  const createdAt = new Date().toISOString();
  const owner = {
    id: uid("o"),
    userId: "",
    name: input.name.trim(),
    email,
    phone: String(input.phone || "").trim(),
    city: input.city || "",
    notes: String(input.notes || "").trim(),
    createdAt,
  };
  const user = {
    id: uid("u"),
    role: "landlord",
    name: owner.name,
    email,
    password: "bruecke",
    phone: owner.phone,
    city: owner.city,
    occupation: "",
    institution: "",
    budget: "",
    germanLevel: "",
    referralCode: "",
    referredBy: null,
    ownerId: owner.id,
    saved: [],
    createdAt,
  };
  owner.userId = user.id;
  return {
    user,
    password: user.password,
    state: { ...state, users: [user, ...state.users], owners: [owner, ...state.owners] },
  };
}

export function requestsForUser(state, user) {
  if (!user) return [];
  return state.requests.filter(
    (request) => request.userId === user.id || emailOf(request.email) === emailOf(user.email),
  );
}

export function requestsForOwner(state, ownerId) {
  const ids = new Set(state.listings.filter((listing) => listing.ownerId === ownerId).map((listing) => listing.id));
  return state.requests.filter(
    (request) => ids.has(request.assignedListingId) || ids.has(request.listingId),
  );
}

export function liveListings(state) {
  return state.listings.filter((listing) => listing.status === "live");
}
