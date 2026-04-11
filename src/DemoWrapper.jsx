import { useState } from "react";
import App from "./App.jsx";
import { DEMO } from "./demo.config.js";
import {
  Calendar, Flame, MessageCircle, User, CreditCard, CalendarDays,
  Bell, BarChart3, Shield, Sparkles, MapPin, Smartphone, Palette
} from "lucide-react";

export default function DemoWrapper() {
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin mode: full browser, no phone frame or sidebars
  if (isAdmin) {
    return <App initialAdmin={true} onAdminChange={(admin) => setIsAdmin(admin)} />;
  }

  // Consumer mode: phone mockup with sidebars
  return (
    <div style={{ display: "flex", justifyContent: "center", minHeight: "100vh", background: "#f5f3f0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* LEFT SIDEBAR */}
      <aside style={{ width: 320, flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto", padding: "32px 28px", borderRight: "1px solid #e8e4de" }}
        className="demo-sidebar-left demo-hide-scrollbar">
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: DEMO.accent, textTransform: "uppercase", marginBottom: 24 }}>Prototype Demo</p>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <img src={DEMO.logoImage} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "contain", background: "#fff", padding: 2 }}
            onError={e => { e.target.style.display = "none"; }} />
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "#2a2218", letterSpacing: "0.02em" }}>{DEMO.name}</h1>
            <p style={{ fontSize: 13, color: "#8a8070", margin: 0 }}>{DEMO.subtitle}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            [Calendar, "Class Scheduling", "Weekly schedule with real-time reservations"],
            [Flame, "Practice Tracking", "Reflections, streaks, and milestone badges"],
            [MessageCircle, "Community Feed", "Member milestones and celebrations"],
            [User, "Teacher Profiles", "Bios, certifications, and specialties"],
            [CreditCard, "Membership Tiers", `${DEMO.membershipCount} plans from intro to unlimited`],
            [CalendarDays, "Events & Workshops", "Special sessions and teacher training"],
            [Bell, "Smart Notifications", "Class reminders and streak alerts"],
            [BarChart3, "Admin Dashboard", "Full analytics, CRM, and broadcast tools"],
          ].map(([Icon, title, desc], i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Icon size={16} color={DEMO.accent} style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: "#2a2218" }}>{title}</p>
                <p style={{ fontSize: 12.5, color: "#8a8070", margin: "2px 0 0", lineHeight: 1.4 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11, color: "#b0a898", marginTop: 32, letterSpacing: "0.03em" }}>BUILT BY LUMI -- LUMICLASS.APP</p>
      </aside>

      {/* CENTER PHONE */}
      <div style={{ width: 390, flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,.12), 0 2px 12px rgba(0,0,0,.06)", borderRadius: 0, transform: "translateZ(0)" }}>
        <div style={{ width: "100%", height: "100%", overflow: "auto" }} className="demo-hide-scrollbar" id="phone-scroll">
          <App onAdminChange={(admin) => setIsAdmin(admin)} />
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <aside style={{ width: 340, flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto", padding: "32px 24px" }}
        className="demo-sidebar-right demo-hide-scrollbar">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            [Shield, "Admin Dashboard", "Tap the shield icon in the app header to access the full admin suite -- analytics, member CRM, scheduling, and broadcast tools."],
            [Sparkles, `Built for ${DEMO.fullName}`, `Custom-designed around your brand, class types, teachers, and the welcoming community your members already love.`],
            [MapPin, "All-in-One Platform", "Handles booking, payments, and member management natively -- no third-party software needed."],
            [Smartphone, "Member Engagement", `Practice tracking, streaks, milestone badges, and a community feed keep your ${DEMO.teacherCount} teachers and members connected beyond the studio.`],
            [Palette, "Your Brand, Your App", "Your brand, your colors, your identity. No generic fitness app branding -- this feels like yours because it is."],
          ].map(([Icon, title, desc], i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "22px 20px", border: "1px solid #e8e4de" }}>
              <Icon size={20} color={DEMO.accent} style={{ display: "block", marginBottom: 10 }} />
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px", color: "#2a2218" }}>{title}</h3>
              <p style={{ fontSize: 13, color: "#6a6050", lineHeight: 1.55, margin: 0 }}>{desc}</p>
            </div>
          ))}

          <div style={{ background: DEMO.accent, borderRadius: 14, padding: "22px 20px", color: "#fff", textAlign: "center" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>Ready to Launch?</h3>
            <p style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.5, margin: "0 0 14px" }}>Get a custom loyalty app built for your studio in under a week.</p>
            <button style={{ padding: "10px 24px", borderRadius: 8, border: "2px solid rgba(255,255,255,0.5)", background: "transparent", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Contact Us
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 1100px) {
          .demo-sidebar-left, .demo-sidebar-right { display: none !important; }
        }
        .demo-hide-scrollbar::-webkit-scrollbar { display: none; }
        .demo-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
