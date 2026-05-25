const STORAGE_KEY = "cleanPortfolioCMS.content.v1";

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getContent() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return deepClone(DEFAULT_CONTENT);
  try {
    const parsed = JSON.parse(saved);
    return mergeContent(deepClone(DEFAULT_CONTENT), parsed);
  } catch (error) {
    console.warn("Could not parse saved portfolio content. Loading defaults.", error);
    return deepClone(DEFAULT_CONTENT);
  }
}

function mergeContent(base, saved) {
  if (!saved || typeof saved !== "object") return base;
  Object.keys(saved).forEach((key) => {
    if (Array.isArray(saved[key])) {
      base[key] = saved[key];
    } else if (saved[key] && typeof saved[key] === "object" && base[key]) {
      base[key] = mergeContent(base[key], saved[key]);
    } else {
      base[key] = saved[key];
    }
  });
  return base;
}

function saveContent(content) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

function resetContent() {
  localStorage.removeItem(STORAGE_KEY);
}

function downloadJson(content, filename = "portfolio-content.json") {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
