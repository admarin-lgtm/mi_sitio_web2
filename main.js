const tabButtons = document.querySelectorAll('[role="tab"]');
const filterButtons = document.querySelectorAll("[data-filter]");
const riskCards = document.querySelectorAll("[data-risk]");
const emptyFilterMessage = document.querySelector(".filter-empty");
const feedbackForm = document.querySelector("#feedback-form");
const validateFeedbackButton = document.querySelector("#validate-feedback");
const feedbackStatus = document.querySelector("#feedback-status");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((tab) => {
      const selected = tab === button;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.setAttribute("tabindex", selected ? "0" : "-1");
      document.getElementById(tab.getAttribute("aria-controls")).hidden = !selected;
    });
  });

  button.addEventListener("keydown", (event) => {
    const currentIndex = Array.from(tabButtons).indexOf(button);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabButtons.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabButtons.length - 1;
    if (nextIndex === currentIndex) return;

    event.preventDefault();
    tabButtons[nextIndex].focus();
    tabButtons[nextIndex].click();
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((filterButton) => {
      const selected = filterButton === button;
      filterButton.classList.toggle("is-active", selected);
      filterButton.setAttribute("aria-pressed", String(selected));
    });

    riskCards.forEach((card) => {
      const visible = filter === "all" || card.dataset.risk === filter;
      card.hidden = !visible;
      visibleCount += Number(visible);
    });

    emptyFilterMessage.hidden = visibleCount > 0;
  });
});

if (feedbackForm && validateFeedbackButton && feedbackStatus) {
  const clearFeedbackStatus = () => {
    feedbackStatus.hidden = true;
    feedbackStatus.classList.remove("is-error");
    feedbackStatus.textContent = "";
  };

  feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
  feedbackForm.addEventListener("input", clearFeedbackStatus);
  feedbackForm.addEventListener("change", clearFeedbackStatus);

  validateFeedbackButton.addEventListener("click", () => {
    feedbackStatus.hidden = false;

    if (!feedbackForm.reportValidity()) {
      feedbackStatus.classList.add("is-error");
      feedbackStatus.textContent = "Revisa los campos obligatorios indicados antes de continuar.";
      return;
    }

    feedbackStatus.classList.remove("is-error");
    feedbackStatus.textContent = "Validación local correcta. Tus respuestas no se enviaron ni guardaron; para recolectarlas es necesario conectar una plataforma o servidor.";
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    history.pushState(null, "", link.getAttribute("href"));
    target.setAttribute("tabindex", "-1");
    target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    target.focus({ preventScroll: true });
  });
});

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("js-motion");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
}
