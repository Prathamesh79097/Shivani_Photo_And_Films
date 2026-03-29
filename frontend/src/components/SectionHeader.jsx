const SectionHeader = ({ eyebrow, title, align = 'center', eyebrowClassName = '', titleClassName = '' }) => (
  <div className={`${align === 'left' ? 'text-left' : 'text-center'} space-y-3 mb-8`}>
    <p className={`text-xs tracking-[0.3em] uppercase text-amber-300/80 ${eyebrowClassName}`}>{eyebrow}</p>
    <h2 className={`text-3xl md:text-4xl font-display text-slate-50 ${titleClassName}`}>{title}</h2>
  </div>
);

export default SectionHeader;
