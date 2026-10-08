(() => {
  "use strict";

  const config = window.MOFLOW_CONFIG || {};
  document.body.classList.add("has-js");

  const formUrl = config.formUrl || "../index.html";
  document.querySelectorAll(".form-link").forEach((link) => {
    link.href = formUrl;
  });

  if (config.siteUrl && /^https?:\/\//i.test(config.siteUrl)) {
    const canonical = document.getElementById("canonical-link");
    if (canonical) canonical.href = config.siteUrl.replace(/\/$/, "") + "/";
  }

  const socialUrls = {
    facebook: config.facebookUrl,
    instagram: config.instagramUrl,
    whatsapp: config.whatsappUrl
  };
  let hasSocialLink = false;
  Object.entries(socialUrls).forEach(([network, url]) => {
    if (!url || !/^https?:\/\//i.test(url)) return;
    const link = document.querySelector(`[data-social="${network}"]`);
    if (!link) return;
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.hidden = false;
    hasSocialLink = true;
  });
  const socialLinks = document.querySelector(".social-links");
  if (socialLinks && hasSocialLink) socialLinks.hidden = false;

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("primary-navigation");
  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  };

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      menuButton.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
      navigation.classList.toggle("is-open", !expanded);
    });
    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuButton.focus();
      }
    });
    document.addEventListener("click", (event) => {
      if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
})();
