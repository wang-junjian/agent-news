import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <FlaskConical className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{siteConfig.title}</h1>
            <p className="text-sm text-gray-600">{siteConfig.description}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
