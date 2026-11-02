const $=s=>document.querySelector(s);

window.SS = {
  // Current user session data
  user: {
    verified: false,
    mode: 'Personal', // 'Personal' or 'Corporate'
    name: 'Ananya Sharma',
    age: 23,
    address: 'Flat 402, Lotus Heights, Bengaluru, KA',
    contacts: [
      { name: 'Pooja (Sister)', phone: '+91 98765 43210' },
      { name: 'Kavita (Mother)', phone: '+91 98111 22334' },
      { name: 'Rohan (Friend)', phone: '+91 99000 88776' }
    ]
  },
  films: [
    {
      id: "heatmap",
      title: "Live Safety Heatmap",
      sub: "Heatmap / Estimated risk",
      g: "Personal",
      desc: "Green (low risk), yellow (caution) and red (elevated risk) zones based on real-time community reports, street lighting, open shops and time of day.",
      note: "An estimate from available reports. Green is not a guarantee of absolute safety."
    },
    {
      id: "police",
      title: "Police & Help Map",
      sub: "Stations / Hospitals / Safe Stops",
      g: "Personal",
      desc: "Vibrant distinctive markers highlighting verified Police Stations with phone numbers, distances, and one-tap SOS dispatch, plus 24/7 hospitals.",
      note: "Information is curated from verified local police directories and updated regularly."
    },
    {
      id: "gps",
      title: "GPS Sharing",
      sub: "Consent-based location",
      g: "Personal",
      desc: "Share your latest real-time coordinates with your 2–4 emergency contacts during an active journey or SOS. Stop sharing with one tap.",
      note: "Browsers cannot track continuously when closed; location updates require user permission."
    },
    {
      id: "sos",
      title: "Emergency SOS",
      sub: "Tap 4 to 5 times",
      g: "Personal",
      desc: "Tap the SOS button 4 to 5 times rapidly. Logs the incident, grabs GPS, and dispatches automated SMS alerts to your emergency contacts.",
      note: "Shows live status pipeline: Queued &rarr; Attempted &rarr; Delivered &rarr; Acknowledged."
    },
    {
      id: "offline_sos",
      title: "Low-Connectivity SOS",
      sub: "Queue / Retry / Fallback",
      g: "Personal",
      desc: "If cellular data is lost, emergency alerts and GPS timestamps are safely queued on-device in LocalStorage and retried automatically once connected.",
      note: "If no connection and no SMS fallback exists, real-time dispatch cannot be guaranteed."
    },
    {
      id: "safe_trip",
      title: "Verified Safe Trip",
      sub: "Journey record / PDF certificate",
      g: "Corporate",
      desc: "Pre-ride cab & driver verification, pickup confirmation, route deviation detection, and one-click downloadable PDF safety certificate upon drop-off.",
      note: "Certificates provide a documented record of journey events and cryptographic audit trail."
    },
    {
      id: "employer",
      title: "Employer Dashboard",
      sub: "Transport oversight & compliance",
      g: "Corporate",
      desc: "For HR & Transport teams to monitor late-night employee trips, verify driver compliance, review route deviations, and export monthly safety audits.",
      note: "Employers never receive unrestricted access to personal location histories."
    },
    {
      id: "drivers",
      title: "Women Drivers",
      sub: "Verified local drivers",
      g: "Corporate",
      desc: "Discover vetted, background-checked women cab and shuttle drivers with service areas, availability, and direct booking links.",
      note: "Driver availability depends on regional transport partnerships and fleet integrations."
    },
    {
      id: "safe_stops",
      title: "Safe Stop Network",
      sub: "Community assistance spots",
      g: "Community",
      desc: "Verified pharmacies, 24/7 petrol stations, and retail stores where women can wait safely and request immediate assistance.",
      note: "A Safe Stop is a verified community haven, not an armed emergency service."
    },
    {
      id: "reports",
      title: "Community Reports",
      sub: "Report dark & unsafe streets",
      g: "Community",
      desc: "Report broken streetlights, poorly lit paths, or deserted walkways with GPS tag, photo, and classification (Unverified, Under Review, Verified).",
      note: "Validated community reports directly update the Live Safety Heatmap risk ratings."
    },
    {
      id: "issues",
      title: "Issue Tracking",
      sub: "From report to authority repair",
      g: "Community",
      desc: "Repeated safety concerns are grouped into trackable civic tickets with reference numbers, tracking status from 'Received' to 'Resolved'.",
      note: "Tracks referrals to civic bodies, though civic authority action timeframes vary."
    },
    {
      id: "privacy",
      title: "Privacy & Control",
      sub: "Aadhaar minimization & address locks",
      g: "Community",
      desc: "Strict data minimization: tokenized Aadhaar verification, zero storage of full Aadhaar IDs, locked home address privacy, and data wipe.",
      note: "Designed in compliance with India's Digital Personal Data Protection (DPDP) Act."
    }
  ]
};