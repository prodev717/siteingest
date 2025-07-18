(function () {
  if (window.__adInjected) return;
  window.__adInjected = true;

  const adLink = "http://localhost:5173";
  const adText = "Monetize your site with SiteIngest!";

  const banner = document.createElement("div");
  banner.id = "siteingest-ad-banner";
  banner.innerHTML = `
    <div style="max-width:960px;margin:0 auto;padding:10px 20px;display:flex;justify-content:space-between;align-items:center;font-family:sans-serif;font-size:14px;">
      <div>
        <span style="background:#eee;color:#666;font-size:10px;padding:2px 6px;border-radius:3px;margin-right:8px;">Ad</span>
        <span>${adText}</span>
        <a href="${adLink}" target="_blank" style="margin-left:12px;color:#1a73e8;text-decoration:none;">Learn More</a>
      </div>
      <button id="closeAdBtn" style="background:none;border:none;font-size:20px;color:#777;cursor:pointer;">&times;</button>
    </div>
  `;

  Object.assign(banner.style, {
    position: "fixed",
    bottom: "0",
    width: "100%",
    backgroundColor: "#fff",
    borderTop: "1px solid #ccc",
    boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
    zIndex: "9999",
  });

  document.body.appendChild(banner);

  document.getElementById("closeAdBtn").addEventListener("click", () => {
    banner.remove();
  });
})();
