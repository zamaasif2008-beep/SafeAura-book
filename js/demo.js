(()=>{
const TM = $('#toolModal'), TMB = $('#tm-body'), TMC = $('#tm-close'), RM = $('#regModal'), RF = $('#regFlow');

window.SS_DEMO = {
  openTool(id) {
    const f = SS.films.find(x => x.id === id);
    if (!f) return;
    $('#tm-cat').textContent = f.g.toUpperCase() + ' MODE';
    $('#tm-title').textContent = f.title;
    TMB.innerHTML = '';
    TM.style.display = 'grid';
    renderToolBody(id);
  },
  closeTool() {
    TM.style.display = 'none';
    TMB.innerHTML = '';
  },
  openReg() {
    RM.style.display = 'grid';
    renderRegStep(1);
  },
  closeReg() {
    RM.style.display = 'none';
  }
};

TMC.addEventListener('click', SS_DEMO.closeTool);
$('#btn-open-reg').addEventListener('click', SS_DEMO.openReg);
$('#regClose').addEventListener('click', SS_DEMO.closeReg);

// ==========================================
// REGISTRATION FLOW (Steps 1 to 9 from Doc)
// ==========================================
let regState = {
  aadhaarNumber: '',
  verified: false,
  mode: 'Personal',
  age: 21,
  name: '',
  phone: '',
  address: '',
  contacts: [{name: '', phone: ''}, {name: '', phone: ''}]
};

function renderRegStep(step) {
  if (step === 1) {
    RF.innerHTML = `
      <span class="lbl cob">Step 1 & 2 &middot; Identity Verification</span>
      <h2 class="serif-title">Welcome to Shift Shield</h2>
      <p class="mut-desc">In compliance with Indian data safety guidelines, verification ensures trust in community reports and emergency notifications. Full Aadhaar numbers are never permanently stored.</p>
      
      <div class="form-box">
        <label class="lbl">Aadhaar Card Number (12 Digits)</label>
        <input type="text" id="r-aadhaar" class="inp" placeholder="XXXX XXXX XXXX" maxlength="14" value="5412 8901 2345" />
        <span class="lbl" style="font-size:10px;color:green;">✓ Authorized UIDAI Mock Sandbox Connected</span>
      </div>
      <button class="box go lbl full-btn" id="r-step1-btn">Verify Identity (Aadhaar OTP) &rarr;</button>
    `;
    $('#r-step1-btn').onclick = () => {
      $('#r-step1-btn').textContent = 'Verifying with UIDAI...';
      setTimeout(() => {
        regState.verified = true;
        renderRegStep(2);
      }, 700);
    };
  } else if (step === 2) {
    // Selection screen with two large cards (from Section 2, Step 3)
    RF.innerHTML = `
      <span class="lbl cob">Step 3 &middot; Select Safety Mode</span>
      <h2 class="serif-title">How will you use Shift Shield?</h2>
      <p class="mut-desc">Choose your primary mode. You can switch modes at any time from your profile.</p>
      
      <div class="mode-cards-grid">
        <div class="mode-card ${regState.mode==='Personal'?'active':''}" id="card-personal">
          <div class="mode-badge lbl">INDIVIDUAL</div>
          <h3>Personal Safety</h3>
          <p>For everyday safety—whether you're travelling alone, walking home late, meeting friends, or in unfamiliar locations.</p>
          <ul class="feat-list">
            <li>Live Safety Heatmap</li>
            <li>Consent-based GPS Sharing</li>
            <li>Emergency 4-Tap SOS</li>
            <li>Police & Hospital Map</li>
            <li>Safe Stop Network</li>
          </ul>
          <button class="box lbl full-btn select-btn">Continue with Personal Safety</button>
        </div>

        <div class="mode-card ${regState.mode==='Corporate'?'active':''}" id="card-corporate">
          <div class="mode-badge lbl">EMPLOYEE / HR</div>
          <h3>Corporate / Office Safety</h3>
          <p>For employees travelling during late-night shifts, company cab journeys, and work-related transit.</p>
          <ul class="feat-list">
            <li>Cab & Driver ID Verification</li>
            <li>Route Deviation Alerts</li>
            <li>Pickup & Drop-off Confirmation</li>
            <li>Downloadable Safe Trip PDF</li>
            <li>Employer Transport Oversight</li>
          </ul>
          <button class="box lbl full-btn select-btn">Continue with Corporate Safety</button>
        </div>
      </div>
    `;
    $('#card-personal').onclick = () => { regState.mode = 'Personal'; renderRegStep(3); };
    $('#card-corporate').onclick = () => { regState.mode = 'Corporate'; renderRegStep(3); };
  } else if (step === 3) {
    // Age verification (min 14 years - Step 4)
    RF.innerHTML = `
      <span class="lbl cob">Step 4 &middot; Age Eligibility</span>
      <h2 class="serif-title">Age Verification</h2>
      <p class="mut-desc">Shift Shield requires users to be at least 14 years of age. Users aged 14–17 require guardian notifications.</p>
      
      <div class="form-box">
        <label class="lbl">Enter Your Age (Years)</label>
        <input type="number" id="r-age" class="inp" min="10" max="100" value="${regState.age}" />
        <div id="age-alert" style="display:none;color:#D9452B;margin-top:8px;" class="lbl">Must be at least 14 years old to register.</div>
      </div>
      <button class="box go lbl full-btn" id="r-age-btn">Continue &rarr;</button>
    `;
    $('#r-age-btn').onclick = () => {
      const age = parseInt($('#r-age').value) || 0;
      if (age < 14) {
        $('#age-alert').style.display = 'block';
        return;
      }
      regState.age = age;
      renderRegStep(4);
    };
  } else if (step === 4) {
    // Details + Home Address (Step 6 & 7)
    RF.innerHTML = `
      <span class="lbl cob">Step 5 &middot; Profile & Protected Address</span>
      <h2 class="serif-title">Personal Details</h2>
      <p class="mut-desc">Your home address is treated as strictly confidential. It is encrypted and never shared with employers or public map users.</p>
      
      <div class="form-grid">
        <div class="form-box">
          <label class="lbl">Full Name</label>
          <input type="text" id="r-name" class="inp" value="Priya Nair" />
        </div>
        <div class="form-box">
          <label class="lbl">Mobile Number (For OTP)</label>
          <input type="text" id="r-phone" class="inp" value="+91 98765 12345" />
        </div>
      </div>
      <div class="form-box">
        <label class="lbl">Home Address (Encrypted Emergency Store)</label>
        <textarea id="r-address" class="inp" rows="2">Apartment 3B, Sunshine Residency, Outer Ring Road, Bengaluru, 560103</textarea>
      </div>

      <span class="lbl cob" style="margin-top:14px;display:block;">Trusted Emergency Contacts (Min 2)</span>
      <div class="form-grid">
        <div class="form-box">
          <label class="lbl">Contact 1 Name & Phone</label>
          <input type="text" class="inp" value="Ananya (Sister) - 9876543210" />
        </div>
        <div class="form-box">
          <label class="lbl">Contact 2 Name & Phone</label>
          <input type="text" class="inp" value="Deepak (Father) - 9811122334" />
        </div>
      </div>
      <button class="box go lbl full-btn" id="r-submit-btn">Complete Account & Launch &rarr;</button>
    `;
    $('#r-submit-btn').onclick = () => {
      SS.user.verified = true;
      SS.user.mode = regState.mode;
      const b = $('#btn-active-mode');
      b.style.display = 'inline-flex';
      b.textContent = `${SS.user.mode} Mode Active`;
      $('#btn-open-reg').textContent = 'Profile / Settings';
      SS_DEMO.closeReg();
      alert(`Account verified successfully in ${SS.user.mode} Safety Mode!`);
    };
  }
}

// ==========================================
// 12 HACKATHON INTERACTIVE TOOL SIMULATIONS
// ==========================================
function renderToolBody(id) {
  if (id === 'heatmap') {
    TMB.innerHTML = `
      <div class="tool-view">
        <p class="mut-desc">Real-time risk computed from active street reports, lighting sensors, and nearby 24/7 safe stops.</p>
        <div class="map-sim">
          <div class="zone red-zone" style="top:20%;left:25%;width:140px;height:140px;">
            <span>High Risk Zone<br>Poor Lighting</span>
          </div>
          <div class="zone yellow-zone" style="top:45%;left:55%;width:160px;height:160px;">
            <span>Caution Zone<br>Moderate Reports</span>
          </div>
          <div class="zone green-zone" style="top:15%;left:65%;width:150px;height:150px;">
            <span>Low Risk Area<br>Police Post Active</span>
          </div>
          <div class="user-pin" style="top:48%;left:48%;">YOU</div>
        </div>
        <div class="time-control">
          <label class="lbl">Simulate Time of Day: <b id="time-val">10:45 PM</b></label>
          <input type="range" min="0" max="23" value="22" id="time-slider" class="range-slider" />
        </div>
      </div>
    `;
    $('#time-slider').oninput = e => {
      const hr = e.target.value.padStart(2, '0');
      $('#time-val').textContent = `${hr}:30 ${hr >= 18 || hr < 6 ? 'PM (Night Conditions)' : 'AM (Daylight)'}`;
    };
  } else if (id === 'police') {
    TMB.innerHTML = `
      <div class="tool-view">
        <p class="mut-desc">Vibrant markers showing police stations, women's helplines, and emergency trauma centers.</p>
        <div class="help-grid">
          <div class="help-card police-card">
            <span class="badge red-bg lbl">POLICE STATION (400m)</span>
            <h4>Koramangala 6th Block Police Station</h4>
            <p>80 Feet Road, Near Sony World Signal</p>
            <div class="actions-row">
              <a href="tel:112" class="box lbl go">Call 112 (Direct)</a>
              <button class="box lbl" onclick="alert('Routing directions sent to Maps app.')">Directions</button>
            </div>
          </div>
          <div class="help-card police-card">
            <span class="badge red-bg lbl">WOMEN HELPLINE POST</span>
            <h4>Nirbhaya Safe Transit Booth</h4>
            <p>Metro Pillar 142 &middot; 24/7 Women Officers on Duty</p>
            <div class="actions-row">
              <a href="tel:1091" class="box lbl go">Dial 1091</a>
              <button class="box lbl" onclick="alert('Alerting nearest on-duty patrol officer...')">Notify Booth</button>
            </div>
          </div>
          <div class="help-card">
            <span class="badge blue-bg lbl">HOSPITAL & TRAUMA (1.2 km)</span>
            <h4>St. John's Emergency Hospital</h4>
            <p>Hosur Road &middot; 24/7 Ambulance Fleet</p>
            <div class="actions-row">
              <a href="tel:108" class="box lbl">Call 108</a>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (id === 'gps') {
    TMB.innerHTML = `
      <div class="tool-view">
        <p class="mut-desc">Location is only broadcast when actively initiated by you. You have full control to revoke access.</p>
        <div class="status-panel">
          <div class="status-line"><span class="lbl">Sharing Status:</span> <b id="gps-status" style="color:green;">ACTIVE &middot; BROADCASTING</b></div>
          <div class="status-line"><span class="lbl">Current Coordinates:</span> <code>12.9352° N, 77.6245° E</code></div>
          <div class="status-line"><span class="lbl">Last Refresh:</span> <span id="gps-time">Just now</span></div>
          <div class="status-line"><span class="lbl">Authorized Recipients:</span> <span>3 Trusted Contacts</span></div>
        </div>
        <div style="margin-top:16px;display:flex;gap:10px;">
          <button class="box lbl go" id="btn-toggle-gps">Pause Location Sharing</button>
          <button class="box lbl" onclick="alert('Secure one-time location link copied to clipboard.')">Copy Private Tracking Link</button>
        </div>
      </div>
    `;
    let active = true;
    $('#btn-toggle-gps').onclick = () => {
      active = !active;
      $('#gps-status').textContent = active ? 'ACTIVE · BROADCASTING' : 'OFFLINE · REVOKED';
      $('#gps-status').style.color = active ? 'green' : '#D9452B';
      $('#btn-toggle-gps').textContent = active ? 'Pause Location Sharing' : 'Resume Sharing';
    };
  } else if (id === 'sos') {
    let taps = 0;
    TMB.innerHTML = `
      <div class="tool-view text-center">
        <p class="mut-desc">To prevent accidental triggers, tap the Emergency Button <b>4 to 5 times rapidly</b>.</p>
        <div class="sos-wrapper">
          <button class="sos-btn" id="sos-trigger">
            <span class="lbl" style="font-size:16px;">TAP SOS</span>
            <span id="tap-count">0 / 4 Taps</span>
          </button>
        </div>
        <div class="sos-pipeline" id="sos-log" style="display:none;">
          <div class="pipe-step done">1. GPS Grabbed (12.934° N, 77.621° E)</div>
          <div class="pipe-step done" id="p-queue">2. Event Queued in Cloud Dispatcher</div>
          <div class="pipe-step" id="p-sms">3. Dispatching SMS to 3 Emergency Contacts...</div>
          <div class="pipe-step" id="p-police">4. Transmitting Signal to Nearest Police Dispatch...</div>
        </div>
      </div>
    `;
    const btn = $('#sos-trigger');
    btn.onclick = () => {
      taps++;
      $('#tap-count').textContent = `${taps} / 4 Taps`;
      btn.style.transform = 'scale(0.92)';
      setTimeout(() => btn.style.transform = 'scale(1)', 100);
      if (taps >= 4) {
        btn.classList.add('sos-active');
        btn.innerHTML = `<span class="lbl" style="color:#fff;">ALERT SENT</span>`;
        $('#sos-log').style.display = 'block';
        setTimeout(() => {
          $('#p-sms').classList.add('done');
          $('#p-sms').textContent = '✓ SMS with Live Location Link Delivered to Pooja & Rohan';
        }, 900);
        setTimeout(() => {
          $('#p-police').classList.add('done');
          $('#p-police').textContent = '✓ 112 Control Room Alerted';
        }, 1800);
      }
    };
  } else if (id === 'offline_sos') {
    TMB.innerHTML = `
      <div class="tool-view">
        <p class="mut-desc">Simulate an emergency occurring in a tunnel or area with zero cellular data.</p>
        <div class="status-panel">
          <div class="status-line">
            <span class="lbl">Simulated Internet:</span>
            <b id="net-status" style="color:red;">DISCONNECTED (OFFLINE)</b>
          </div>
          <div class="status-line">
            <span class="lbl">Storage Queue:</span>
            <span id="queue-count">1 Incident Queued in LocalStorage</span>
          </div>
        </div>
        <div style="margin-top:16px;display:flex;gap:10px;">
          <button class="box lbl go" id="btn-reconnect">Simulate Reconnection & Auto-Retry</button>
        </div>
        <div id="retry-log" style="margin-top:14px;font-size:12px;" class="mut">Alert stored on device with exact GPS & timestamp. Waiting for network...</div>
      </div>
    `;
    $('#btn-reconnect').onclick = () => {
      $('#net-status').textContent = 'CONNECTED (4G)';
      $('#net-status').style.color = 'green';
      $('#retry-log').innerHTML = '✓ Connectivity restored!<br>✓ Queued SOS payload sent automatically.<br>✓ Delivery status: <b>Delivered</b>.';
      $('#queue-count').textContent = '0 Queued (All Delivered)';
    };
  } else if (id === 'safe_trip') {
    TMB.innerHTML = `
      <div class="tool-view">
        <p class="mut-desc">Track cab details, log pickups/drop-offs, and generate a verified PDF certificate.</p>
        <div class="trip-card">
          <div class="trip-head">
            <b>Journey #TRIP-9042</b>
            <span class="badge green-bg lbl">DRIVER VERIFIED</span>
          </div>
          <div class="trip-meta">
            <div>Driver: <b>Sunita Verma (Badge #W410)</b></div>
            <div>Vehicle: <b>Toyota Glanza &middot; KA 05 MJ 4412</b></div>
            <div>Route: EcoWorld Tech Park &rarr; Indiranagar</div>
            <div>Status: <b>Drop-Off Confirmed (10:14 PM)</b></div>
          </div>
          <div style="margin-top:16px;">
            <button class="box lbl go" id="btn-gen-pdf">Download Official Safe Trip PDF &darr;</button>
          </div>
        </div>
      </div>
    `;
    $('#btn-gen-pdf').onclick = () => {
      const win = window.open('', '_blank');
      win.document.write(`
        <html><head><title>Shift Shield - Safe Trip Certificate</title></head>
        <body style="font-family:sans-serif;padding:40px;color:#141414;max-width:600px;margin:auto;border:2px solid #141414;">
          <h2 style="margin:0;color:#1F3FB0;">SHIFT SHIELD</h2>
          <p style="font-size:12px;text-transform:uppercase;letter-spacing:2px;">Verified Journey Safety Record</p>
          <hr style="margin:20px 0;">
          <p><b>Certificate ID:</b> SS-CERT-2026-9042</p>
          <p><b>Passenger:</b> Priya Nair</p>
          <p><b>Driver:</b> Sunita Verma (Background Checked)</p>
          <p><b>Vehicle:</b> KA 05 MJ 4412</p>
          <p><b>Pickup Timestamp:</b> 21:42:10 IST</p>
          <p><b>Drop-off Timestamp:</b> 22:14:05 IST</p>
          <p><b>Route Deviations:</b> 0 Detected</p>
          <p><b>Emergency Alerts:</b> None</p>
          <hr style="margin:20px 0;">
          <p style="font-size:11px;color:#666;">Cryptographic Integrity Hash: a7f8e912c9b4e201b1</p>
        </body></html>
      `);
      win.document.close();
      win.print();
    };
  } else if (id === 'employer') {
    TMB.innerHTML = `
      <div class="tool-view">
        <p class="mut-desc">HR and corporate fleet managers monitor travel compliance with aggregated data protection.</p>
        <div class="metrics-row">
          <div class="m-card"><h3>142</h3><span class="lbl">Active Night Trips</span></div>
          <div class="m-card"><h3>99.4%</h3><span class="lbl">Driver Compliance</span></div>
          <div class="m-card"><h3 style="color:#D9452B;">1</h3><span class="lbl">Route Deviation Flag</span></div>
        </div>
        <table class="corp-table">
          <thead>
            <tr><th>Trip ID</th><th>Vehicle</th><th>Pickup</th><th>Drop-off</th><th>Compliance</th></tr>
          </thead>
          <tbody>
            <tr><td>#TR-102</td><td>KA 01 EK 8812</td><td>10:00 PM</td><td>10:35 PM</td><td><span class="badge green-bg lbl">Verified Safe</span></td></tr>
            <tr><td>#TR-103</td><td>KA 04 MM 2910</td><td>10:15 PM</td><td>In Transit</td><td><span class="badge blue-bg lbl">On Track</span></td></tr>
            <tr><td>#TR-104</td><td>KA 05 AB 1102</td><td>10:20 PM</td><td>In Transit</td><td><span class="badge red-bg lbl">Deviation Flag</span></td></tr>
          </tbody>
        </table>
      </div>
    `;
  } else if (id === 'drivers') {
    TMB.innerHTML = `
      <div class="tool-view">
        <p class="mut-desc">Connecting corporate partners and women commuters with verified, trained women drivers.</p>
        <div class="help-grid">
          <div class="help-card">
            <span class="badge green-bg lbl">AVAILABLE NOW</span>
            <h4>Radha Devi</h4>
            <p>EV Shuttle &middot; Rating: ★ 4.98 (340 Trips)</p>
            <p class="mut">Service Zone: Whitefield / Marathahalli</p>
            <button class="box lbl go" style="margin-top:8px;" onclick="alert('Booking request sent to Transport Partner.')">Book Fleet Commute</button>
          </div>
          <div class="help-card">
            <span class="badge green-bg lbl">AVAILABLE NOW</span>
            <h4>Shabana Anjum</h4>
            <p>Hatchback &middot; Rating: ★ 4.95 (512 Trips)</p>
            <p class="mut">Service Zone: Electronic City / BTM</p>
            <button class="box lbl go" style="margin-top:8px;" onclick="alert('Booking request sent to Transport Partner.')">Book Fleet Commute</button>
          </div>
        </div>
      </div>
    `;
  } else if (id === 'safe_stops') {
    TMB.innerHTML = `
      <div class="tool-view">
        <p class="mut-desc">Verified physical sanctuaries where staff are trained to provide support and call authorities.</p>
        <div class="help-grid">
          <div class="help-card">
            <span class="badge green-bg lbl">OPEN 24/7 &middot; SAFE STOP</span>
            <h4>Apollo 24/7 Pharmacy</h4>
            <p>100 Feet Road, Indiranagar &middot; CCTV Monitored</p>
            <p class="mut">Assistance: First Aid, Safe Waiting Area, Direct Phone to 112</p>
          </div>
          <div class="help-card">
            <span class="badge green-bg lbl">OPEN 24/7 &middot; SAFE STOP</span>
            <h4>Indian Oil All-Night Station</h4>
            <p>Inner Ring Road &middot; Well-lit Forecourt with Security</p>
            <p class="mut">Assistance: Emergency Phone, Guard on Duty</p>
          </div>
        </div>
      </div>
    `;
  } else if (id === 'reports') {
    TMB.innerHTML = `
      <div class="tool-view">
        <p class="mut-desc">Submit reports about dark alleys, broken streetlights, or unsafe walkways.</p>
        <div class="form-box">
          <label class="lbl">Hazard Category</label>
          <select id="rep-cat" class="inp">
            <option>Broken Streetlights / Zero Lighting</option>
            <option>Deserted / Unmonitored Alley</option>
            <option>Harassment Hotspot</option>
            <option>Damaged Sidewalk / No Escape Path</option>
          </select>
        </div>
        <div class="form-box">
          <label class="lbl">Location</label>
          <input type="text" class="inp" id="rep-loc" value="5th Main, 7th Cross, HSR Layout Sector 4" />
        </div>
        <div class="form-box">
          <label class="lbl">Photo Evidence (Optional Mock)</label>
          <input type="file" class="inp" />
        </div>
        <button class="box lbl go" id="btn-submit-rep">Submit Report for Review &rarr;</button>
        <div id="rep-feedback" style="display:none;margin-top:12px;color:green;" class="lbl">✓ Report received with Reference #REF-8492. Marked 'Under Review'.</div>
      </div>
    `;
    $('#btn-submit-rep').onclick = () => {
      $('#rep-feedback').style.display = 'block';
    };
  } else if (id === 'issues') {
    TMB.innerHTML = `
      <div class="tool-view">
        <p class="mut-desc">Track civic and community safety reports as they progress toward repair.</p>
        <div style="display:flex;gap:8px;margin-bottom:14px;">
          <input type="text" class="inp" value="REF-8492" style="max-width:180px;" />
          <button class="box lbl">Search Ticket</button>
        </div>
        <div class="status-panel">
          <div class="status-line"><b>Ticket #REF-8492</b> <span class="badge blue-bg lbl">IN PROGRESS</span></div>
          <p>Issue: 4 Broken Streetlights on 14th Main Road</p>
          <div class="timeline">
            <div class="tl-item done">✓ Report Received & Verified by 3 Community Members</div>
            <div class="tl-item done">✓ Referred to Municipal Corporation (BBMP Electrical Dept)</div>
            <div class="tl-item active">⏳ Work Order Dispatched for Streetlight Replacement</div>
            <div class="tl-item">○ Final Inspection & Resolution</div>
          </div>
        </div>
      </div>
    `;
  } else if (id === 'privacy') {
    TMB.innerHTML = `
      <div class="tool-view">
        <p class="mut-desc">Manage your data protections under India's Digital Personal Data Protection standards.</p>
        <div class="status-panel">
          <div class="status-line"><span class="lbl">Aadhaar Tokenization:</span> <b style="color:green;">ACTIVE (No Raw Aadhaar Kept)</b></div>
          <div class="status-line"><span class="lbl">Home Address Privacy:</span> <b>LOCKED (Hidden from Employers)</b></div>
          <div class="status-line"><span class="lbl">Location Logs:</span> <b>Auto-purge every 72 hours</b></div>
        </div>
        <div style="margin-top:16px;display:flex;gap:10px;">
          <button class="box lbl" onclick="alert('All temporary location history cleared immediately.')">Wipe Local Coordinates</button>
          <button class="box lbl go" onclick="alert('Audit export generated and sent to registered email.')">Download Access Audit Log</button>
        </div>
      </div>
    `;
  }
}
})();