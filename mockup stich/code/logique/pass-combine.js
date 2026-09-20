// Recalcul du prix billet seul / billet+navette + selection du point de ramassage
// Source : 02-detail-evenement.html

(function() {
    let currentTier = 'shuttle';
    let qty = 1;
    const priceSolo = 25500;
    const priceShuttle = 30600;

    const btnSolo = document.getElementById('btnSolo');
    const btnShuttle = document.getElementById('btnShuttle');
    const shuttleSection = document.getElementById('shuttleSection');
    const totalPriceDisplay = document.getElementById('totalPriceDisplay');
    const qtyDisplay = document.getElementById('qtyDisplay');
    const minusBtn = document.getElementById('minusQty');
    const plusBtn = document.getElementById('plusQty');
    const favBtn = document.getElementById('favBtn');
    const favIcon = document.getElementById('favIcon');
    const followBtn = document.getElementById('followBtn');
    const pickupChips = document.querySelectorAll('.pickup-chip');

    function updateView() {
      const unit = currentTier === 'shuttle' ? priceShuttle : priceSolo;
      const total = unit * qty;
      totalPriceDisplay.textContent = total.toLocaleString('fr-FR') + ' XOF';
      qtyDisplay.textContent = qty;

      if (currentTier === 'shuttle') {
        shuttleSection.style.display = 'flex';
        btnShuttle.className = "flex flex-col p-2.5 rounded-2xl bg-primary-fixed/50 text-left relative transition-all active:scale-98 shadow-sm";
        btnSolo.className = "flex flex-col p-2.5 rounded-2xl bg-surface-container-low text-left transition-all active:scale-98";
      } else {
        shuttleSection.style.display = 'none';
        btnSolo.className = "flex flex-col p-2.5 rounded-2xl bg-primary-fixed/50 text-left relative transition-all active:scale-98 shadow-sm";
        btnShuttle.className = "flex flex-col p-2.5 rounded-2xl bg-surface-container-low text-left transition-all active:scale-98";
      }
    }

    btnSolo.addEventListener('click', () => {
      currentTier = 'solo';
      updateView();
    });

    btnShuttle.addEventListener('click', () => {
      currentTier = 'shuttle';
      updateView();
    });

    minusBtn.addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        updateView();
      }
    });

    plusBtn.addEventListener('click', () => {
      if (qty < 4) {
        qty++;
        updateView();
      }
    });

    pickupChips.forEach(chip => {
      chip.addEventListener('click', () => {
        pickupChips.forEach(c => {
          c.className = "pickup-chip px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-sm text-label-sm whitespace-nowrap transition-colors";
        });
        chip.className = "pickup-chip px-2.5 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm whitespace-nowrap transition-colors";
      });
    });

    let favorited = false;
    favBtn.addEventListener('click', () => {
      favorited = !favorited;
      if (favorited) {
        favIcon.style.fontVariationSettings = "'FILL' 1";
        favBtn.classList.add('text-primary-container');
      } else {
        favIcon.style.fontVariationSettings = "'FILL' 0";
        favBtn.classList.remove('text-primary-container');
      }
    });

    let followed = false;
    followBtn.addEventListener('click', () => {
      followed = !followed;
      if (followed) {
        followBtn.textContent = "Abonné";
        followBtn.className = "px-3.5 py-1.5 rounded-full bg-primary-container text-white font-label-sm text-label-sm transition-colors active:scale-95";
      } else {
        followBtn.textContent = "Suivre";
        followBtn.className = "px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors active:scale-95";
      }
    });

    updateView();
  })();
