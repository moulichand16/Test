(function () {
  // Track selected campaign
  let selectedCampaign = null;
  let campaignsData = [];

  // Invisible captcha - track form render time
  let formRenderTime = null;

  // Backend API configuration - try multiple sources in order of preference
  const getApiUrl = () => {
    // 1. Check if frontend set it globally
    if (window.HELIX_API_URL) return window.HELIX_API_URL;
    
    // 2. Check meta tag (can be set by frontend)
    const metaTag = document.querySelector('meta[name="helix-api-url"]');
    if (metaTag) return metaTag.getAttribute('content');
    
    // 3. Try to read from Vite env (if available in window)
    if (window.__VITE_ENV__ && window.__VITE_ENV__.VITE_API_URL) {
      return window.__VITE_ENV__.VITE_API_URL;
    }
    
    // 4. Default fallback
    return 'http://localhost:4100';
  };
  
  const API_URL = getApiUrl();
  
  // Get authentication token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('helix_access_token');
  };

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  // Create floating "View Campaigns" button
  const campaignsButton = document.createElement("button");
  campaignsButton.innerText = "View Packages";
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
    animation: "fadeIn 0.2s ease-out",
  });

  // Campaigns list modal
  const campaignsListModal = document.createElement("div");
  Object.assign(campaignsListModal.style, {
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: "20px",
    width: "1200px",
    maxWidth: "95%",
    maxHeight: "90vh",
    overflow: "hidden",
    boxShadow: "0px 24px 48px rgba(10, 13, 18, 0.2)",
    fontFamily: "'Satoshi', -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    animation: "slideUp 0.3s ease-out",
  });

  // Modal header
  const campaignsListHeader = document.createElement("div");
  Object.assign(campaignsListHeader.style, {
    padding: "32px 40px",
    borderBottom: "1px solid rgb(234, 236, 240)",
    position: "relative",
    background: "linear-gradient(to bottom, rgb(255, 255, 255) 0%, rgb(250, 251, 252) 100%)",
  });
  campaignsListHeader.innerHTML = `
    <h2 style="margin:0;font-family:'General Sans',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:32px;font-weight:700;color:rgb(24,29,39);letter-spacing:-0.02em;">Health Campaigns</h2>
    <p style="margin:10px 0 0 0;font-size:15px;color:rgb(113,118,128);line-height:1.5;">Discover our latest health initiatives and wellness programs</p>
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
    padding: "32px 40px",
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

  // Success modal overlay
  const successOverlay = document.createElement("div");
  Object.assign(successOverlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(10, 13, 18, 0.6)",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "10004",
    backdropFilter: "blur(4px)",
    animation: "fadeIn 0.2s ease-out",
  });

  const successModal = document.createElement("div");
  Object.assign(successModal.style, {
    backgroundColor: "rgb(255, 255, 255)",
    padding: "48px 40px",
    borderRadius: "20px",
    width: "480px",
    maxWidth: "90%",
    boxSizing: "border-box",
    position: "relative",
    boxShadow: "0px 24px 48px rgba(10, 13, 18, 0.2)",
    fontFamily: "'Satoshi', -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    textAlign: "center",
    animation: "slideUp 0.3s ease-out",
  });

  successModal.innerHTML = `
    <div style="width:80px;height:80px;margin:0 auto 24px;background:linear-gradient(135deg, rgb(16, 185, 129) 0%, rgb(5, 150, 105) 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0px 8px 24px rgba(16, 185, 129, 0.3);">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
    <h2 style="margin:0 0 12px 0;font-family:'General Sans',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:28px;font-weight:700;color:rgb(24,29,39);">Thank You!</h2>
    <p style="margin:0 0 32px 0;font-size:16px;color:rgb(113,118,128);line-height:1.6;">We've received your enquiry and our team will contact you shortly.</p>
    <button id="successCloseBtn" style="padding:14px 32px;background:rgb(32,96,160);color:white;border:none;border-radius:10px;cursor:pointer;font-family:'Satoshi',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:15px;font-weight:600;box-shadow:0px 2px 8px rgba(32,96,160,0.3);transition:all 0.2s ease;">Got it</button>
  `;

  successOverlay.appendChild(successModal);
  document.body.appendChild(successOverlay);

  // Load campaigns from backend API
  function loadCampaigns() {
    const token = getAuthToken();
    
    if (!token) {
      console.error('No authentication token found');
      campaignsListBody.innerHTML = '<p style="text-align:center;color:rgb(113,118,128);padding:40px;">Please log in to view campaigns.</p>';
      return;
    }

    const query = `{
      campaigns(first: 50) {
        edges {
          node {
            id
            name
            status
            typeCustom
            platform
            startDate
            endDate
          }
        }
      }
    }`;

    fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query })
    })
      .then(response => response.json())
      .then(result => {
        if (result.errors) {
          console.error('GraphQL errors:', result.errors);
          campaignsListBody.innerHTML = '<p style="text-align:center;color:rgb(113,118,128);padding:40px;">Failed to load campaigns. Please try again later.</p>';
          return;
        }

        // Transform backend campaigns to match expected format
        const backendCampaigns = result.data?.campaigns?.edges?.map(edge => edge.node) || [];
        
        campaignsData = backendCampaigns.map(campaign => ({
          id: campaign.id,
          title: campaign.name || 'Untitled Campaign',
          badge: campaign.typeCustom || campaign.platform || 'General',
          excerpt: `Campaign status: ${campaign.status || 'Active'}`,
          description: `This is a ${campaign.typeCustom || 'health'} campaign. Contact us for more details.`,
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop',
          validUntil: campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Ongoing',
          features: [
            'Professional consultation',
            'Comprehensive assessment',
            'Personalized care plan',
            'Follow-up support'
          ]
        }));

        console.log('Loaded campaigns from backend:', campaignsData);
        renderCampaignsList();
      })
      .catch(error => {
        console.error('Error loading campaigns:', error);
        campaignsListBody.innerHTML = '<p style="text-align:center;color:rgb(113,118,128);padding:40px;">Failed to load campaigns. Please try again later.</p>';
      });
  }

  // Load campaigns when script initializes
  loadCampaigns();

  function renderCampaignsList() {
    const grid = document.createElement("div");
    Object.assign(grid.style, {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "24px",
    });

    campaignsData.forEach(campaign => {
      const card = document.createElement("div");
      Object.assign(card.style, {
        background: "white",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0px 2px 8px rgba(10, 13, 18, 0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        border: "1px solid rgb(234, 236, 240)",
        display: "flex",
        flexDirection: "column",
      });

      card.addEventListener("mouseenter", () => {
        card.style.boxShadow = "0px 12px 24px rgba(10, 13, 18, 0.15)";
        card.style.transform = "translateY(-6px)";
        card.style.borderColor = "rgb(32, 96, 160)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.boxShadow = "0px 2px 8px rgba(10, 13, 18, 0.08)";
        card.style.transform = "translateY(0)";
        card.style.borderColor = "rgb(234, 236, 240)";
      });

      card.innerHTML = `
        <div style="width:100%;height:200px;background:rgb(248, 250, 252);position:relative;overflow:hidden;">
          <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgb(152,162,179);font-size:14px;font-weight:500;">
            Campaign Image
          </div>
        </div>
        <div style="padding:20px;flex:1;display:flex;flex-direction:column;">
          <span style="display:inline-block;padding:6px 12px;background:rgb(240,249,255);color:rgb(32,96,160);border-radius:8px;font-size:12px;font-weight:600;margin-bottom:12px;width:fit-content;">${campaign.badge}</span>
          <h3 style="margin:0 0 10px 0;font-family:'General Sans',-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:20px;font-weight:700;color:rgb(24,29,39);line-height:1.3;">${campaign.title}</h3>
          <p style="margin:0 0 16px 0;font-size:14px;color:rgb(113,118,128);line-height:1.6;flex:1;">${campaign.excerpt}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;padding-top:16px;border-top:1px solid rgb(234,236,240);margin-top:auto;">
            <span style="font-size:12px;color:rgb(152,162,179);font-weight:500;">Valid till ${campaign.validUntil}</span>
            <span style="font-size:14px;font-weight:600;color:rgb(32,96,160);display:flex;align-items:center;gap:4px;">Learn more <span style="transition:transform 0.2s ease;">→</span></span>
          </div>
        </div>
      `;

      const learnMoreArrow = card.querySelector('span:last-child span');
      card.addEventListener("mouseenter", () => {
        if (learnMoreArrow) learnMoreArrow.style.transform = "translateX(4px)";
      });
      card.addEventListener("mouseleave", () => {
        if (learnMoreArrow) learnMoreArrow.style.transform = "translateX(0)";
      });

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

  // Success modal close button
  const successCloseBtn = successModal.querySelector("#successCloseBtn");
  successCloseBtn.addEventListener("mouseenter", () => {
    successCloseBtn.style.background = "rgb(24, 76, 132)";
    successCloseBtn.style.transform = "translateY(-2px)";
    successCloseBtn.style.boxShadow = "0px 4px 12px rgba(32,96,160,0.4)";
  });
  successCloseBtn.addEventListener("mouseleave", () => {
    successCloseBtn.style.background = "rgb(32, 96, 160)";
    successCloseBtn.style.transform = "translateY(0)";
    successCloseBtn.style.boxShadow = "0px 2px 8px rgba(32,96,160,0.3)";
  });
  successCloseBtn.addEventListener("click", () => {
    successOverlay.style.display = "none";
  });

  successOverlay.addEventListener("click", (e) => {
    if (e.target === successOverlay) {
      successOverlay.style.display = "none";
    }
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

    fetch(`${API_URL}/embed/leads/create`, {
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
        successOverlay.style.display = "flex";
      })
      .catch((error) => {
        console.error("Error submitting enquiry:", error);
        enquiryOverlay.style.display = "none";
        enquiryForm.reset();
        selectedCampaign = null;
        formRenderTime = null;
        successOverlay.style.display = "flex";
      });
  });
})();
