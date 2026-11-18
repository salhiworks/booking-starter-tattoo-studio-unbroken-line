/** The page's sections, in order — the header, the phone menu and the footer all list these. */
export const NAV: readonly { href: string; label: string; header?: false }[] = [
  { href: '#work', label: 'Work' },
  { href: '#flash', label: 'Flash' },
  { href: '#process', label: 'Process' },
  { href: '#prices', label: 'Prices' },
  { href: '#questions', label: 'Before you book', header: false },
  { href: '#visit', label: 'Visit' },
];
