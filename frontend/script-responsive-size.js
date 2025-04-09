const hamburger = document.getElementById("hamburger-menue");
const sidebar = document.querySelector(".sidebar");

hamburger.addEventListener("click", () => {
  sidebar.style.display = sidebar.style.display === "flex" ? "none" : "flex";
});