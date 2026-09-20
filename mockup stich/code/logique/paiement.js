// Selection du moyen de paiement (Wave/OM/Free/Carte) + faux submit
// Source : 03-paiement.html

let currentMethod = 'wave';

    const methodDetails = {
      wave: {
        label: 'Numéro de paiement Wave',
        subtext: '0% de commission',
        placeholder: '77 123 45 67',
        cta: 'Payer 30 600 XOF et émettre le billet'
      },
      om: {
        label: 'Numéro Orange Money (#144#)',
        subtext: 'Code ou validation push',
        placeholder: '77 000 00 00',
        cta: 'Valider 30 600 XOF via Orange Money'
      },
      free: {
        label: 'Numéro Free Money',
        subtext: 'Validation via notification USSD',
        placeholder: '76 000 00 00',
        cta: 'Payer 30 600 XOF via Free Money'
      },
      card: {
        label: 'Téléphone pour reçu bancaire',
        subtext: '3D Secure Visa & Mastercard',
        placeholder: '77 123 45 67',
        cta: 'Procéder au paiement par Carte'
      }
    };

    function choosePayment(id) {
      currentMethod = id;
      const methods = ['wave', 'om', 'free', 'card'];

      methods.forEach(m => {
        const card = document.getElementById('card-' + m);
        const check = document.getElementById('check-' + m);
        if (m === id) {
          card.className = 'payment-method-card relative p-2.5 rounded-2xl flex flex-col items-center justify-center space-y-1.5 transition-all duration-200 border-2 border-primary-container bg-primary-container/5 shadow-sm text-center';
          check.classList.remove('hidden');
        } else {
          card.className = 'payment-method-card relative p-2.5 rounded-2xl flex flex-col items-center justify-center space-y-1.5 transition-all duration-200 border-2 border-transparent bg-surface-container-low text-center opacity-85 hover:opacity-100';
          check.classList.add('hidden');
        }
      });

      const config = methodDetails[id];
      document.getElementById('phone-label').innerText = config.label;
      document.getElementById('payment-subtext').innerText = config.subtext;
      document.getElementById('phone-input').value = config.placeholder;
      document.getElementById('cta-label').innerText = config.cta;
    }

    function processPayment() {
      const btn = document.getElementById('submit-ticket-btn');
      btn.disabled = true;
      btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[22px]">progress_activity</span><span class="ml-2">Émission du billet en cours...</span>';
      
      setTimeout(() => {
        btn.classList.remove('from-[#F07E00]', 'to-[#e65100]');
        btn.classList.add('bg-tertiary');
        btn.innerHTML = '<span class="material-symbols-outlined text-[22px]">verified</span><span class="ml-1.5 font-bold">Billet émis avec succès !</span>';
      }, 1200);
    }
