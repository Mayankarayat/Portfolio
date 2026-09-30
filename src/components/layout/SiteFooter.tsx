import { profile } from "@/content/profile";
import { Icon } from "@/components/ui/Icon";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-4 py-10 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with Next.js, TypeScript and three.js.
        </p>
        <a href="#top" className="inline-flex items-center gap-2 transition-colors hover:text-fg">
          Back to top <Icon name="arrowUp" size={15} />
        </a>
      </div>
    </footer>
  );
}
