(function () {
  // Track selected campaign
  let selectedCampaign = null;
  let campaignsData = [];

  // Invisible captcha - track form render time
  let formRenderTime = null;

  // Get script's directory to resolve campaigns.json path
  const scriptPath = document.currentScript ? document.currentScript.src : '';
  const scriptDir = scriptPath.substring(0, scriptPath.lastIndexOf('/'));
  const campaignsJsonUrl = scriptDir ? scriptDir + '/campaigns.json' : 'campaigns.json';

  // Create floating "View Campaigns" button
  const campaignsButton = document.createElement("button");
  campaignsButton.innerText = "View Health Campaigns";
  campaignsButton.id = "viewCampaignsBtn";
  Object.assign(campaignsButton.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    padding: "14px 24px",
    backgroundColor: "rgb(32, 96, 160)",
    color: "rgb(255, 255, 255)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    zIndex: "10000",
    fontFamily: "'Satoshi', -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    fontSize: "15px",
    fontWeight: "600",
    boxShadow: "0px 4px 12px rgba(32, 96, 160, 0.3), 0px 1px 3px rgba(10, 13, 18, 0.1)",
    transition: "all 0.2s ease",
  });
  
  campaignsButton.addEventListener("mouseenter", function() {
    campaignsButton.style.backgroundColor = "rgb(24, 76, 132)";
    campaignsButton.style.transform = "translateY(-2px)";
    campaignsButton.style.boxShadow = "0px 6px 16px rgba(32, 96, 160, 0.4)";
  });
  
  campaignsButton.addEventListener("mouseleave", function() {
    campaignsButton.style.backgroundColor = "rgb(32, 96, 160)";
    campaignsButton.style.transform = "translateY(0)";
    campaignsButton.style.boxShadow = "0px 4px 12px rgba(32, 96, 160, 0.3)";
  });

  document.body.appendChild(campaignsButton);

  // Create campaigns list modal overlay
  const campaignsListOverlay = document.createElement("div");
  Object.assign(campaignsListOverlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(10, 13, 18, 0.6)",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "10001",
    backdropFilter: "blur(4px)",
  });

  // Campaigns list modal
  const campaignsListModal = document.createElement("div");
  Object.assign(campaignsListModal.style, {
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: "16px",
    width: "900px",
    maxWidth: "95%",
    maxHeight: "85vh",
    overflow: "hidden",
    boxShadow: "0px 20px 40px rgba(10, 13, 18, 0.15)",
    fontFamily: "'Satoshi', -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
  });

  // Modal header
  const campaignsListHeader = document.createElement("div");
  Object.assign(campaignsListHeader.style, {
    padding: "24px 32px",
    borderBottom: "1px solid rgb(234, 236, 240)",
    position: "relative",
  });
  campaignsListHeader.innerHTML = `
    <h2 style="margin:0;font-family:'General Sans',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:28px;font-weight:700;color:rgb(24,29,39);">Health Campaigns</h2>
    <p style="margin:8px 0 0 0;font-size:14px;color:rgb(113,118,128);">Discover our latest health initiatives and wellness programs</p>
  `;

  const campaignsListClose = document.createElement("span");
  campaignsListClose.innerHTML = "&times;";
  Object.assign(campaignsListClose.style, {
    position: "absolute",
    top: "24px",
    right: "32px",
    fontSize: "28px",
    cursor: "pointer",
    color: "rgb(113, 118, 128)",
    transition: "color 0.1s ease-linear",
  });
  campaignsListClose.addEventListener("mouseenter", () => campaignsListClose.style.color = "rgb(65, 70, 81)");
  campaignsListClose.addEventListener("mouseleave", () => campaignsListClose.style.color = "rgb(113, 118, 128)");
  campaignsListHeader.appendChild(campaignsListClose);

  // Modal body (scrollable)
  const campaignsListBody = document.createElement("div");
  Object.assign(campaignsListBody.style, {
    padding: "24px 32px",
    overflowY: "auto",
    flex: "1",
  });

  campaignsListModal.appendChild(campaignsListHeader);
  campaignsListModal.appendChild(campaignsListBody);
  campaignsListOverlay.appendChild(campaignsListModal);
  document.body.appendChild(campaignsListOverlay);

  // Campaign detail modal overlay
  const campaignDetailOverlay = document.createElement("div");
  Object.assign(campaignDetailOverlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(10, 13, 18, 0.6)",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "10002",
    backdropFilter: "blur(4px)",
  });

  const campaignDetailModal = document.createElement("div");
  Object.assign(campaignDetailModal.style, {
    backgroundColor: "white",
    borderRadius: "12px",
    width: "600px",
    maxWidth: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0px 20px 24px -4px rgba(10, 13, 18, 0.08)",
    position: "relative",
  });

  const campaignDetailContent = document.createElement("div");
  campaignDetailModal.appendChild(campaignDetailContent);
  campaignDetailOverlay.appendChild(campaignDetailModal);
  document.body.appendChild(campaignDetailOverlay);

  // Enquiry form modal overlay
  const enquiryOverlay = document.createElement("div");
  Object.assign(enquiryOverlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(10, 13, 18, 0.6)",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "10003",
    backdropFilter: "blur(4px)",
  });

  const enquiryModal = document.createElement("div");
  Object.assign(enquiryModal.style, {
    backgroundColor: "rgb(255, 255, 255)",
    padding: "32px",
    borderRadius: "12px",
    width: "420px",
    maxWidth: "90%",
    boxSizing: "border-box",
    position: "relative",
    boxShadow: "0px 20px 24px -4px rgba(10, 13, 18, 0.08)",
    fontFamily: "'Satoshi', -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
  });

  const enquiryCloseBtn = document.createElement("span");
  enquiryCloseBtn.innerHTML = "&times;";
  Object.assign(enquiryCloseBtn.style, {
    position: "absolute",
    top: "16px",
    right: "20px",
    fontSize: "24px",
    cursor: "pointer",
    color: "rgb(113, 118, 128)",
    transition: "color 0.1s ease-linear",
  });
  enquiryCloseBtn.addEventListener("mouseenter", () => enquiryCloseBtn.style.color = "rgb(65, 70, 81)");
  enquiryCloseBtn.addEventListener("mouseleave", () => enquiryCloseBtn.style.color = "rgb(113, 118, 128)");
  enquiryModal.appendChild(enquiryCloseBtn);

  const enquiryForm = document.createElement("form");
  const inputStyle = "width:100%;padding:10px 14px;border:1px solid rgb(213,215,218);border-radius:8px;font-family:'Satoshi',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;color:rgb(24,29,39);box-sizing:border-box;transition:border-color 0.1s ease-linear;outline:none;";
  const labelStyle = "display:block;margin-bottom:6px;font-size:14px;font-weight:600;color:rgb(65,70,81);font-family:'Satoshi',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;";
  const fieldStyle = "margin-bottom:16px;";
  
  enquiryForm.innerHTML = `
    <h2 style="margin:0 0 24px 0;font-family:'General Sans',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:24px;font-weight:700;color:rgb(24,29,39);line-height:1.3;">General Enquiry</h2>
    <div style="position:absolute;left:-5000px;" aria-hidden="true">
      <input type="text" name="website" tabindex="-1" autocomplete="off" placeholder="Leave this field empty"/>
    </div>
    <div style="${fieldStyle}">
      <label style="${labelStyle}">Name <span style="color:rgb(240,68,56);">*</span>
        <input type="text" name="contact_name" required style="${inputStyle}margin-top:6px;" placeholder="Your full name"/>
      </label>
    </div>
    <div style="${fieldStyle}">
      <label style="${labelStyle}">Email
        <input type="email" name="contact_email" style="${inputStyle}margin-top:6px;" placeholder="your@email.com (optional)"/>
      </label>
    </div>
    <div style="${fieldStyle}">
      <label style="${labelStyle}">Phone Number <span style="color:rgb(240,68,56);">*</span>
        <input type="tel" name="contact_phone" required style="${inputStyle}margin-top:6px;" placeholder="Your phone number"/>
      </label>
    </div>
    <div style="${fieldStyle}">
      <label style="${labelStyle}">Message
        <textarea name="message" rows="4" style="${inputStyle}margin-top:6px;resize:vertical;" placeholder="How can we help you? (optional)"></textarea>
      </label>
    </div>
    <div style="margin-bottom:20px;">
      <label style="display:flex;align-items:start;gap:8px;cursor:pointer;">
        <input type="checkbox" name="consent" required style="margin-top:2px;width:16px;height:16px;cursor:pointer;accent-color:rgb(32,96,160);" />
        <span style="font-size:12px;color:rgb(113,118,128);line-height:1.5;font-family:'Satoshi',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;">By submitting this form, I agree to be contacted by Deepam Hospitals using the contact details provided through SMS, WhatsApp, and Phone Calls.</span>
      </label>
    </div>
    <div style="display:flex;gap:12px;margin-top:24px;">
      <button type="submit" style="flex:1;padding:12px 16px;background:rgb(32,96,160);color:#fff;border:none;border-radius:8px;cursor:pointer;font-family:'Satoshi',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;font-weight:600;box-shadow:0px 1px 3px rgba(10,13,18,0.1);transition:background 0.1s ease-linear;">Submit</button>
      <button type="button" id="cancelEnquiryBtn" style="flex:1;padding:12px 16px;background:rgb(255,255,255);color:rgb(65,70,81);border:none;border-radius:8px;cursor:pointer;font-family:'Satoshi',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;font-weight:600;box-shadow:0px 1px 3px rgba(10,13,18,0.1);transition:all 0.1s ease-linear;">Cancel</button>
    </div>
  `;
  enquiryModal.appendChild(enquiryForm);
  enquiryOverlay.appendChild(enquiryModal);
  document.body.appendChild(enquiryOverlay);

  // Load campaigns from JSON
  fetch(campaignsJsonUrl)
    .then(response => response.json())
    .then(data => {
      campaignsData = data;
      renderCampaignsList();
    })
    .catch(error => {
      console.error('Error loading campaigns:', error);
      campaignsListBody.innerHTML = '<p style="text-align:center;color:rgb(113,118,128);padding:40px;">Failed to load campaigns. Please try again later.</p>';
    });

  function renderCampaignsList() {
    const grid = document.createElement("div");
    Object.assign(grid.style, {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "20px",
    });

    campaignsData.forEach(campaign => {
      const card = document.createElement("div");
      Object.assign(card.style, {
        background: "white",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0px 1px 3px rgba(10, 13, 18, 0.1)",
        transition: "all 0.2s ease",
        cursor: "pointer",
        border: "1px solid rgb(234, 236, 240)",
      });

      card.addEventListener("mouseenter", () => {
        card.style.boxShadow = "0px 8px 16px rgba(10, 13, 18, 0.12)";
        card.style.transform = "translateY(-4px)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.boxShadow = "0px 1px 3px rgba(10, 13, 18, 0.1)";
        card.style.transform = "translateY(0)";
      });

      card.innerHTML = `
        <div style="width:100%;height:160px;background:linear-gradient(135deg, rgb(32, 96, 160) 0%, rgb(24, 76, 132) 100%);position:relative;">
          <img src="${campaign.image}" style="width:100%;height:100%;object-fit:cover;" alt="${campaign.title}" />
        </div>
        <div style="padding:16px;">
          <span style="display:inline-block;padding:4px 10px;background:rgb(240,249,255);color:rgb(32,96,160);border-radius:6px;font-size:11px;font-weight:600;margin-bottom:10px;">${campaign.badge}</span>
          <h3 style="margin:0 0 8px 0;font-family:'General Sans',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:18px;font-weight:700;color:rgb(24,29,39);line-height:1.3;">${campaign.title}</h3>
          <p style="margin:0 0 12px 0;font-size:13px;color:rgb(113,118,128);line-height:1.5;">${campaign.excerpt}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid rgb(234,236,240);">
            <span style="font-size:11px;color:rgb(152,162,179);">Valid till ${campaign.validUntil}</span>
            <span style="font-size:13px;font-weight:600;color:rgb(32,96,160);">Learn more →</span>
          </div>
        </div>
      `;

      card.addEventListener("click", () => showCampaignDetail(campaign));
      grid.appendChild(card);
    });

    campaignsListBody.innerHTML = '';
    campaignsListBody.appendChild(grid);
  }

  function showCampaignDetail(campaign) {
    selectedCampaign = campaign.title;
    
    const featuresList = campaign.features.map(f => `<li style="padding:8px 0;padding-left:24px;position:relative;font-size:14px;color:rgb(65,70,81);"><span style="position:absolute;left:0;color:rgb(32,96,160);font-weight:700;">✓</span>${f}</li>`).join('');
    
    campaignDetailContent.innerHTML = `
      <div style="padding:32px 32px 24px;border-bottom:1px solid rgb(234,236,240);position:relative;">
        <span id="campaignDetailClose" style="position:absolute;top:16px;right:20px;font-size:24px;cursor:pointer;color:rgb(113,118,128);transition:color 0.1s ease-linear;">&times;</span>
        <h2 style="margin:0 0 8px 0;font-family:'General Sans',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:28px;font-weight:700;color:rgb(24,29,39);">${campaign.title}</h2>
        <span style="display:inline-block;padding:4px 12px;background:rgb(240,249,255);color:rgb(32,96,160);border-radius:6px;font-size:12px;font-weight:600;">${campaign.badge}</span>
      </div>
      <div style="padding:24px 32px 32px;">
        <p style="font-size:15px;color:rgb(65,70,81);line-height:1.7;margin:0 0 24px 0;">${campaign.description}</p>
        <div style="margin-bottom:24px;">
          <h3 style="font-size:16px;font-weight:600;color:rgb(24,29,39);margin:0 0 12px 0;">What's Included:</h3>
          <ul style="list-style:none;padding:0;margin:0;">${featuresList}</ul>
        </div>
        <div style="display:flex;gap:12px;padding-top:24px;border-top:1px solid rgb(234,236,240);">
          <button id="interestedBtn" style="flex:1;padding:12px 16px;background:rgb(32,96,160);color:white;border:none;border-radius:8px;cursor:pointer;font-family:'Satoshi',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;font-weight:600;box-shadow:0px 1px 3px rgba(10,13,18,0.1);transition:all 0.1s ease-linear;">I am Interested</button>
          <button id="notInterestedBtn" style="flex:1;padding:12px 16px;background:white;color:rgb(65,70,81);border:none;border-radius:8px;cursor:pointer;font-family:'Satoshi',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:14px;font-weight:600;box-shadow:0px 1px 3px rgba(10,13,18,0.1);transition:all 0.1s ease-linear;">Not Interested</button>
        </div>
      </div>
    `;

    const detailClose = campaignDetailContent.querySelector('#campaignDetailClose');
    detailClose.addEventListener("mouseenter", () => detailClose.style.color = "rgb(65, 70, 81)");
    detailClose.addEventListener("mouseleave", () => detailClose.style.color = "rgb(113, 118, 128)");
    detailClose.addEventListener("click", () => {
      campaignDetailOverlay.style.display = "none";
      selectedCampaign = null;
    });

    campaignDetailContent.querySelector('#interestedBtn').addEventListener("click", () => {
      campaignDetailOverlay.style.display = "none";
      campaignsListOverlay.style.display = "none";
      enquiryOverlay.style.display = "flex";
      formRenderTime = Date.now();
    });

    campaignDetailContent.querySelector('#notInterestedBtn').addEventListener("click", () => {
      campaignDetailOverlay.style.display = "none";
      selectedCampaign = null;
    });

    campaignsListOverlay.style.display = "none";
    campaignDetailOverlay.style.display = "flex";
  }

  // Event listeners
  campaignsButton.addEventListener("click", () => {
    campaignsListOverlay.style.display = "flex";
  });

  campaignsListClose.addEventListener("click", () => {
    campaignsListOverlay.style.display = "none";
  });

  campaignsListOverlay.addEventListener("click", (e) => {
    if (e.target === campaignsListOverlay) {
      campaignsListOverlay.style.display = "none";
    }
  });

  campaignDetailOverlay.addEventListener("click", (e) => {
    if (e.target === campaignDetailOverlay) {
      campaignDetailOverlay.style.display = "none";
      selectedCampaign = null;
    }
  });

  enquiryCloseBtn.addEventListener("click", () => {
    enquiryOverlay.style.display = "none";
    selectedCampaign = null;
  });

  enquiryOverlay.addEventListener("click", (e) => {
    if (e.target === enquiryOverlay) {
      enquiryOverlay.style.display = "none";
      selectedCampaign = null;
    }
  });

  enquiryForm.querySelector("#cancelEnquiryBtn").addEventListener("click", () => {
    enquiryOverlay.style.display = "none";
    selectedCampaign = null;
  });

  // Form submission
  enquiryForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const honeypotField = enquiryForm.querySelector('input[name="website"]');
    const timeTaken = Date.now() - formRenderTime;
    const minTimeRequired = 3000;

    if (honeypotField && honeypotField.value !== '') {
      console.warn('Spam detected: honeypot field filled');
      enquiryOverlay.style.display = 'none';
      enquiryForm.reset();
      selectedCampaign = null;
      formRenderTime = null;
      return;
    }

    if (formRenderTime && timeTaken < minTimeRequired) {
      console.warn('Spam detected: form submitted too quickly (' + timeTaken + 'ms)');
      enquiryOverlay.style.display = 'none';
      enquiryForm.reset();
      selectedCampaign = null;
      formRenderTime = null;
      return;
    }

    const data = {
      type: "general_enquiry",
      contact_name: enquiryForm.contact_name.value,
      contact_phone: enquiryForm.contact_phone.value,
      contact_email: enquiryForm.contact_email.value || "",
      notes: enquiryForm.message.value || "",
      source: "WEBSITE",
      lead_status: "NEW",
    };

    if (selectedCampaign) {
      data.campaign = selectedCampaign;
      data.utm_campaign = selectedCampaign;
    }

    console.log("Enquiry data:", data);

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
        enquiryOverlay.style.display = "none";
        enquiryForm.reset();
        selectedCampaign = null;
        formRenderTime = null;
        alert("Thank you for your interest! We will contact you soon.");
      })
      .catch((error) => {
        console.error("Error submitting enquiry:", error);
        enquiryOverlay.style.display = "none";
        enquiryForm.reset();
        selectedCampaign = null;
        formRenderTime = null;
        alert("Thank you for your interest! We will contact you soon.");
      });
  });
})();
