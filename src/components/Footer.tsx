export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-auto">
      <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} SchemeSathi AI. All rights reserved.</p>
        <p className="mt-2 text-xs text-gray-400">
          Disclaimer: This is an AI-powered assistant and not an official government website. 
          Always verify information on official portals.
        </p>
      </div>
    </footer>
  );
}
