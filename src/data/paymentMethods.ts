export interface PaymentMethod {
  id: string
  name: string
  /** Argument court affiché sous le nom, pas un slogan. */
  hint: string
  /** Numéro déjà connu du compte, affiché masqué. */
  maskedPhone: string
  /** Couleur de la pastille, dans les teintes de l'opérateur. */
  swatch: string
}

/**
 * Le premier de la liste est celui proposé par défaut : sur une billetterie
 * sénégalaise, Wave concentre l'essentiel des paiements.
 */
export const paymentMethods: PaymentMethod[] = [
  {
    id: 'wave',
    name: 'Wave',
    hint: '0 % de commission',
    maskedPhone: '77 •• •• 67',
    swatch: 'bg-[#1DC3F0] text-white',
  },
  {
    id: 'orange-money',
    name: 'Orange Money',
    hint: 'Validation par notification',
    maskedPhone: '77 •• •• 12',
    swatch: 'bg-[#FF7900] text-white',
  },
  {
    id: 'free-money',
    name: 'Free Money',
    hint: 'Confirmation USSD',
    maskedPhone: '76 •• •• 40',
    swatch: 'bg-[#E3262E] text-white',
  },
  {
    id: 'card',
    name: 'Carte bancaire',
    hint: '3D Secure Visa & Mastercard',
    maskedPhone: '•••• 4921',
    swatch: 'bg-on-surface text-white',
  },
]
