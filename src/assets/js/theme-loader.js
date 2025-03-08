(function () {
  const savedTheme = localStorage.getItem("theme") || "default-theme";

  document.documentElement.classList.add(savedTheme);

  document.documentElement.classList.remove(
    savedTheme === "default-theme" ? "azure-blue-theme" : "default-theme"
  );
})();
