(function () {
  // Create floating button with Helix Engage styling
  const button = document.createElement("button");
  button.innerText = "Help";
  Object.assign(button.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    padding: "12px 20px",
    backgroundColor: "rgb(32, 96, 160)", // --color-brand-600
    color: "rgb(255, 255, 255)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    zIndex: "10000",
    fontFamily: "'Satoshi', -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0px 1px 3px rgba(10, 13, 18, 0.1), 0px 1px 2px -1px rgba(10, 13, 18, 0.1), 0px 0px 0px 1px rgba(10, 13, 18, 0.18) inset, 0px -2px 0px 0px rgba(10, 13, 18, 0.05) inset",
    transition: "all 0.1s ease-linear",
  });
  
  button.addEventListener("mouseenter", function() {
    button.style.backgroundColor = "rgb(24, 76, 132)"; // --color-brand-700
  });
  
  button.addEventListener("mouseleave", function() {
    button.style.backgroundColor = "rgb(32, 96, 160)"; // --color-brand-600
  });

  // Create modal overlay
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(10, 13, 18, 0.6)", // --color-bg-overlay with opacity
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "9999",
    backdropFilter: "blur(4px)",
  });

  // Modal content container
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    backgroundColor: "rgb(255, 255, 255)", // --color-bg-primary
    padding: "32px",
    borderRadius: "12px",
    width: "420px",
    maxWidth: "90%",
    boxSizing: "border-box",
    position: "relative",
    boxShadow: "0px 20px 24px -4px rgba(10, 13, 18, 0.08), 0px 8px 8px -4px rgba(10, 13, 18, 0.03), 0px 3px 3px -1.5px rgba(10, 13, 18, 0.04)", // --shadow-xl
    fontFamily: "'Satoshi', -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
  });

  // Close button
  const closeBtn = document.createElement("span");
  closeBtn.innerHTML = "&times;";
  Object.assign(closeBtn.style, {
    position: "absolute",
    top: "16px",
    right: "20px",
    fontSize: "24px",
    cursor: "pointer",
    color: "rgb(113, 118, 128)", // --color-gray-500
    transition: "color 0.1s ease-linear",
  });
  closeBtn.addEventListener("mouseenter", function() {
    closeBtn.style.color = "rgb(65, 70, 81)"; // --color-gray-700
  });
  closeBtn.addEventListener("mouseleave", function() {
    closeBtn.style.color = "rgb(113, 118, 128)";
  });
  modal.appendChild(closeBtn);

  // Options container (initial view)
  const optionsContainer = document.createElement("div");
  optionsContainer.innerHTML = `
    <h2 style="margin:0 0 24px 0;font-family:'General Sans',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:24px;font-weight:700;color:rgb(24,29,39);line-height:1.3;">Help</h2>
    <button id="generalEnquiryBtn" style="width:100%;margin-bottom:12px;padding:12px 16px;background:rgb(32,96,160);color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:'Satoshi',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;font-weight:600;box-shadow:0px 1px 3px rgba(10,13,18,0.1),0px 1px 2px -1px rgba(10,13,18,0.1),0px 0px 0px 1px rgba(10,13,18,0.18) inset,0px -2px 0px 0px rgba(10,13,18,0.05) inset;transition:background 0.1s ease-linear;">General Enquiry</button>
    <button id="bookApptBtn" style="width:100%;padding:12px 16px;background:rgb(32,96,160);color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:'Satoshi',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;font-weight:600;box-shadow:0px 1px 3px rgba(10,13,18,0.1),0px 1px 2px -1px rgba(10,13,18,0.1),0px 0px 0px 1px rgba(10,13,18,0.18) inset,0px -2px 0px 0px rgba(10,13,18,0.05) inset;transition:background 0.1s ease-linear;">Book Appointment</button>
  `;
  modal.appendChild(optionsContainer);

  // Appointment form (hidden initially)
  const apptForm = document.createElement("form");
  apptForm.style.display = "none";
  const inputStyle = "width:100%;padding:10px 14px;border:1px solid rgb(213,215,218);border-radius:8px;font-family:'Satoshi',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;color:rgb(24,29,39);box-sizing:border-box;transition:border-color 0.1s ease-linear;outline:none;";
  const labelStyle = "display:block;margin-bottom:6px;font-size:14px;font-weight:600;color:rgb(65,70,81);font-family:'Satoshi',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;";
  const fieldStyle = "margin-bottom:16px;";
  
  apptForm.innerHTML = `
    <h2 style="margin:0 0 24px 0;font-family:'General Sans',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:24px;font-weight:700;color:rgb(24,29,39);line-height:1.3;">Book Appointment</h2>
    <div style="${fieldStyle}">
      <label style="${labelStyle}">Appointment Type
        <select name="type" required style="${inputStyle}margin-top:6px;">
          <option value="consultation">Consultation</option>
          <option value="follow_up">Follow Up</option>
          <option value="procedure">Procedure</option>
          <option value="emergency">Emergency</option>
        </select>
      </label>
    </div>
    <div style="${fieldStyle}">
      <label style="${labelStyle}">Department
        <input type="text" name="department" required style="${inputStyle}margin-top:6px;" placeholder="e.g., Cardiology"/>
      </label>
    </div>
    <div style="${fieldStyle}">
      <label style="${labelStyle}">Contact Name
        <input type="text" name="contact_name" required style="${inputStyle}margin-top:6px;" placeholder="Your full name"/>
      </label>
    </div>
    <div style="${fieldStyle}">
      <label style="${labelStyle}">Contact Phone
        <input type="tel" name="contact_phone" required style="${inputStyle}margin-top:6px;" placeholder="Your phone number"/>
      </label>
    </div>
    <div style="${fieldStyle}">
      <label style="${labelStyle}">Contact Email
        <input type="email" name="contact_email" required style="${inputStyle}margin-top:6px;" placeholder="your@email.com"/>
      </label>
    </div>
    <div style="display:flex;gap:12px;margin-top:24px;">
      <button type="submit" style="flex:1;padding:12px 16px;background:rgb(32,96,160);color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:'Satoshi',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;font-weight:600;box-shadow:0px 1px 3px rgba(10,13,18,0.1),0px 1px 2px -1px rgba(10,13,18,0.1),0px 0px 0px 1px rgba(10,13,18,0.18) inset,0px -2px 0px 0px rgba(10,13,18,0.05) inset;transition:background 0.1s ease-linear;">Submit</button>
      <button type="button" id="backBtn" style="flex:1;padding:12px 16px;background:rgb(255,255,255);color:rgb(65,70,81);border:none;border-radius:8px;cursor:pointer;font-family:'Satoshi',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;font-weight:600;box-shadow:0px 1px 3px rgba(10,13,18,0.1),0px 1px 2px -1px rgba(10,13,18,0.1),0px 0px 0px 1px rgba(10,13,18,0.18) inset,0px -2px 0px 0px rgba(10,13,18,0.05) inset;transition:all 0.1s ease-linear;">Back</button>
    </div>
  `;
  modal.appendChild(apptForm);

  // General enquiry form (hidden initially)
  const enquiryForm = document.createElement("form");
  enquiryForm.style.display = "none";
  enquiryForm.innerHTML = `
    <h2 style="margin:0 0 24px 0;font-family:'General Sans',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:24px;font-weight:700;color:rgb(24,29,39);line-height:1.3;">General Enquiry</h2>
    <div style="${fieldStyle}">
      <label style="${labelStyle}">Contact Name
        <input type="text" name="contact_name" required style="${inputStyle}margin-top:6px;" placeholder="Your full name"/>
      </label>
    </div>
    <div style="${fieldStyle}">
      <label style="${labelStyle}">Contact Phone
        <input type="tel" name="contact_phone" required style="${inputStyle}margin-top:6px;" placeholder="Your phone number"/>
      </label>
    </div>
    <div style="${fieldStyle}">
      <label style="${labelStyle}">Contact Email
        <input type="email" name="contact_email" style="${inputStyle}margin-top:6px;" placeholder="your@email.com (optional)"/>
      </label>
    </div>
    <div style="${fieldStyle}">
      <label style="${labelStyle}">Message
        <textarea name="message" rows="4" style="${inputStyle}margin-top:6px;resize:vertical;" placeholder="How can we help you?"></textarea>
      </label>
    </div>
    <div style="display:flex;gap:12px;margin-top:24px;">
      <button type="submit" style="flex:1;padding:12px 16px;background:rgb(32,96,160);color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:'Satoshi',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;font-weight:600;box-shadow:0px 1px 3px rgba(10,13,18,0.1),0px 1px 2px -1px rgba(10,13,18,0.1),0px 0px 0px 1px rgba(10,13,18,0.18) inset,0px -2px 0px 0px rgba(10,13,18,0.05) inset;transition:background 0.1s ease-linear;">Submit</button>
      <button type="button" id="backBtnEnquiry" style="flex:1;padding:12px 16px;background:rgb(255,255,255);color:rgb(65,70,81);border:none;border-radius:8px;cursor:pointer;font-family:'Satoshi',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;font-weight:600;box-shadow:0px 1px 3px rgba(10,13,18,0.1),0px 1px 2px -1px rgba(10,13,18,0.1),0px 0px 0px 1px rgba(10,13,18,0.18) inset,0px -2px 0px 0px rgba(10,13,18,0.05) inset;transition:all 0.1s ease-linear;">Back</button>
    </div>
  `;
  modal.appendChild(enquiryForm);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Event listeners for options
  document.getElementById("generalEnquiryBtn").addEventListener("click", function () {
    optionsContainer.style.display = "none";
    enquiryForm.style.display = "block";
  });

  document.getElementById("bookApptBtn").addEventListener("click", function () {
    optionsContainer.style.display = "none";
    apptForm.style.display = "block";
  });

  // Back button in appointment form
  apptForm.querySelector("#backBtn").addEventListener("click", function () {
    apptForm.style.display = "none";
    optionsContainer.style.display = "block";
  });

  // Back button in enquiry form
  enquiryForm.querySelector("#backBtnEnquiry").addEventListener("click", function () {
    enquiryForm.style.display = "none";
    optionsContainer.style.display = "block";
  });

  // General enquiry form submission
  enquiryForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = {
      type: "general_enquiry",
      contact_name: enquiryForm.contact_name.value,
      contact_phone: enquiryForm.contact_phone.value,
      contact_email: enquiryForm.contact_email.value || "",
      notes: enquiryForm.message.value || "",
      source: "WEBSITE",
      lead_status: "NEW",
    };
    console.log("Enquiry data:", data);

    // Send data to webhook
    fetch("http://localhost:4100/embed/leads/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Lead created:", result);
        overlay.style.display = "none";
        enquiryForm.reset();
        alert("Your enquiry has been submitted successfully!");
      })
      .catch((error) => {
        console.error("Error submitting enquiry:", error);
        overlay.style.display = "none";
        enquiryForm.reset();
        alert("Your enquiry has been submitted.");
      });
  });

  // Show modal on main button click
  button.addEventListener("click", function () {
    overlay.style.display = "flex";
  });

  // Hide modal on overlay click or close button
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) overlay.style.display = "none";
  });
  closeBtn.addEventListener("click", function () {
    overlay.style.display = "none";
  });

  // Form submission handling
  apptForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = {
      type: "appointment",
      department: apptForm.department.value,
      contact_name: apptForm.contact_name.value,
      contact_phone: apptForm.contact_phone.value,
      contact_email: apptForm.contact_email.value,
      source: "WEBSITE",
      lead_status: "NEW",
    };
    console.log("Appointment data:", data);

    // Send data to webhook
    fetch("http://localhost:4100/embed/leads/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Lead created:", result);
        overlay.style.display = "none";
        apptForm.reset();
        alert("Your appointment request has been submitted successfully!");
      })
      .catch((error) => {
        console.error("Error submitting appointment:", error);
        overlay.style.display = "none";
        apptForm.reset();
        alert("Your appointment request has been submitted.");
      });
  });

  // Add button to page
  document.body.appendChild(button);
})();
