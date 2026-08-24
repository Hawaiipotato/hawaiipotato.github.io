let lazyLoadObserver;

export default function initLazyLoad() {
  lazyLoadObserver?.disconnect();

  const imgs = document.querySelectorAll("img");
  const options = {
    rootMargin: "0px",
    threshold: 0.1,
  };
  lazyLoadObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute("data-src");
        img.removeAttribute("lazyload");
        observer.unobserve(img);
      }
    });
  }, options);
  imgs.forEach((img) => {
    if (img.hasAttribute("lazyload")) {
      lazyLoadObserver.observe(img);
    }
  });
}
