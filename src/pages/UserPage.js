/* eslint-disable react/prop-types */
// src/pages/UserPage.js
import React, { useMemo, useState } from "react";
import { useUser } from "../context/UserContext";
import { supabase } from "../utils/supabaseClient";
import {
  User,
  ShieldCheck,
  Monitor,
  Users,
  LogOut,
  Lock,
  KeyRound,
  Globe,
  Languages,
  PlayCircle,
  CheckCircle2,
  XCircle,
  PenLine,
  Plus,
  Trash2,
  Star,
} from "lucide-react";

const menu = [
  { label: "General", icon: <User size={22} />, key: "general" },
  { label: "Security", icon: <ShieldCheck size={22} />, key: "security" },
  { label: "Devices", icon: <Monitor size={22} />, key: "devices" },
  { label: "Profiles", icon: <Users size={22} />, key: "profiles" },
];

export default function UserPage() {
  const {
    user,
    profiles,
    activeProfile,
    setActiveProfile,
    addProfile,
    editProfile,
    deleteProfile,
    refreshProfiles,
    reloadProfiles,
  } = useUser();

  const [active, setActive] = useState("general");
  const [busy, setBusy] = useState(false);
  // Inline page message (no toasts)
  const [message, setMessage] = useState(null); // { type: 'ok'|'error'|'info', text: string }

  // ✅ IMPORTANT: Hook-urile trebuie să fie mereu “la același nivel”.
  // Mutăm useMemo ÎNAINTE de return-ul condițional.
  const createdAt = useMemo(() => {
    try {
      const ts = user?.created_at;
      return ts ? new Date(ts).toLocaleString() : "–";
    } catch {
      return "–";
    }
  }, [user?.created_at]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
        <div className="text-white text-center text-2xl font-bold bg-zinc-900/70 px-8 py-10 rounded-2xl shadow-xl border border-zinc-800/70 backdrop-blur-xl">
          You must be signed in to view this page.
        </div>
      </div>
    );
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.username ||
    user.email;

  const avatarSrc =
    user.user_metadata?.avatar_url ||
    `https://i.pravatar.cc/150?u=${user.id || user.email}`;

  const planName =
    user.user_metadata?.plan_name || user.app_metadata?.plan || "Free";
  const subStatus = user.user_metadata?.subscription_status || "inactive";
  const nextBilling = user.user_metadata?.next_billing_at || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#151820] via-[#13151b] to-[#181b23] flex flex-col items-center px-2 py-10">
      <div className="w-full max-w-6xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-2xl shadow-2xl rounded-3xl px-4 py-6 md:px-10 md:py-10 flex flex-col md:flex-row gap-10 transition">
        {/* Left menu */}
        <aside className="flex flex-col items-center md:items-start gap-8 md:min-w-[240px]">
          <div className="relative group">
            <div className="absolute -inset-2 blur-xl bg-cyan-400/20 rounded-full pointer-events-none group-hover:scale-110 group-hover:opacity-80 transition-all duration-300"></div>
            <img
              src={avatarSrc}
              alt={displayName}
              className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-cyan-400 shadow-xl bg-zinc-900 transition-transform group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "/default-avatar.png";
              }}
            />
          </div>
          <div className="text-center md:text-left max-w-[220px]">
            <div className="text-white text-xl font-extrabold truncate" title={displayName}>
              {displayName}
            </div>
            <div className="text-zinc-400 text-sm break-words">{user.email}</div>
          </div>

          <nav className="w-full flex flex-col gap-2 mt-2">
            {menu.map((item) => (
              <button
                key={item.key}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-base w-full transition-all text-left
                  ${
                    active === item.key
                      ? "bg-cyan-500/90 text-white shadow ring-2 ring-cyan-400"
                      : "bg-zinc-800/60 text-zinc-300 hover:bg-cyan-900/40 hover:text-cyan-300"
                  }`}
                onClick={() => setActive(item.key)}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-4 w-full">
            <PlanBadge planName={planName} subStatus={subStatus} />
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 w-full">
          <div className="bg-zinc-900/70 rounded-2xl border border-zinc-800/60 px-6 md:px-8 py-8 shadow-xl backdrop-blur-md flex flex-col gap-6">
            <h2 className="text-2xl font-extrabold text-cyan-300 mb-2 drop-shadow-xl">
              {active === "general" && "Account details"}
              {active === "security" && "Security"}
              {active === "devices" && "Devices"}
              {active === "profiles" && "Profiles"}
            </h2>

            {/* Inline message banner */}
            {message && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm font-medium break-words ${
                  message.type === "error"
                    ? "bg-red-500/15 text-red-300 border-red-400/30"
                    : message.type === "ok"
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/30"
                    : "bg-zinc-700/30 text-zinc-200 border-zinc-600/40"
                }`}
              >
                {message.text}
              </div>
            )}

            {active === "general" && (
              <SectionGeneral
                planName={planName}
                subStatus={subStatus}
                nextBilling={nextBilling}
                createdAt={createdAt}
                onOpenStripePortal={async () => {
                  const portalUrl =
                    user.user_metadata?.stripe_portal_url ||
                    user.user_metadata?.billing_portal_url;
                  if (portalUrl) {
                    window.location.href = portalUrl;
                  } else {
                    setMessage({
                      type: "error",
                      text: "Billing portal link is not configured for this account.",
                    });
                  }
                }}
                onChangePlan={() =>
                  setMessage({
                    type: "info",
                    text: "Plan changes are handled in the Stripe billing portal.",
                  })
                }
              />
            )}

            {active === "security" && (
              <SectionSecurity
                busy={busy}
                onGlobalSignOut={async () => {
                  try {
                    setBusy(true);
                    await supabase.auth.signOut({ scope: "global" });
                    window.location.assign("/login");
                  } catch {
                    setMessage({
                      type: "error",
                      text: "Failed to sign out from all devices.",
                    });
                  } finally {
                    setBusy(false);
                  }
                }}
                onPasswordChange={async (newPassword) => {
                  try {
                    setBusy(true);
                    const { error } = await supabase.auth.updateUser({
                      password: newPassword,
                    });
                    if (error) throw error;
                    setMessage({ type: "ok", text: "Password updated." });
                  } catch (e) {
                    setMessage({
                      type: "error",
                      text: e?.message || "Could not change password.",
                    });
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            )}

            {active === "devices" && (
              <SectionDevices
                user={user}
                onSignOutHere={async () => {
                  try {
                    await supabase.auth.signOut();
                    window.location.assign("/login");
                  } catch {
                    setMessage({
                      type: "error",
                      text: "Failed to sign out from this device.",
                    });
                  }
                }}
              />
            )}

            {active === "profiles" && (
              <SectionProfiles
                profiles={profiles || []}
                activeProfile={activeProfile || null}
                onSetActive={async (p) => {
                  try {
                    setActiveProfile && setActiveProfile(p);
                    setMessage({
                      type: "ok",
                      text: `Active profile set to ${p?.name || "selected"}.`,
                    });
                  } catch {
                    setMessage({
                      type: "error",
                      text: "Could not set the active profile.",
                    });
                  }
                }}
                onAdd={async (payload) => {
                  try {
                    if (addProfile) {
                      await addProfile(payload);
                    } else {
                      await supabase.from("profiles").insert(payload);
                    }
                    (refreshProfiles || reloadProfiles) &&
                      (await (refreshProfiles || reloadProfiles)());
                    setMessage({ type: "ok", text: "Profile created." });
                  } catch (e) {
                    setMessage({
                      type: "error",
                      text: e?.message || "Failed to create profile.",
                    });
                  }
                }}
                onEdit={async (id, payload) => {
                  try {
                    if (editProfile) {
                      await editProfile(id, payload);
                    } else {
                      await supabase.from("profiles").update(payload).eq("id", id);
                    }
                    (refreshProfiles || reloadProfiles) &&
                      (await (refreshProfiles || reloadProfiles)());
                    setMessage({ type: "ok", text: "Profile updated." });
                  } catch (e) {
                    setMessage({
                      type: "error",
                      text: e?.message || "Failed to update profile.",
                    });
                  }
                }}
                onDelete={async (id) => {
                  try {
                    if (deleteProfile) {
                      await deleteProfile(id);
                    } else {
                      await supabase.from("profiles").delete().eq("id", id);
                    }
                    (refreshProfiles || reloadProfiles) &&
                      (await (refreshProfiles || reloadProfiles)());
                    setMessage({ type: "ok", text: "Profile deleted." });
                  } catch (e) {
                    setMessage({
                      type: "error",
                      text: e?.message || "Failed to delete profile.",
                    });
                  }
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------------- Sub-components ---------------- */

function PlanBadge({ planName, subStatus }) {
  const statusChip =
    subStatus === "active" ? (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
        <CheckCircle2 size={14} /> Active
      </span>
    ) : subStatus === "past_due" ? (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-500/15 text-amber-300 border border-amber-400/30">
        <XCircle size={14} /> Past due
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-zinc-600/20 text-zinc-300 border border-zinc-500/40">
        <XCircle size={14} /> Inactive
      </span>
    );

  return (
    <div className="bg-zinc-800/60 border border-zinc-700/70 rounded-2xl px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <Star size={18} className="text-cyan-300 shrink-0" />
        <div className="text-zinc-200 font-semibold truncate">
          Plan: <span className="text-white">{planName}</span>
        </div>
      </div>
      <div className="shrink-0">{statusChip}</div>
    </div>
  );
}

function SectionGeneral({
  planName,
  subStatus,
  nextBilling,
  createdAt,
  onOpenStripePortal,
  onChangePlan,
}) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-2xl p-5">
        <div className="text-zinc-400 text-sm">Subscription</div>
        <div className="mt-2 text-white font-bold text-xl break-words">{planName}</div>
        <div className="mt-1 text-sm">
          Status:{" "}
          <span
            className={`font-semibold ${
              subStatus === "active"
                ? "text-emerald-400"
                : subStatus === "past_due"
                ? "text-amber-400"
                : "text-zinc-300"
            }`}
          >
            {subStatus}
          </span>
        </div>
        <div className="mt-1 text-sm text-zinc-300">
          Next billing:{" "}
          <span className="text-cyan-300">
            {nextBilling ? new Date(nextBilling).toLocaleString() : "—"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={onChangePlan}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold shadow"
          >
            Change plan
          </button>
          <button
            onClick={onOpenStripePortal}
            className="px-4 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-semibold shadow"
          >
            Open billing portal
          </button>
        </div>
      </div>

      <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-2xl p-5">
        <div className="text-zinc-400 text-sm">Preferences</div>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <PrefItem icon={<Languages size={18} />} label="UI language" value="English" />
          <PrefItem icon={<Globe size={18} />} label="Default subtitles" value="English" />
          <PrefItem icon={<PlayCircle size={18} />} label="Autoplay" value="On" />
        </div>
        <div className="mt-5 text-sm text-zinc-400">
          Account created: <span className="text-zinc-200">{createdAt}</span>
        </div>
      </div>
    </div>
  );
}

function PrefItem({ icon, label, value }) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-xl p-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-zinc-300 min-w-0">
        <span className="shrink-0">{icon}</span>
        <span className="truncate" title={label}>
          {label}
        </span>
      </div>
      <div className="text-white font-semibold truncate max-w-[50%] text-right" title={value}>
        {value}
      </div>
    </div>
  );
}

function SectionSecurity({ busy, onPasswordChange, onGlobalSignOut }) {
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const canSubmit = pwd.length >= 8 && pwd === pwd2;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-zinc-300">
          <KeyRound size={18} />
          <div className="font-semibold">Change password</div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-zinc-400">New password</label>
            <input
              type="password"
              className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-900/60 border border-zinc-700/60 text-white outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="At least 8 characters"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-zinc-400">Confirm password</label>
            <input
              type="password"
              className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-900/60 border border-zinc-700/60 text-white outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Repeat password"
              value={pwd2}
              onChange={(e) => setPwd2(e.target.value)}
            />
          </div>

          <button
            disabled={!canSubmit || busy}
            onClick={() => onPasswordChange(pwd)}
            className={`mt-2 px-4 py-2 rounded-xl text-white font-semibold shadow ${
              canSubmit ? "bg-cyan-500 hover:bg-cyan-400" : "bg-zinc-700 cursor-not-allowed"
            }`}
          >
            {busy ? "Saving..." : "Update password"}
          </button>
        </div>
      </div>

      <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-zinc-300">
          <Lock size={18} />
          <div className="font-semibold">Sessions & Sign-out</div>
        </div>
        <div className="mt-4 text-sm text-zinc-300">
          For security, you can sign out from all devices where you are logged in.
        </div>
        <button
          disabled={busy}
          onClick={onGlobalSignOut}
          className="mt-4 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow inline-flex items-center gap-2"
        >
          <LogOut size={18} />
          Sign out from all devices
        </button>

        <div className="mt-6 text-zinc-400 text-sm">
          2FA (TOTP) — coming soon. (If you enable MFA in Supabase, add enroll/verify here.)
        </div>
      </div>
    </div>
  );
}

function SectionDevices({ user, onSignOutHere }) {
  const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "—";

  const ua = navigator.userAgent || "";
  const approxDevice = useMemo(() => {
    if (/Android/i.test(ua)) return "Android";
    if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
    if (/Windows/i.test(ua)) return "Windows";
    if (/Mac OS X/i.test(ua)) return "macOS";
    if (/Linux/i.test(ua)) return "Linux";
    return "Browser";
  }, [ua]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-2xl p-5">
        <div className="text-zinc-300 font-semibold">Current session</div>
        <div className="mt-3 grid md:grid-cols-3 gap-4">
          <DeviceCard title="Device" value={approxDevice} sub={ua.slice(0, 140) + (ua.length > 140 ? "..." : "")} />
          <DeviceCard title="Last sign-in" value={lastSignIn} />
          <DeviceCard title="IP address (approx.)" value="—" sub="For precise IP, log it in backend." />
        </div>

        <div className="mt-5">
          <button
            onClick={onSignOutHere}
            className="px-4 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-semibold shadow inline-flex items-center gap-2"
          >
            <LogOut size={18} />
            Sign out on this device
          </button>
        </div>
      </div>

      <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-2xl p-5">
        <div className="text-zinc-300 font-semibold">Other devices</div>
        <div className="mt-3 text-sm text-zinc-400">
          Showing historical devices requires server-side logs (e.g., auth events with IP and user agent). You can populate
          a table like <code>auth_events</code> and list them here.
        </div>
      </div>
    </div>
  );
}

function DeviceCard({ title, value, sub }) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-xl p-4 min-w-0">
      <div className="text-zinc-400 text-xs truncate" title={title}>{title}</div>
      <div className="text-white font-semibold mt-1 break-words">{value}</div>
      {sub && <div className="text-zinc-500 text-xs mt-1 break-words">{sub}</div>}
    </div>
  );
}

function SectionProfiles({ profiles, activeProfile, onSetActive, onAdd, onEdit, onDelete }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", avatar_url: "", is_kids: false, language: "en" });
  const [editId, setEditId] = useState(null);

  const resetForm = () => setForm({ name: "", avatar_url: "", is_kids: false, language: "en" });

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {profiles.map((p) => {
          const isActive = activeProfile?.id === p.id;
          return (
            <div
              key={p.id}
              className={`rounded-2xl border p-4 bg-zinc-800/50 ${isActive ? "border-cyan-400" : "border-zinc-700/60"}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={p.avatar_url || `https://i.pravatar.cc/150?u=${p.id}`}
                  alt={p.name}
                  className="w-14 h-14 rounded-xl object-cover border border-zinc-700 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-white font-bold truncate" title={p.name}>{p.name}</div>
                  <div className="text-xs text-zinc-400">
                    {p.is_kids ? "Kids" : "Standard"} • {(p.language || "en").toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => onSetActive(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                    isActive
                      ? "bg-cyan-600 text-white border-cyan-500"
                      : "bg-zinc-900/60 text-zinc-200 border-zinc-700 hover:bg-zinc-800"
                  }`}
                >
                  Set active
                </button>
                <button
                  onClick={() => {
                    setEditId(p.id);
                    setForm({
                      name: p.name || "",
                      avatar_url: p.avatar_url || "",
                      is_kids: !!p.is_kids,
                      language: p.language || "en",
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold border bg-zinc-900/60 text-zinc-200 border-zinc-700 hover:bg-zinc-800 inline-flex items-center gap-1.5"
                >
                  <PenLine size={14} /> Edit
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold border bg-rose-600/90 text-white border-rose-500 hover:bg-rose-500 inline-flex items-center gap-1.5"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          );
        })}

        {/* Add card */}
        <button
          onClick={() => {
            setAdding(true);
            setEditId(null);
            resetForm();
          }}
          className="rounded-2xl border border-dashed border-zinc-600 p-4 bg-zinc-800/30 hover:bg-zinc-800/50 flex items-center justify-center text-zinc-300 hover:text-cyan-300 transition"
        >
          <Plus size={18} className="mr-2" /> Add profile
        </button>
      </div>

      {(adding || editId) && (
        <div className="bg-zinc-800/60 border border-zinc-700/60 rounded-2xl p-5">
          <div className="text-zinc-300 font-semibold">{editId ? "Edit profile" : "Create profile"}</div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm text-zinc-400">Name</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-900/60 border border-zinc-700/60 text-white outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                placeholder="e.g. Alex"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Avatar URL (optional)</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-900/60 border border-zinc-700/60 text-white outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.avatar_url}
                onChange={(e) => setForm((s) => ({ ...s, avatar_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Language</label>
              <select
                className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-900/60 border border-zinc-700/60 text-white outline-none focus:ring-2 focus:ring-cyan-400"
                value={form.language}
                onChange={(e) => setForm((s) => ({ ...s, language: e.target.value }))}
              >
                <option value="en">English</option>
                <option value="ro">Română</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input
                id="kids"
                type="checkbox"
                checked={form.is_kids}
                onChange={(e) => setForm((s) => ({ ...s, is_kids: e.target.checked }))}
                className="w-4 h-4 accent-cyan-400"
              />
              <label htmlFor="kids" className="text-sm text-zinc-300">Kids</label>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {!editId ? (
              <button
                onClick={() => {
                  if (!form.name.trim()) return;
                  onAdd({
                    name: form.name.trim(),
                    avatar_url: form.avatar_url || null,
                    is_kids: !!form.is_kids,
                    language: form.language || "en",
                  });
                  setAdding(false);
                  resetForm();
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow"
              >
                Create
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!form.name.trim()) return;
                  onEdit(editId, {
                    name: form.name.trim(),
                    avatar_url: form.avatar_url || null,
                    is_kids: !!form.is_kids,
                    language: form.language || "en",
                  });
                  setEditId(null);
                  resetForm();
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow"
              >
                Save
              </button>
            )}
            <button
              onClick={() => {
                setAdding(false);
                setEditId(null);
                resetForm();
              }}
              className="px-4 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-semibold shadow"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
