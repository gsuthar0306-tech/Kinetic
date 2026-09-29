

const footerLinks =
{
  Support: ["Help Center", "Shipping & Returns", "Contact"],
  Company: ["About Kinetic", "Journal", "Careers"],
  Legal: ["Privacy", "Terms", "Accessibility"]
}

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white text-slate-600">
    <div className="mx-auto grid max-w-7xl gap-9 px-5 py-10 sm:px-8 sm:py-12 md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
      <div className="max-w-xs md:col-span-2 lg:col-span-1">
        <p className="text-xl font-black tracking-[0.18em] text-slate-950">KINETIC</p>
        <p className="mt-4 text-sm leading-6 text-slate-500">Precision-engineered electronics for quieter spaces and sharper thinking.</p>
      </div>
      {Object.entries(footerLinks).map(([title, links]) =>
        <div key={title}>
          <h2 className="text-xs font-semibold tracking-[0.16em] !text-slate-950">{title.toUpperCase()}</h2>
          <ul className="mt-4 space-y-3">{links.map((link) =>
            <li key={link}>
              <a href="#" className="text-sm text-slate-500 transition-colors hover:text-slate-950">{link}</a>
            </li>
          )}
          </ul>
        </div>)}
    </div>
    <div className="border-t border-slate-200 px-5 py-5 text-center text-xs text-slate-400">&copy; {new Date().getFullYear()} Kinetic. Designed for modern living.</div>
  </footer>
)

export default Footer
