const initScrollTopBottom = () => {
  const backToTopButton_dom = document.querySelector(".tool-scroll-to-top");
  const backToBottomButton_dom = document.querySelector(
    ".tool-scroll-to-bottom",
  );

  const backToTop = () => {
    window.scrollTo({
      top: 0, // scrolls to the top of the page
      behavior: "smooth",
    });
  };

  const backToBottom = () => {
    const docHeight = document.body.scrollHeight;
    window.scrollTo({
      top: docHeight, // scrolls to the bottom of the page
      behavior: "smooth",
    });
  };

  const initBackToTop = () => {
    if (!backToTopButton_dom || backToTopButton_dom.dataset.listenerBound) {
      return;
    }
    backToTopButton_dom.dataset.listenerBound = "1";
    backToTopButton_dom.addEventListener("click", backToTop);
  };

  const initBackToBottom = () => {
    if (
      !backToBottomButton_dom ||
      backToBottomButton_dom.dataset.listenerBound
    ) {
      return;
    }
    backToBottomButton_dom.dataset.listenerBound = "1";
    backToBottomButton_dom.addEventListener("click", backToBottom);
  };

  initBackToTop();
  initBackToBottom();
};

export default initScrollTopBottom;
