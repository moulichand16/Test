(function () {
  // Create button
  const button = document.createElement("button");
  button.innerText = "Contact Us";

  // Style the button (floating)
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.padding = "12px 16px";
  button.style.backgroundColor = "#007bff";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.borderRadius = "8px";
  button.style.cursor = "pointer";
  button.style.zIndex = "9999";

  // Click action
  button.onclick = function () {
    alert("Widget clicked!");
  };

  // Add to page
  document.body.appendChild(button);
})();