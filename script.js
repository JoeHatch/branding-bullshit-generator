// Import Firebase modules from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getDatabase, ref, update, onValue, increment } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// Updated Firebase configuration with databaseURL
const firebaseConfig = {
  apiKey: "AIzaSyCdRBlsc3zZUMtFi7uPuiKgCjEW9hsyKuo",
  authDomain: "branding-bullshit-generator.firebaseapp.com",
  databaseURL: "https://branding-bullshit-generator-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "branding-bullshit-generator",
  storageBucket: "branding-bullshit-generator.firebasestorage.app",
  messagingSenderId: "1016036262861",
  appId: "1:1016036262861:web:a4b07ce879296dbdc37a84",
  measurementId: "G-7XTB1GF66L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// Branding-themed buzzword arrays
const verbs = ["Elevate", "Transform", "Reimagine", "Amplify", "Leverage", "Ignite", "Revitalize", "Differentiate", "Empower", "Disrupt", "Optimize", "Innovate"];
const adjectives = ["innovative", "cutting-edge", "customer-centric", "next-gen", "data-driven", "holistic", "engaging", "integrated", "visionary", "creative", "disruptive", "synergistic"];
const nouns = ["brand strategy", "market positioning", "digital ecosystem", "customer journey", "value proposition", "brand identity", "content framework", "visual language", "storytelling blueprint", "brand narrative", "marketing mix", "engagement model"];
const endings = ["to drive growth", "for a competitive edge", "in a crowded market", "to captivate audiences", "to redefine industry standards", "for lasting impact", "to inspire loyalty", "for exponential reach", "with authentic storytelling", "to elevate presence"];

// Function to format today's date as YYYY-MM-DD
function getTodayDate() {
  return new Date().toLocaleDateString('en-CA');
}

export function generateBullshit() {
  const v = verbs[Math.floor(Math.random() * verbs.length)];
  const a = adjectives[Math.floor(Math.random() * adjectives.length)];
  const n = nouns[Math.floor(Math.random() * nouns.length)];
  const e = endings[Math.floor(Math.random() * endings.length)];
  const phrase = `${v} your ${a} ${n} ${e}.`;
  document.getElementById("bs-output").innerText = phrase;

  // Trigger fun confetti effect
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, scalar: 1.2 });

  // Update Firebase stats
  const today = getTodayDate();
  const updates = {};
  updates['/total'] = increment(1);
  updates[`/today/${today}`] = increment(1);
  updates[`/buzzwords/${v}`] = increment(1);
  updates[`/buzzwords/${a}`] = increment(1);
  updates[`/buzzwords/${n}`] = increment(1);

  update(ref(db), updates);
}

export function listenForStats() {
  const today = getTodayDate();

  onValue(ref(db, '/total'), snapshot => {
    document.getElementById('total-count').innerText = snapshot.val() ?? 0;
  });

  onValue(ref(db, `/today/${today}`), snapshot => {
    document.getElementById('today-count').innerText = snapshot.val() ?? 0;
  });

  onValue(ref(db, '/buzzwords'), snapshot => {
    const data = snapshot.val() || {};
    const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const [topWord] = sorted[0] || ['N/A', 0];
    document.getElementById('popular-buzzword').innerText = `"${topWord}"`;
  });
}

export function copyBullshit() {
  const text = document.getElementById("bs-output").innerText;
  const icon = document.getElementById("copy-icon");
  const copyText = document.getElementById("copy-text");

  navigator.clipboard.writeText(text).then(() => {
    icon.classList.replace("fa-clipboard", "fa-check");
    icon.classList.replace("fa-regular", "fa-solid");
    copyText.classList.remove("opacity-0", "translate-y-1");
    copyText.classList.add("opacity-100", "translate-y-0");
    setTimeout(() => {
      icon.classList.replace("fa-check", "fa-clipboard");
      icon.classList.replace("fa-solid", "fa-regular");
      copyText.classList.remove("opacity-100", "translate-y-0");
      copyText.classList.add("opacity-0", "translate-y-1");
    }, 1500);
  }).catch(err => {
    console.error("Copy failed", err);
  });
}

// Initialize live stats on page load
listenForStats();

// Expose functions for inline HTML event handlers
window.generateBullshit = generateBullshit;
window.copyBullshit = copyBullshit;
