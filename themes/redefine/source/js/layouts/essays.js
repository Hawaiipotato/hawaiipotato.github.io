// Function to format the dates
function formatEssayDates() {
  const dateElements = document.querySelectorAll(".essay-date");

  if (!dateElements) {
    return;
  }

  dateElements.forEach(function (element) {
    const rawDate = element.getAttribute("data-date");
    const locale = config.language || "en";

    const formattedDate = moment(rawDate).locale(locale).calendar();
    element.textContent = formattedDate;
  });
}

if (!window.__redefineEssaysHooked) {
  window.__redefineEssaysHooked = true;
  try {
    swup.hooks.on("page:view", formatEssayDates);
  } catch (e) {
    console.error(e);
  }

  document.addEventListener("DOMContentLoaded", formatEssayDates);
}
