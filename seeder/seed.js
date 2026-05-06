/**
 * ============================================================
 *  FLS-OPC Firestore Seeder
 *  Run: node seed.js
 *
 *  REQUIREMENTS:
 *  1. Download your serviceAccountKey.json from Firebase Console:
 *     Project Settings → Service Accounts → Generate new private key
 *     Save it as: seeder/serviceAccountKey.json
 *
 *  2. Install deps (one-time):
 *     cd seeder && npm install
 *
 *  WHAT IT DOES:
 *  - Clears: Packages, shipRequests, conversations,
 *            shipment_conversations, archived_conversations,
 *            userNotifications, countries, staffActivity
 *  - Preserves: Users, config (your admin account stays intact)
 *  - Seeds realistic logistics demo data
 *
 *  SAFETY LIMITS:
 *  - MAX_RUNS: seeder can only be run this many times total
 *  - Requires typing CONFIRM to proceed
 *  - Tracks every run in seed.lock.json
 * ============================================================
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// ─── Run Limit Config ─────────────────────────────────────────────────────────
const MAX_RUNS = 10; // Change this if you need more runs
const LOCK_FILE = path.join(__dirname, "seed.lock.json");

// ─── Lock File Helpers ────────────────────────────────────────────────────────

function readLock() {
  if (!fs.existsSync(LOCK_FILE)) return { runs: 0, history: [] };
  try {
    return JSON.parse(fs.readFileSync(LOCK_FILE, "utf8"));
  } catch {
    return { runs: 0, history: [] };
  }
}

function writeLock(lock) {
  fs.writeFileSync(LOCK_FILE, JSON.stringify(lock, null, 2), "utf8");
}

// ─── Confirmation Prompt ──────────────────────────────────────────────────────

function askConfirmation(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans.trim()); }));
}

// ─── Run Guard ────────────────────────────────────────────────────────────────

async function runGuard() {
  const lock = readLock();

  console.log("╔══════════════════════════════════════════╗");
  console.log("║       FLS-OPC Firestore Seeder           ║");
  console.log("╚══════════════════════════════════════════╝\n");

  // ── Check run limit ──
  if (lock.runs >= MAX_RUNS) {
    console.error(`❌  BLOCKED: This seeder has already been run ${lock.runs} time(s).`);
    console.error(`   Maximum allowed runs: ${MAX_RUNS}`);
    console.error(`   Last run: ${lock.history.at(-1)?.date ?? "unknown"}`);
    console.error(`\n   To reset the limit, delete 'seed.lock.json' and update MAX_RUNS if needed.`);
    process.exit(1);
  }

  // ── Show run history ──
  console.log(`⚠️   Run limit: ${lock.runs} / ${MAX_RUNS} used\n`);
  if (lock.history.length > 0) {
    console.log("  Previous runs:");
    lock.history.forEach((h, i) => console.log(`    ${i + 1}. ${h.date}`));
    console.log("");
  }

  // ── Show what will be deleted ──
  console.log("🗑️   The following collections will be PERMANENTLY CLEARED:");
  [
    "Packages", "shipRequests", "conversations",
    "shipment_conversations", "archived_conversations",
    "userNotifications", "countries", "staffActivity",
  ].forEach((c) => console.log(`     - ${c}`));
  console.log("\n🔒  The following collections will NOT be touched:");
  console.log("     - Users");
  console.log("     - config\n");

  // ── Require explicit confirmation ──
  const answer = await askConfirmation(
    '⚠️   Type  CONFIRM  to proceed, or anything else to cancel: '
  );

  if (answer !== "CONFIRM") {
    console.log("\n🚫  Seeding cancelled. No data was modified.");
    process.exit(0);
  }

  // ── Update lock file before running (so a crash still counts as a run) ──
  lock.runs += 1;
  lock.history.push({ run: lock.runs, date: new Date().toISOString() });
  writeLock(lock);

  console.log(`\n✅  Confirmed. Starting seed run ${lock.runs} of ${MAX_RUNS}...\n`);
}

// ─── Firebase Init ────────────────────────────────────────────────────────────

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return admin.firestore.Timestamp.fromDate(d);
};

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function clearCollection(name) {
  const snap = await db.collection(name).get();
  if (snap.empty) return;
  const batch = db.batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  console.log(`  ✓ Cleared ${snap.size} docs from '${name}'`);
}

async function clearSubcollections(parentCollection, subName) {
  const parents = await db.collection(parentCollection).get();
  for (const parent of parents.docs) {
    const sub = await parent.ref.collection(subName).get();
    if (!sub.empty) {
      const batch = db.batch();
      sub.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  }
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const COUNTRIES = [
  "Philippines", "United States", "Japan", "South Korea", "Australia",
  "United Kingdom", "Canada", "Germany", "Singapore", "United Arab Emirates",
  "China", "Hong Kong", "Taiwan", "Malaysia", "Indonesia",
];

const TRANSPORT_MODES = ["Air", "Sea", "Land"];
const DIRECTIONS = ["Import", "Export"];
const LOAD_TYPES = ["FCL", "LCL", "FTL", "LTL"];
const STATUSES = ["Processing", "In Transit", "Out for Delivery", "Delivered", "On Hold"];
const PICKUP_OPTIONS = ["deliverToWarehouse", "pickupFromAddress"];

const FAKE_USERS = [
  { uid: "seed_user_001", firstName: "Maria", lastName: "Santos", email: "maria.santos@email.com" },
  { uid: "seed_user_002", firstName: "John", lastName: "Garcia", email: "john.garcia@email.com" },
  { uid: "seed_user_003", firstName: "Ana", lastName: "Reyes", email: "ana.reyes@email.com" },
  { uid: "seed_user_004", firstName: "Carlos", lastName: "Cruz", email: "carlos.cruz@email.com" },
  { uid: "seed_user_005", firstName: "Sofia", lastName: "Torres", email: "sofia.torres@email.com" },
];

// ─── Seed Countries ───────────────────────────────────────────────────────────

async function seedCountries() {
  console.log("\n📍 Seeding countries...");
  const batch = db.batch();
  for (const country of COUNTRIES) {
    const ref = db.collection("countries").doc();
    batch.set(ref, { name: country, createdAt: FieldValue.serverTimestamp(), label: country });
  }
  await batch.commit();
  console.log(`  ✓ Added ${COUNTRIES.length} countries`);
}

// ─── Seed Packages ────────────────────────────────────────────────────────────

async function seedPackages() {
  console.log("\n📦 Seeding Packages...");
  const packages = [];

  for (let i = 1; i <= 62; i++) {
    const user = rand(FAKE_USERS);
    const from = rand(COUNTRIES);
    const to = rand(COUNTRIES.filter((c) => c !== from));
    const mode = rand(TRANSPORT_MODES);
    const status = rand(STATUSES);
    const pkgNum = `FLS-${String(i).padStart(4, "0")}`;
    const daysBack = randInt(1, 90);

    const pkg = {
      customId: i,
      packageNumber: pkgNum,
      shipperName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      userId: user.uid,
      senderCountry: from,
      destinationCountry: to,
      destinationAddress: `${randInt(1, 999)} ${rand(["Main St", "Rizal Ave", "JP Rizal", "Quezon Blvd", "Kamias Rd"])}, ${to}`,
      transportMode: mode,
      shipmentDirection: rand(DIRECTIONS),
      loadType: rand(LOAD_TYPES),
      packageStatus: status,
      mobile: `+63${randInt(9000000000, 9999999999)}`,
      pickupOption: rand(PICKUP_OPTIONS),
      packages: [
        {
          length: randInt(10, 200),
          width: randInt(10, 200),
          height: randInt(10, 200),
          weight: randInt(1, 500),
          contents: rand(["Electronics", "Clothing", "Documents", "Food Products", "Auto Parts", "Furniture", "Medical Supplies"]),
          image: null,
        },
      ],
      additionalServices: {
        documentation: Math.random() > 0.6,
        insurance: Math.random() > 0.7,
        customsClearance: Math.random() > 0.5,
      },
      dateStarted: daysAgo(daysBack).toDate().toISOString(),
      createdTime: daysAgo(daysBack),
      updatedAt: daysAgo(randInt(0, daysBack)),
      isArchived: false,
      airwayBill: mode === "Air" ? `AWB-${randInt(100000000, 999999999)}` : null,
      billOfLading: mode === "Sea" ? `BOL-${randInt(10000000, 99999999)}` : null,
    };

    packages.push(pkg);
  }

  for (const pkg of packages) {
    const ref = db.collection("Packages").doc();
    await ref.set(pkg);

    // Add status history
    const statusFlow = buildStatusFlow(pkg.packageStatus, pkg.createdTime.toDate());
    for (const hist of statusFlow) {
      await ref.collection("statusHistory").add(hist);
    }
  }

  console.log(`  ✓ Added ${packages.length} packages with status history`);
}

function buildStatusFlow(finalStatus, startDate) {
  const allStatuses = ["Processing", "In Transit", "Out for Delivery", "Delivered"];
  const finalIdx = allStatuses.indexOf(finalStatus);
  const flow = finalIdx === -1 ? ["Processing"] : allStatuses.slice(0, finalIdx + 1);

  return flow.map((status, i) => {
    const ts = new Date(startDate);
    ts.setDate(ts.getDate() + i * randInt(2, 7));
    return {
      status,
      timestamp: admin.firestore.Timestamp.fromDate(ts),
      updatedBy: "Admin",
    };
  });
}

// ─── Seed Shipment Requests ───────────────────────────────────────────────────

async function seedShipRequests() {
  console.log("\n📋 Seeding shipRequests...");
  const statuses = ["Processing", "Accepted", "Rejected"];
  const requests = [];

  for (let i = 0; i < 41; i++) {
    const user = rand(FAKE_USERS);
    const from = rand(COUNTRIES);
    const to = rand(COUNTRIES.filter((c) => c !== from));
    // Prioritize Processing status so they show up in the main active list
    const status = Math.random() > 0.3 ? "Processing" : rand(["Accepted", "Rejected"]);
    const daysBack = randInt(1, 60);
    const requestTime = daysAgo(daysBack).toDate().toISOString();

    const req = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      userId: user.uid,
      mobile: `+63${randInt(9000000000, 9999999999)}`,
      senderCountry: from,
      destinationCountry: to,
      destinationAddress: `${randInt(1, 999)} ${rand(["Mabini St", "Quezon Ave", "Bonifacio Dr"])}, ${to}`,
      transportMode: rand(TRANSPORT_MODES),
      shipmentDirection: rand(DIRECTIONS),
      loadType: rand(LOAD_TYPES),
      pickupOption: rand(PICKUP_OPTIONS),
      status,
      requestTime,
      createdAt: daysAgo(daysBack),
      packages: [
        {
          weight: randInt(1, 100),
          contents: rand(["Apparel", "Machinery", "Cosmetics", "Books", "Electronics"]),
        },
      ],
      ...(status === "Accepted" && {
        acceptedAt: daysAgo(randInt(0, daysBack)),
        packageNumber: `FLS-REQ-${String(i + 1).padStart(3, "0")}`,
      }),
      ...(status === "Rejected" && {
        rejectedAt: daysAgo(randInt(0, daysBack)),
      }),
    };

    requests.push(req);
  }

  const batch = db.batch();
  for (const req of requests) {
    batch.set(db.collection("shipRequests").doc(), req);
  }
  await batch.commit();
  console.log(`  ✓ Added ${requests.length} shipment requests`);
}

// ─── Seed Archived Conversations ─────────────────────────────────────────────

async function seedArchivedConversations() {
  console.log("\n🗂️  Seeding archived_conversations...");

  const archived = [
    {
      userId: "seed_user_004",
      userFullName: "Carlos Cruz",
      userEmail: "carlos.cruz@email.com",
      role: "user",
      status: "ended",
      lastMessage: "Thanks for your help!",
      endedAt: daysAgo(20),
      duration: "12m 35s",
      createdAt: daysAgo(25),
      messages: [
        { text: "I need help with my air freight booking.", senderId: "seed_user_004", senderName: "Carlos Cruz", timestamp: daysAgo(25) },
        { text: "Sure Carlos! What do you need help with?", senderId: "admin_placeholder", senderName: "FLS Admin", timestamp: daysAgo(25) },
        { text: "I need to add insurance to my shipment.", senderId: "seed_user_004", senderName: "Carlos Cruz", timestamp: daysAgo(24) },
        { text: "We can add cargo insurance for a nominal fee. I will update your booking.", senderId: "admin_placeholder", senderName: "FLS Admin", timestamp: daysAgo(24) },
        { text: "Thanks for your help!", senderId: "seed_user_004", senderName: "Carlos Cruz", timestamp: daysAgo(20) },
      ],
    },
  ];

  for (const arc of archived) {
    const { messages, ...arcData } = arc;
    const ref = db.collection("archived_conversations").doc();
    await ref.set(arcData);
    for (const msg of messages) {
      await ref.collection("messages").add(msg);
    }
  }
  console.log(`  ✓ Added ${archived.length} archived conversations`);
}

// ─── Seed Staff Activity ──────────────────────────────────────────────────────

async function seedStaffActivity() {
  console.log("\n📝 Seeding staffActivity...");
  const activities = [
    { action: "Accepted shipment request FLS-REQ-001", admin: "FLS Admin", timestamp: daysAgo(2) },
    { action: "Updated status of FLS-0001 to In Transit", admin: "FLS Admin", timestamp: daysAgo(3) },
    { action: "Rejected shipment request from sofia.torres@email.com", admin: "FLS Admin", timestamp: daysAgo(5) },
    { action: "Added new country: Vietnam", admin: "FLS Admin", timestamp: daysAgo(7) },
    { action: "Updated status of FLS-0005 to Delivered", admin: "FLS Admin", timestamp: daysAgo(8) },
    { action: "Approved live chat for John Garcia", admin: "FLS Admin", timestamp: daysAgo(10) },
  ];

  const batch = db.batch();
  for (const act of activities) {
    batch.set(db.collection("staffActivity").doc(), act);
  }
  await batch.commit();
  console.log(`  ✓ Added ${activities.length} staff activity logs`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // ── Run guard: confirmation + run limit check ──
  await runGuard();

  // ── Step 1: Clear operational collections (Users & config are preserved) ──
  console.log("🗑️  Clearing existing data...");
  await clearCollection("Packages");
  await clearCollection("shipRequests");
  await clearCollection("conversations");
  await clearCollection("shipment_conversations");
  await clearCollection("archived_conversations");
  await clearCollection("userNotifications");
  await clearCollection("countries");
  await clearCollection("staffActivity");

  // ── Step 2: Seed fresh data ──
  await seedCountries();
  await seedPackages();
  await seedShipRequests();
  await seedArchivedConversations();
  await seedStaffActivity();

  console.log("\n✅ Seeding complete! Your Firestore database is ready.");
  console.log("   ℹ️  Users and config collections were NOT modified.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeder failed:", err);
  process.exit(1);
});
