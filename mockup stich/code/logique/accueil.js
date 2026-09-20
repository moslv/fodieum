// Interactions de la page d accueil
// Source : 01-accueil.html

(function() {
    // Search tab buttons logic
    const btnEvents = document.getElementById('tab-events');
    const btnTransit = document.getElementById('tab-transit');

    if (btnEvents && btnTransit) {
      btnEvents.addEventListener('click', () => {
        btnEvents.className = "px-3.5 py-1.5 rounded-full font-label-sm text-label-sm font-bold transition-all bg-white text-primary shadow-sm";
        btnTransit.className = "px-3.5 py-1.5 rounded-full font-label-sm text-label-sm text-secondary font-medium transition-all hover:text-on-surface";
      });

      btnTransit.addEventListener('click', () => {
        btnTransit.className = "px-3.5 py-1.5 rounded-full font-label-sm text-label-sm font-bold transition-all bg-white text-primary shadow-sm";
        btnEvents.className = "px-3.5 py-1.5 rounded-full font-label-sm text-label-sm text-secondary font-medium transition-all hover:text-on-surface";
      });
    }

    // Carousel indicator update on scroll
    const carousel = document.getElementById('featured-carousel');
    const dots = document.querySelectorAll('#carousel-dots .carousel-dot');
    if (carousel && dots.length > 0) {
      carousel.addEventListener('scroll', () => {
        const scrollIndex = Math.round(carousel.scrollLeft / (carousel.offsetWidth * 0.8));
        dots.forEach((dot, idx) => {
          if (idx === scrollIndex) {
            dot.className = "carousel-dot h-2 w-6 rounded-full bg-primary transition-all duration-300";
          } else {
            dot.className = "carousel-dot h-2 w-2 rounded-full bg-outline-variant/60 hover:bg-outline-variant transition-all duration-300";
          }
        });
      });
      dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
          if (carousel.children[idx]) {
            carousel.children[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        });
      });
    }
  })();
