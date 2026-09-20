// Interactions de l ecran Mes billets
// Source : 05-mes-billets.html

function switchFilter(type) {
    const activeBtn = document.getElementById('tab-active');
    const expiredBtn = document.getElementById('tab-expired');
    const activeContainer = document.getElementById('active-tickets-container');
    const expiredContainer = document.getElementById('expired-tickets-container');

    if (type === 'active') {
      activeBtn.className = 'flex-1 py-2 px-3 rounded-full bg-surface-container-lowest text-primary-container font-label-md text-label-md font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all';
      expiredBtn.className = 'flex-1 py-2 px-3 rounded-full text-secondary font-label-md text-label-md font-medium flex items-center justify-center gap-1.5 transition-all';
      if (activeContainer) activeContainer.style.display = 'flex';
      if (expiredContainer) expiredContainer.style.display = 'flex';
    } else {
      expiredBtn.className = 'flex-1 py-2 px-3 rounded-full bg-surface-container-lowest text-primary-container font-label-md text-label-md font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all';
      activeBtn.className = 'flex-1 py-2 px-3 rounded-full text-secondary font-label-md text-label-md font-medium flex items-center justify-center gap-1.5 transition-all';
      if (activeContainer) activeContainer.style.display = 'none';
      if (expiredContainer) {
        expiredContainer.style.display = 'flex';
        expiredContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function openTicketDetails(ticketId) {
    // Navigate or trigger detail view modal corresponding to SCREEN_6 Billet Officiel
    console.log("Opening official ticket view for:", ticketId);
  }
