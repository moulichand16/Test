(function () {
  // Create floating button
  const button = document.createElement("button");
  button.innerText = "Patient Relations";
  Object.assign(button.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "12px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    zIndex: "10000",
  });

  // Create modal overlay
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "9999",
  });

  // Modal content container
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "320px",
    boxSizing: "border-box",
    position: "relative",
  });

  // Close button
  const closeBtn = document.createElement("span");
  closeBtn.innerHTML = "&times;";
  Object.assign(closeBtn.style, {
    position: "absolute",
    top: "10px",
    right: "15px",
    fontSize: "20px",
    cursor: "pointer",
  });
  modal.appendChild(closeBtn);

  // Options container (initial view)
  const optionsContainer = document.createElement("div");
  optionsContainer.innerHTML = `
    <h2 style="margin-top:0;">Patient Relations</h2>
    <button id="generalEnquiryBtn" style="width:100%;margin-bottom:8px;padding:8px;background:#007bff;color:#fff;border:none;border-radius:4px;cursor:pointer;">General Enquiry</button>
    <button id="bookApptBtn" style="width:100%;padding:8px;background:#28a745;color:#fff;border:none;border-radius:4px;cursor:pointer;">Book Appointment</button>
  `;
  modal.appendChild(optionsContainer);

  // Appointment form (hidden initially)
  const apptForm = document.createElement("form");
  apptForm.style.display = "none";
  apptForm.innerHTML = `
    <h2 style="margin-top:0;">Book Appointment</h2>
    <label>Appointment Type:<br>
      <select name="type" required style="width:100%;margin-bottom:8px;">
        <option value="consultation">Consultation</option>
        <option value="follow_up">Follow Up</option>
        <option value="procedure">Procedure</option>
        <option value="emergency">Emergency</option>
      </select>
    </label><br>
    <label>Department:<br><input type="text" name="department" required style="width:100%;margin-bottom:8px;"/></label><br>
    <label>Contact Name:<br><input type="text" name="contact_name" required style="width:100%;margin-bottom:8px;"/></label><br>
    <label>Contact Phone:<br><input type="tel" name="contact_phone" required style="width:100%;margin-bottom:8px;"/></label><br>
    <label>Contact Email:<br><input type="email" name="contact_email" required style="width:100%;margin-bottom:8px;"/></label><br>
    <button type="submit" style="padding:8px 12px;background:#007bff;color:#fff;border:none;border-radius:4px;cursor:pointer;">Submit</button>
    <button type="button" id="backBtn" style="margin-left:8px;padding:8px 12px;background:#6c757d;color:#fff;border:none;border-radius:4px;cursor:pointer;">Back</button>
  `;
  modal.appendChild(apptForm);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Event listeners for options
  document.getElementById("generalEnquiryBtn").addEventListener("click", function () {
    alert("General enquiry selected. Implement as needed.");
  });

  document.getElementById("bookApptBtn").addEventListener("click", function () {
    optionsContainer.style.display = "none";
    apptForm.style.display = "block";
  });

  // Back button in form
  apptForm.querySelector("#backBtn").addEventListener("click", function () {
    apptForm.style.display = "none";
    optionsContainer.style.display = "block";
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
      title: document.title,
      type: apptForm.type.value,
      department: apptForm.department.value,
      contact_name: apptForm.contact_name.value,
      contact_phone: apptForm.contact_phone.value,
      contact_email: apptForm.contact_email.value,
    };
    console.log("Appointment data:", data);
    overlay.style.display = "none";
    apptForm.reset();
    alert("Your appointment request has been submitted.");
  });

  // Add button to page
  document.body.appendChild(button);
})();
