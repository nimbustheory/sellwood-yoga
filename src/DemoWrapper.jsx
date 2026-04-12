import { useState } from "react";
import App from "./App.jsx";
import { DEMO } from "./demo.config.js";
import {
  Calendar, Flame, MessageCircle, Users, CreditCard, CalendarDays,
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
      <aside style={{ width: 340, flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto", padding: "40px 32px", borderRight: "1px solid #e8e4de" }}
        className="demo-sidebar-left demo-hide-scrollbar">
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", color: DEMO.accent, textTransform: "uppercase", marginBottom: 28 }}>Prototype Demo</p>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <img src={DEMO.logoImage} alt="" style={{ width: 52, height: 52, borderRadius: 12, objectFit: "contain", background: "#fff", padding: 2 }}
            onError={e => { e.target.style.display = "none"; }} />
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: "#2a2218", letterSpacing: "0.02em" }}>{DEMO.name}</h1>
            <p style={{ fontSize: 15, color: "#8a8070", margin: 0 }}>{DEMO.subtitle}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {[
            [Calendar, "Class Scheduling", "Weekly schedule with real-time reservations"],
            [Flame, "Practice Tracking", "Reflections, streaks, and milestone badges"],
            [MessageCircle, "Community Feed", "Member milestones and celebrations"],
            [Users, "Teacher Profiles", "Bios, certifications, and specialties"],
            [CreditCard, "Membership Tiers", `${DEMO.membershipCount} plans from intro to unlimited`],
            [CalendarDays, "Events & Workshops", "Special sessions and teacher training"],
            [Bell, "Smart Notifications", "Class reminders and streak alerts"],
            [BarChart3, "Admin Dashboard", "Full analytics, CRM, and broadcast tools"],
          ].map(([Icon, title, desc], i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <Icon size={20} color={DEMO.accent} style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: 16, margin: 0, color: "#2a2218" }}>{title}</p>
                <p style={{ fontSize: 14, color: "#8a8070", margin: "3px 0 0", lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "#b0a898", marginTop: 36, letterSpacing: "0.03em" }}>BUILT BY LUMI -- LUMICLASS.APP</p>
      </aside>

      {/* CENTER PHONE */}
      <div style={{ width: 390, flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,.12), 0 2px 12px rgba(0,0,0,.06)", borderRadius: 0, transform: "translateZ(0)" }}>
        <div style={{ width: "100%", height: "100%", overflow: "hidden" }} id="phone-scroll">
          <App onAdminChange={(admin) => setIsAdmin(admin)} />
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <aside style={{ width: 380, flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto", padding: "40px 28px" }}
        className="demo-sidebar-right demo-hide-scrollbar">
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {[
            [Shield, "Admin Dashboard", "Tap the shield icon in the app header to access the full admin suite -- analytics, member CRM, scheduling, and broadcast tools."],
            [Sparkles, `Built for ${DEMO.fullName}`, `Custom-designed around your brand, class types, teachers, and the welcoming community your members already love.`],
            [MapPin, "All-in-One Platform", "Handles booking, payments, and member management natively -- no third-party software needed."],
            [Smartphone, "Member Engagement", `Practice streaks, milestone badges, community celebrations, and guest passes keep members connected and motivated.`],
            [Palette, "Your Brand, Your App", `Custom-designed with your studio's colors, fonts, and personality -- every pixel reflects the ${DEMO.fullName} brand.`],
          ].map(([Icon, title, desc], i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", border: "1px solid #e8e4de" }}>
              <Icon size={28} color={DEMO.accent} style={{ display: "block", marginBottom: 14 }} />
              <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 10px", color: "#2a2218" }}>{title}</h3>
              <p style={{ fontSize: 15, color: "#6a6050", lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}

          <div style={{ background: DEMO.accent, borderRadius: 16, padding: "28px 24px", color: "#fff", textAlign: "center" }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Ready to Launch?</h3>
            <p style={{ fontSize: 15, opacity: 0.85, lineHeight: 1.5, margin: "0 0 18px" }}>Get your studio's custom loyalty app built and deployed in weeks, not months.</p>
            <button style={{ padding: "12px 28px", borderRadius: 8, border: "2px solid rgba(255,255,255,0.5)", background: "transparent", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              Get Started
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 1200px) {
          .demo-sidebar-right { display: none !important; }
        }
        @media (max-width: 800px) {
          .demo-sidebar-left { display: none !important; }
        }
        .demo-hide-scrollbar::-webkit-scrollbar { display: none; }
        .demo-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
