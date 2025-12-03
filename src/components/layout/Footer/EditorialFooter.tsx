const EvolutionLogo = () => (
  <svg
    className="h-[1.05rem] w-[1.05rem] md:h-[1.2rem] md:w-[1.2rem]"
    viewBox="0 0 107.78 94.41"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M85.38,15.12c-1.96-2.03-4.1-3.89-6.38-5.55h0c-.87-.64-1.83-1.28-2.91-1.96h0C68.13,2.63,58.94,0,49.51,0,22.21,0,0,21.82,0,48.64c0,19.79,12.04,37.46,30.68,44.99,0,0,1.47,.59,2.37,.78l14.15-24.51,19.8,17.29L107.78,15.12h-22.4Zm-7.62,29.2l-13.67,24.16-11.69-9.3,5.72-10.28,2.43,1.12c-2.25-3.1-4.71-9.52-4.73-13.31l-25.3,43.82c-11.55-6.55-18.77-18.59-18.77-31.9-.01-20.33,16.93-36.89,37.76-36.89,7.23,0,14.26,2.01,20.34,5.82,.85,.53,1.58,1.02,2.23,1.5h0c2.31,1.68,4.42,3.63,6.28,5.78l1.76,2.03h14.26l-12.13,9.55-4.48,7.92v-.02Z" />
  </svg>
);

export function EditorialFooter({
  className = '',
}: {
  className?: string;
}) {
  const containerClass = `relative overflow-hidden footer-shell bg-es-text text-es-textSoft ${className}`;
  const innerClass =
    'footer-inner flex w-full items-end justify-between gap-4 px-4 pt-6 pb-4 text-es-textSoft/90 md:px-6 min-h-[100px]';
  const hoverColor = 'hover:text-es-bg';

  return (
    <footer className={containerClass}>
      <div className={innerClass}>
        <div className="footer-logo flex items-center">
          <span aria-label="Evolution Stables">
            <EvolutionLogo />
          </span>
        </div>

        <div className="footer-icons flex items-center gap-4 md:gap-6">
          <a
            href="https://x.com/evostables"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition flex items-center ${hoverColor}`}
            aria-label="Follow us on X"
          >
            <svg className="h-4 w-4 md:h-[1.15rem] md:w-[1.15rem]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://instagram.com/evostables"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition flex items-center ${hoverColor}`}
            aria-label="Follow us on Instagram"
          >
            <svg className="h-4 w-4 md:h-[1.15rem] md:w-[1.15rem]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/alex-baddeley/"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition flex items-center ${hoverColor}`}
            aria-label="Connect on LinkedIn"
          >
            <svg className="h-4 w-4 md:h-[1.15rem] md:w-[1.15rem]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="mailto:alex@evolutionstables.nz"
            className={`transition flex items-center ${hoverColor}`}
            aria-label="Send us an email"
          >
            <svg className="h-4 w-4 md:h-[1.15rem] md:w-[1.15rem]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
