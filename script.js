(function () {
  // Create floating button
  const button = document.createElement("button");
  button.innerText = "Contact Us";
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
    width: "300px",
    boxSizing: "border-box",
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

  // Form elements
  const form = document.createElement("form");
  form.innerHTML = `
    <h2 style="margin-top:0;">Enter Details</h2>
    <label>Name:<br><input type="text" name="name" required style="width:100%;margin-bottom:8px;"></label><br>
    <label>Email:<br><input type="email" name="email" required style="width:100%;margin-bottom:8px;"></label><br>
    <label>Message:<br><textarea name="message" rows="4" required style="width:100%;margin-bottom:8px;"></textarea></label><br>
    <button type="submit" style="padding:8px 12px;background:#007bff;color:#fff;border:none;border-radius:4px;cursor:pointer;">Submit</button>
  `;
  modal.appendChild(form);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Show modal on button click
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

  // Optional: handle form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Here you could send data to a server or process it as needed
    console.log("Form data:", {
      title: document.title,
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    });
    overlay.style.display = "none";
    form.reset();
    alert("Thank you! Your details have been submitted.");
  });

  // Add button to page
  document.body.appendChild(button);
})();
