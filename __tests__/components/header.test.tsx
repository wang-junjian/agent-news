import { render, screen } from "@testing-library/react";
import { Header } from "@/components/header";

// Mock next/link
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  FlaskConical: () => <span data-testid="icon-flask">FlaskConical</span>,
}));

describe("Header", () => {
  it("渲染标题", () => {
    render(<Header />);
    expect(screen.getByText("AI Tech Lab")).toBeInTheDocument();
  });

  it("渲染描述", () => {
    render(<Header />);
    expect(screen.getByText("前沿 AI 研究成果展示平台")).toBeInTheDocument();
  });
});
