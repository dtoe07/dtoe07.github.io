// add event listener to manipulate site behavior after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Close the Navbar on Link Click on hamburger menu for mobile view
  const navLinks = document.querySelectorAll(".nav-link");
  const navbarCollapse = document.getElementById("navbarNav");
  const bootstrapCollapse = new bootstrap.Collapse(navbarCollapse, {
    toggle: false,
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navbarCollapse.classList.contains("show")) {
        bootstrapCollapse.hide();
      }
    });
  });

  // --- Scrolling animation fading in using IntersectionObserver ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    { threshold: 0.1 } // Trigger when 10% of the element is visible
  );

  // Observe any element with the "animate-on-scroll" class
  const elementsToAnimate = document.querySelectorAll(".animate-on-scroll");
  elementsToAnimate.forEach((element) => {
    observer.observe(element);
  });

  // Contact Form Validation
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
    event.stopPropagation(); // Stop further propagation of the event

    if (form.checkValidity()) {
      // If form is valid
      const btn = form.querySelector('button[type="submit"]'); // Get the submit button
      const originalText = btn.innerText; // Store original button text

      btn.innerText = "Sending..."; // Change button text to indicate sending
      btn.disabled = true; // Disable the button to prevent multiple submissions

      // Simulate form submission delay for now
      setTimeout(() => {
        alert("Thanks for contacting me! I will get back to you soon.");
        form.reset();
        form.classList.remove("was-validated");
        btn.innerText = originalText;
        btn.disabled = false;
      }, 1500);
    } else {
      // If form is invalid
      form.classList.add("was-validated"); // Add Bootstrap validation class
      const firstInvalid = form.querySelector(":invalid"); // Find the first invalid input
      if (firstInvalid) firstInvalid.focus(); // Focus on the first invalid input
    }

    // Toggle invalid/valid classes for visual feedback
    Array.from(form.elements).forEach((input) => {
      // Iterate through form elements
      if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
        // Check if element is either input or textarea only
        if (!input.checkValidity()) {
          // If input is invalid, change the box to red
          input.classList.add("is-invalid"); // Add invalid class for styling to show error message
          input.classList.remove("is-valid"); // Remove valid class if present
        } else {
          // If input is valid, change the box to green
          input.classList.remove("is-invalid"); // Remove invalid class if present
          input.classList.add("is-valid"); // Add valid class for styling to show success
        }
      }
    });
  });

  // Loading the images for the gallery slider
  const IMAGES = [
    "assets/gallery/soccer1.jpg",
    "assets/gallery/soccer2.jpg",
    "assets/gallery/cooking1.jpg",
    "assets/gallery/drone1.jpg",
    "assets/gallery/drone2.jpg",
    "assets/gallery/drone3.jpg",
    "assets/gallery/fishing1.jpg",
    "assets/gallery/work1.jpg",
  ];

  // --- Setup DOM ---
  const track = document.getElementById("slider-track");
  const container = document.getElementById("slider-container");

  // Check if gallery elements exist before proceeding
  if (track && container) {
    // Populate Images
    IMAGES.forEach((url, index) => {
      const card = document.createElement("div");
      // Custom classes for the image card
      card.className = "img-card flex-shrink-0";

      const displayName = formatDisplayName(url);
      const rawFilename = url.split("/").pop();

      // Set inner HTML of the card with image and overlay title
      // with file name as alt text for accessibility
      card.innerHTML = `
        <img src="${url}" alt="${rawFilename}" class="img-card-img">
        <div class="img-card-overlay">
            <h3 class="img-card-title">${displayName}</h3>
        </div>
      `;
      track.appendChild(card);
    });

    // --- Physics Engine ---
    let state = {
      isDragging: false,
      isHovering: false,
      currentX: 0,
      startX: 0,
      lastX: 0,
      velocity: 0,
      rafId: null,
      autoScrollDir: -1,
    };

    const config = {
      friction: 0.95,
      rubberBand: 0.15,
      bounce: 0.1,
      autoSpeed: 1.0,
    };

    const getX = (e) => e.pageX || e.touches[0].pageX;

    const startDrag = (e) => {
      state.isDragging = true;
      state.startX = getX(e) - state.currentX;
      state.lastX = getX(e);
      state.velocity = 0;

      container.classList.add("grabbing");
      container.classList.remove("grab");

      cancelAnimationFrame(state.rafId);
      state.rafId = requestAnimationFrame(animate);
    };

    const moveDrag = (e) => {
      if (!state.isDragging) return;
      e.preventDefault();

      const x = getX(e);
      const moveX = x - state.startX;
      const delta = x - state.lastX;
      state.velocity = delta;
      state.lastX = x;

      const trackWidth = track.scrollWidth;
      const containerWidth = container.offsetWidth;
      const minX = -(trackWidth - containerWidth);
      const maxX = 0;

      if (moveX > maxX) {
        state.currentX = maxX + (moveX - maxX) * config.rubberBand;
      } else if (moveX < minX) {
        state.currentX = minX + (moveX - minX) * config.rubberBand;
      } else {
        state.currentX = moveX;
      }
    };

    const endDrag = () => {
      state.isDragging = false;
      container.classList.remove("grabbing");
      container.classList.add("grab");
    };

    const animate = () => {
      if (!state.isDragging) {
        state.currentX += state.velocity;
        state.velocity *= config.friction;

        if (Math.abs(state.velocity) < 1 && !state.isHovering) {
          state.currentX += config.autoSpeed * state.autoScrollDir;
        }

        const trackWidth = track.scrollWidth;
        const containerWidth = container.offsetWidth;
        const minX = -(trackWidth - containerWidth);
        const maxX = 0;

        if (state.currentX > maxX) {
          const force = (maxX - state.currentX) * config.bounce;
          state.velocity += force;
          state.velocity *= 0.9;
          state.autoScrollDir = -1;
        } else if (state.currentX < minX) {
          const force = (minX - state.currentX) * config.bounce;
          state.velocity += force;
          state.velocity *= 0.9;
          state.autoScrollDir = 1;
        }
      }

      track.style.transform = `translateX(${state.currentX}px)`;
      state.rafId = requestAnimationFrame(animate);
    };

    // init event listeners for dragging and hovering
    container.addEventListener("mousedown", startDrag);
    container.addEventListener("touchstart", startDrag);

    container.addEventListener("mouseenter", () => (state.isHovering = true));
    container.addEventListener("mouseleave", () => (state.isHovering = false));

    window.addEventListener("mousemove", moveDrag);
    window.addEventListener("touchmove", moveDrag, { passive: false });

    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchend", endDrag);
    window.addEventListener("mouseleave", () => {
      if (state.isDragging) endDrag();
    });

    animate();
    window.addEventListener("resize", () => {});
  }

  /**
   * Formats a URL string into a clean display name.
   * It removes the file extension and any numbers.
   * @param {string} url The full URL or path to the image.
   * @returns {string} The formatted display name.
   */
  function formatDisplayName(url) {
    const rawFilename = url.split("/").pop();
    // Remove the file extension (e.g., .jpg) and any numbers
    return rawFilename.split(".")[0].replace(/\d/g, "");
  }
});
