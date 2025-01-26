import { useTheme } from '../context/ThemeContext';

export function useThemeStyles() {
  const { theme } = useTheme();

  if (theme === 'dark') {
    return {
      // Fonds principaux
      bgColor: 'bg-black',
      cardBgColor: 'bg-[#0D0D0D] backdrop-blur-lg bg-opacity-90',
      itemBgColor: 'bg-[#141414]',
      
      // Textes
      textColor: 'text-[#E6E6E6]',
      textMutedColor: 'text-[#666666]',
      
      // Bordures et accents
      borderColor: 'border-[#333333]',
      accentColor: 'bg-gradient-to-r from-[#FF0055] to-[#FF00FF]',
      hoverAccentColor: 'hover:from-[#FF1A70] hover:to-[#FF1AFF]',
      
      // Effets néon
      neonShadow: 'shadow-[0_0_15px_rgba(255,0,85,0.3)]',
      neonBorder: 'border-[#FF0055]',
      neonText: 'text-[#FF0055]',
      
      // Gradients
      cardGradient: 'bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A]',
      buttonGradient: 'bg-gradient-to-r from-[#FF0055] to-[#FF00FF]',
      hoverButtonGradient: 'hover:from-[#FF1A70] hover:to-[#FF1AFF]',
      
      // Effets de survol
      hoverEffect: 'hover:bg-[#1A1A1A] hover:shadow-[0_0_10px_rgba(255,0,85,0.2)]',
      
      // Effets de glitch (à utiliser avec parcimonie)
      glitchEffect: 'animate-glitch',

     // New Note Button styles (Dark theme)
     newButton: `group relative bg-[#4783ff] text-white border-none rounded-md transition-colors w-max
      py-2 px-3 flex items-center justify-between shadow-[0_1px_5px_rgba(0,0,0,0.2)] 
      hover:bg-[#3064cc]
      focus:outline-none focus:shadow-[0_2px_8px_rgba(0,0,0,0.3)] `,


      
    };
  }

  // Theme clair (inchangé)
  return {
  // Fonds principaux
  bgColor: 'bg-gradient-to-br from-[#E6E6FA] to-[#F5F5F5]', // Dégradé clair, futuriste
  cardBgColor: 'bg-white backdrop-blur-lg bg-opacity-80', // Fond des cartes translucide
  itemBgColor: 'bg-[#F2F2F2]', // Fond léger pour les éléments individuels

  // Textes
  textColor: 'text-gray-800', // Texte principal sombre pour lisibilité
  textMutedColor: 'text-gray-500', // Texte secondaire plus doux

  // Bordures et accents
  borderColor: 'border-gray-300', // Bordures subtiles
  accentColor: 'bg-gradient-to-r from-[#FF55FF] to-[#FFAAFF]', // Accent néon rose clair
  hoverAccentColor: 'hover:from-[#FF77FF] hover:to-[#FFCCFF]', // Survol rose plus vif

  // Effets néon
  neonShadow: 'shadow-[0_0_15px_rgba(255,85,255,0.5)]', // Ombre néon douce
  neonBorder: 'border-[#FF77FF]', // Bordure néon claire
  neonText: 'text-[#FF55FF]', // Texte néon rose vif

  // Gradients
  cardGradient: 'bg-gradient-to-br from-[#FFFFFF] to-[#F0F0FF]', // Gradient élégant
  buttonGradient: 'bg-gradient-to-r from-[#1E90FF] to-[#00BFFF]', // Gradient des boutons
  hoverButtonGradient: 'hover:from-[#1E90FF] hover:to-[#1E90FF]', // Survol des
  // Effets de survol
  hoverEffect: 'hover:bg-[#F5F5FF] hover:shadow-[0_0_10px_rgba(30,144,255,0.3)]',

  // Effets de glitch
  glitchEffect: 'animate-glitch', // Effet glitch conservé si utilisé

  // New Note Button styles (Light theme)
 newButton: `group relative bg-[#4783ff] text-white border-none rounded-md transition-colors w-max
        py-2 px-3 flex items-center justify-between shadow-[0_1px_5px_rgba(0,0,0,0.2)] 
        hover:bg-[#3064cc]
        focus:outline-none focus:shadow-[0_2px_8px_rgba(0,0,0,0.3)] `,
  };
}