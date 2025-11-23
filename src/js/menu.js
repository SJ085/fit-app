const current = window.location.pathname.split("/").pop();

document.querySelectorAll("nav a").forEach((link) => {
  const isActive = link.getAttribute("href").includes(current);

  if (isActive) {
    link.classList.add("text-white");
    link.querySelector("span:nth-child(2)")?.classList.add("font-semibold");
  }
});