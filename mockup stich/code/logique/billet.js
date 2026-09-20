// Interactions de l ecran Billet
// Source : 04-billet.html

tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: {
              DEFAULT: '#934b00',
              container: '#f07e00',
            },
            fodium: {
              50: '#fff8ed',
              100: '#ffefd5',
              200: '#fed7aa',
              500: '#f97316',
              600: '#ea580c',
              700: '#c2410c',
              900: '#7c2d12',
            }
          },
          fontFamily: {
            sans: ['Plus Jakarta Sans', 'sans-serif'],
            display: ['Plus Jakarta Sans', 'sans-serif'],
            mono: ['Space Mono', 'monospace'],
          }
        }
      }
    }

// ---

const barcodeBtn = document.getElementById('toggle-barcode-btn');
  const qrcodeBtn = document.getElementById('toggle-qrcode-btn');
  const barcodeContainer = document.getElementById('barcode-container');
  const qrcodeContainer = document.getElementById('qrcode-container');

  barcodeBtn.addEventListener('click', () => {
    barcodeBtn.className = "px-3.5 py-1 rounded-full text-[11px] font-bold transition duration-200 bg-white shadow-sm text-neutral-900";
    qrcodeBtn.className = "px-3.5 py-1 rounded-full text-[11px] font-semibold transition duration-200 text-neutral-500 hover:text-neutral-900";
    barcodeContainer.classList.remove('hidden');
    qrcodeContainer.classList.add('hidden');
    qrcodeContainer.classList.remove('flex');
  });

  qrcodeBtn.addEventListener('click', () => {
    qrcodeBtn.className = "px-3.5 py-1 rounded-full text-[11px] font-bold transition duration-200 bg-white shadow-sm text-neutral-900";
    barcodeBtn.className = "px-3.5 py-1 rounded-full text-[11px] font-semibold transition duration-200 text-neutral-500 hover:text-neutral-900";
    qrcodeContainer.classList.remove('hidden');
    qrcodeContainer.classList.add('flex');
    barcodeContainer.classList.add('hidden');
  });
