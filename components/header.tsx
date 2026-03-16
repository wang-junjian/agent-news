import Link from "next/link";
import { FlaskConical } from "lucide-react";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <FlaskConical className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Tech Lab</h1>
            <p className="text-sm text-gray-600">前沿 AI 研究成果展示平台</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
