let windowScrollRegistered = false;

function throttle(func, limit) {
  let inThrottle;
  return function () {
    if (!inThrottle) {
      func.apply(this, arguments);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function setActiveNavItem() {
  const navItems = document.querySelectorAll(".bookmark-nav-item");
  const sections = document.querySelectorAll("section[id]");
  if (!navItems.length || !sections.length) return;

  const fromTop = window.scrollY + 100;
  let currentSection = null;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (fromTop >= sectionTop && fromTop < sectionTop + sectionHeight) {
      currentSection = section;
    }
  });

  navItems.forEach((item) => {
    item.classList.remove("bg-second-background-color");
    if (
      currentSection &&
      item.getAttribute("data-category") === currentSection.getAttribute("id")
    ) {
      item.classList.add("bg-second-background-color");
    }
  });
}

export default function initBookmarkNav() {
  const hasBookmarkNav =
    document.querySelector(".bookmark-nav-item") &&
    document.querySelector("section[id]");
  if (!hasBookmarkNav) return;

  if (!windowScrollRegistered) {
    window.addEventListener("scroll", throttle(setActiveNavItem, 100));
    windowScrollRegistered = true;
  }

  setActiveNavItem();
}
