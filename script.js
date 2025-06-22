let passwordHistory = []; // Each item: { password, strength }
const maxHistory = 5;

function generatePassword() {
  const length = document.getElementById("length").value;
  const includeUppercase = document.getElementById("includeUppercase").checked;
  const includeLowercase = document.getElementById("includeLowercase").checked;
  const includeNumbers = document.getElementById("includeNumbers").checked;
  const includeSymbols = document.getElementById("includeSymbols").checked;

  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+[]{}|;:,.<>?";

  let allChars = "";
  if (includeUppercase) allChars += uppercaseChars;
  if (includeLowercase) allChars += lowercaseChars;
  if (includeNumbers) allChars += numberChars;
  if (includeSymbols) allChars += symbolChars;

  let password = "";
  if (allChars.length === 0) {
    alert("Please select at least one character type.");
    return;
  }

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }

  document.getElementById("passwordOutput").value = password;
  // Update history
  updatePasswordHistory(password);

  checkStrength(password);
  checkEntropy(password);
}

function copyPassword() {
  const output = document.getElementById("passwordOutput");
  output.select();
  document.execCommand("copy");

  // Show tooltip
  const tooltip = document.getElementById("copyTooltip");
  tooltip.classList.remove("hidden");
  tooltip.classList.add("show");

  // Hide after 2 seconds
  setTimeout(() => {
    tooltip.classList.remove("show");
    tooltip.classList.add("hidden");
  }, 2000);
}

function spinner() {
  // Hide lock screen
  document.getElementById("lockScreen").classList.add("hidden");

  // Show spinner
  document.getElementById("spinnerWrapper").classList.remove("hidden");

  // After 2 seconds, hide spinner and show generator
  setTimeout(() => {
    document.getElementById("spinnerWrapper").classList.add("hidden");
    document.getElementById("generatorUI").classList.remove("hidden");
  }, 2000);
}

function checkStrength(password) {
  const bar = document.getElementById("strengthBar");
  const text = document.getElementById("strengthText");

  let strength = 0;

  // Criteria for strength
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  let strengthLabel = "";
  let color = "";

  switch (strength) {
    case 0:
    case 1:
      strengthLabel = "Very Weak";
      color = "red";
      break;
    case 2:
      strengthLabel = "Weak";
      color = "orange";
      break;
    case 3:
      strengthLabel = "Moderate";
      color = "gold";
      break;
    case 4:
      strengthLabel = "Strong";
      color = "lightgreen";
      break;
    case 5:
      strengthLabel = "Very Strong";
      color = "green";
      break;
  }

  // Update bar and text
  bar.style.setProperty("--strength-color", color);
  bar.style.setProperty("--strength-percent", `${(strength / 5) * 100}%`);

  // Update width and color of inner bar
  bar.querySelector("::after"); // make sure bar exists
  bar.style.setProperty("--bar-width", `${(strength / 5) * 100}%`);
  bar.style.setProperty("--bar-color", color);
  bar.innerHTML = `<div style="width: ${
    (strength / 5) * 100
  }%; height: 100%; background-color: ${color}; border-radius: 5px;"></div>`;

  text.textContent = `Strength: ${strengthLabel}`;
}

function checkEntropy(password) {
  const result = zxcvbn(password);

  const score = result.score; // Score from 0 to 4
  const feedback = result.feedback.suggestions.join(" ") || "Strong password!";
  const tooltip = document.getElementById("strengthText");

  const strengthLevels = ["Very Weak", "Weak", "Fair", "Good", "Excellent"];
  const colors = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#27ae60"];

  // Set feedback
  tooltip.textContent = `Strength: ${strengthLevels[score]} - ${feedback}`;
  tooltip.style.color = colors[score];

  // Optional: Update bar or visuals based on score
}

const colorMap = {
  "Very Weak": "red",
  Weak: "orange",
  Moderate: "gold",
  Strong: "lightgreen",
  "Very Strong": "green",
};

function updatePasswordHistory(password) {
  const historyList = document.getElementById("historyList");

  const strength = getPasswordStrengthLabel(password);

  // Add new password and its strength
  passwordHistory.unshift({ password, strength });

  if (passwordHistory.length > maxHistory) {
    passwordHistory.pop();
  }

  // Re-render history list
  historyList.innerHTML = "";
  passwordHistory.forEach((entry) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${entry.password}</strong><br>
<span style="font-size: 12px; color: ${colorMap[entry.strength]}">Strength: ${
      entry.strength
    }</span>`;

    historyList.appendChild(li);
  });
}

function toggleHistory() {
  const historySection = document.getElementById("historySection");
  const toggleBtn = document.getElementById("toggleHistoryBtn");

  historySection.classList.toggle("hidden");

  // Optional: Change button text
  if (historySection.classList.contains("hidden")) {
    toggleBtn.textContent = "Show History";
  } else {
    toggleBtn.textContent = "Hide History";
  }
}

function getPasswordStrengthLabel(password) {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const labels = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"];
  return labels[strength] || "Very Weak";
}

function clearHistory() {
  passwordHistory = []; // Reset the array
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = ""; // Clear the UI list
}
