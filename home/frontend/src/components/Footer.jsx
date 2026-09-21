import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-farm-dark text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-farm-gold/25 to-transparent" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-farm-green/[0.04] rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-farm-gold/[0.03] rounded-full blur-[80px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="w-11 h-11 bg-farm-green rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-400 shadow-lg shadow-farm-green/20">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[17px] block leading-tight tracking-tight">GreenFields</span>
                <span className="text-farm-gold text-[10px] tracking-[0.22em] uppercase font-semibold">Premium Poultry</span>
              </div>
            </Link>
            <p className="text-gray-500 text-[14px] leading-[1.75] max-w-xs">
              Providing fresh, healthy poultry products directly from our farm to your table since 2019.
            </p>
            <div className="flex gap-3.5 pt-1">
              {[
                <path key="tw" d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>,
                <path key="ig" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>,
                <path key="fb" d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>,
              ].map((path, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-white/[0.04] rounded-full flex items-center justify-center text-gray-500 hover:text-farm-gold hover:bg-farm-gold/10 transition-all duration-350 border border-white/[0.04]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{path}</svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[12px] tracking-[0.12em] uppercase mb-7 text-white/80">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Shop', path: '/shop' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer-link text-gray-500 text-[14px] inline-block hover:text-farm-gold">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[12px] tracking-[0.12em] uppercase mb-7 text-white/80">Products</h3>
            <ul className="space-y-4">
              {['Broiler Chickens', 'Layers', 'Turkey', 'Fresh Eggs'].map((item) => (
                <li key={item}>
                  <span className="footer-link text-gray-500 text-[14px] cursor-pointer hover:text-farm-gold">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[12px] tracking-[0.12em] uppercase mb-7 text-white/80">Contact Us</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 text-gray-500 text-[14px]">
                <div className="w-9 h-9 bg-white/[0.04] rounded-[12px] flex items-center justify-center shrink-0 mt-0.5 border border-white/[0.04]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="leading-[1.6]">123 Farm Road, Green Valley, Country</span>
              </li>
              <li className="flex items-center gap-4 text-gray-500 text-[14px]">
                <div className="w-9 h-9 bg-white/[0.04] rounded-[12px] flex items-center justify-center shrink-0 border border-white/[0.04]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                +1 (234) 567-890
              </li>
              <li className="flex items-center gap-4 text-gray-500 text-[14px]">
                <div className="w-9 h-9 bg-white/[0.04] rounded-[12px] flex items-center justify-center shrink-0 border border-white/[0.04]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                info@greenfieldspoultry.com
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-line mt-20 mb-8" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-[12px] tracking-wide">
            &copy; 2026 GreenFields Poultry. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-gray-600 text-[12px] hover:text-farm-gold transition-colors duration-300 tracking-wide">Privacy Policy</a>
            <a href="#" className="text-gray-600 text-[12px] hover:text-farm-gold transition-colors duration-300 tracking-wide">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
