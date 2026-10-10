import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

// Collection names
export const COLLECTIONS = {
  USERS: "users",
  OWNER_PROFILES: "owner_profiles",
  RENTER_PROFILES: "renter_profiles",
  PROPERTIES: "properties",
  UNITS: "units",
  LISTINGS: "listings",
  LISTING_MEDIA: "listing_media",
  APPLICATIONS: "applications",
  CONVERSATIONS: "conversations",
  MESSAGES: "messages",
  TENANCIES: "tenancies",
  TENANCY_MEMBERS: "tenancy_members",
  DOCUMENT_REQUESTS: "document_requests",
  DOCUMENTS: "documents",
  RENT_CHARGES: "rent_charges",
  PAYMENTS: "payments",
  REQUESTS: "requests",
  REQUEST_COMMENTS: "request_comments",
  NOTIFICATIONS: "notifications",
  AUDIT_LOGS: "audit_logs",
  OWNER_DOMAINS: "owner_domains",
  SUBSCRIPTION_PLANS: "subscription_plans",
  OWNER_SUBSCRIPTIONS: "owner_subscriptions",
};

// Generic CRUD operations
export async function createDocument(collectionName, data) {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function createDocumentWithId(collectionName, docId, data) {
  await setDoc(doc(db, collectionName, docId), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docId;
}

export async function getDocument(collectionName, docId) {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function updateDocument(collectionName, docId, data) {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(collectionName, docId) {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}

export async function queryDocuments(collectionName, conditions = [], sortBy = null, limitCount = null) {
  let q = collection(db, collectionName);
  
  const queryConstraints = [];
  
  conditions.forEach(({ field, operator, value }) => {
    queryConstraints.push(where(field, operator, value));
  });
  
  if (sortBy) {
    queryConstraints.push(orderBy(sortBy.field, sortBy.direction || "asc"));
  }
  
  if (limitCount) {
    queryConstraints.push(limit(limitCount));
  }
  
  q = query(q, ...queryConstraints);
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Property-specific operations
export async function getPropertiesByOwner(ownerId) {
  return queryDocuments(COLLECTIONS.PROPERTIES, [
    { field: "ownerId", operator: "==", value: ownerId },
  ], { field: "createdAt", direction: "desc" });
}

export async function getUnitsByProperty(propertyId) {
  return queryDocuments(COLLECTIONS.UNITS, [
    { field: "propertyId", operator: "==", value: propertyId },
  ], { field: "unitName", direction: "asc" });
}

export async function getListingsByOwner(ownerId) {
  return queryDocuments(COLLECTIONS.LISTINGS, [
    { field: "ownerId", operator: "==", value: ownerId },
  ], { field: "createdAt", direction: "desc" });
}

export async function getPublishedListings(filters = {}) {
  const conditions = [
    { field: "status", operator: "==", value: "published" },
  ];
  
  if (filters.ownerId) {
    conditions.push({ field: "ownerId", operator: "==", value: filters.ownerId });
  }
  
  if (filters.city) {
    conditions.push({ field: "city", operator: "==", value: filters.city });
  }
  
  if (filters.propertyType) {
    conditions.push({ field: "propertyType", operator: "==", value: filters.propertyType });
  }
  
  return queryDocuments(COLLECTIONS.LISTINGS, conditions, { field: "publishedAt", direction: "desc" });
}

// Application operations
export async function getApplicationsByListing(listingId) {
  return queryDocuments(COLLECTIONS.APPLICATIONS, [
    { field: "listingId", operator: "==", value: listingId },
  ], { field: "submittedAt", direction: "desc" });
}

export async function getApplicationsByRenter(renterId) {
  return queryDocuments(COLLECTIONS.APPLICATIONS, [
    { field: "renterId", operator: "==", value: renterId },
  ], { field: "submittedAt", direction: "desc" });
}

export async function getApplicationsByOwner(ownerId) {
  return queryDocuments(COLLECTIONS.APPLICATIONS, [
    { field: "ownerId", operator: "==", value: ownerId },
  ], { field: "submittedAt", direction: "desc" });
}

// Tenancy operations
export async function getTenanciesByUnit(unitId) {
  return queryDocuments(COLLECTIONS.TENANCIES, [
    { field: "unitId", operator: "==", value: unitId },
  ], { field: "startDate", direction: "desc" });
}

export async function getActiveTenanciesByOwner(ownerId) {
  return queryDocuments(COLLECTIONS.TENANCIES, [
    { field: "ownerId", operator: "==", value: ownerId },
    { field: "status", operator: "==", value: "active" },
  ], { field: "startDate", direction: "desc" });
}

export async function getTenantsByTenancy(tenancyId) {
  return queryDocuments(COLLECTIONS.TENANCY_MEMBERS, [
    { field: "tenancyId", operator: "==", value: tenancyId },
  ]);
}

// Rent operations
export async function getRentChargesByTenancy(tenancyId) {
  return queryDocuments(COLLECTIONS.RENT_CHARGES, [
    { field: "tenancyId", operator: "==", value: tenancyId },
  ], { field: "dueDate", direction: "desc" });
}

export async function getPaymentsByCharge(chargeId) {
  return queryDocuments(COLLECTIONS.PAYMENTS, [
    { field: "rentChargeId", operator: "==", value: chargeId },
  ], { field: "createdAt", direction: "desc" });
}

// Request operations
export async function getRequestsByTenancy(tenancyId) {
  return queryDocuments(COLLECTIONS.REQUESTS, [
    { field: "tenancyId", operator: "==", value: tenancyId },
  ], { field: "createdAt", direction: "desc" });
}

export async function getOpenRequestsByOwner(ownerId) {
  return queryDocuments(COLLECTIONS.REQUESTS, [
    { field: "ownerId", operator: "==", value: ownerId },
    { field: "status", operator: "in", value: ["new", "acknowledged", "in_progress", "waiting_for_tenant"] },
  ], { field: "createdAt", direction: "desc" });
}

// Conversation operations
export async function getConversationsByUser(userId) {
  return queryDocuments(COLLECTIONS.CONVERSATIONS, [
    { field: "participants", operator: "array-contains", value: userId },
  ], { field: "updatedAt", direction: "desc" });
}

export async function getMessagesByConversation(conversationId) {
  return queryDocuments(COLLECTIONS.MESSAGES, [
    { field: "conversationId", operator: "==", value: conversationId },
  ], { field: "createdAt", direction: "asc" });
}

// Document operations
export async function getDocumentsByTenancy(tenancyId) {
  return queryDocuments(COLLECTIONS.DOCUMENTS, [
    { field: "relatedTenancyId", operator: "==", value: tenancyId },
  ], { field: "createdAt", direction: "desc" });
}

export async function getDocumentRequestsByTenant(tenantId) {
  return queryDocuments(COLLECTIONS.DOCUMENT_REQUESTS, [
    { field: "tenantUserId", operator: "==", value: tenantId },
  ], { field: "createdAt", direction: "desc" });
}

// Notification operations
export async function getNotificationsByUser(userId, unreadOnly = false) {
  const conditions = [
    { field: "userId", operator: "==", value: userId },
  ];
  
  if (unreadOnly) {
    conditions.push({ field: "readAt", operator: "==", value: null });
  }
  
  return queryDocuments(COLLECTIONS.NOTIFICATIONS, conditions, { field: "sentAt", direction: "desc" }, 50);
}

export async function markNotificationAsRead(notificationId) {
  await updateDocument(COLLECTIONS.NOTIFICATIONS, notificationId, {
    readAt: serverTimestamp(),
    status: "read",
  });
}

// Audit log
export async function createAuditLog(actorUserId, action, entityType, entityId, reason = null, metadata = {}) {
  return createDocument(COLLECTIONS.AUDIT_LOGS, {
    actorUserId,
    action,
    entityType,
    entityId,
    reason,
    metadata,
  });
}

// Owner profile operations
export async function getOwnerProfile(userId) {
  return getDocument(COLLECTIONS.OWNER_PROFILES, userId);
}

export async function updateOwnerProfile(userId, data) {
  return updateDocument(COLLECTIONS.OWNER_PROFILES, userId, data);
}

// Renter profile operations
export async function getRenterProfile(userId) {
  return getDocument(COLLECTIONS.RENTER_PROFILES, userId);
}

export async function updateRenterProfile(userId, data) {
  return updateDocument(COLLECTIONS.RENTER_PROFILES, userId, data);
}

// Batch operations
export async function batchUpdateDocuments(updates) {
  const batch = writeBatch(db);
  
  updates.forEach(({ collectionName, docId, data }) => {
    const docRef = doc(db, collectionName, docId);
    batch.update(docRef, { ...data, updatedAt: serverTimestamp() });
  });
  
  await batch.commit();
}
