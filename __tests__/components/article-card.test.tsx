import { render, screen } from "@testing-library/react";
import { ArticleCard } from "@/components/article-card";
import type { Article } from "@/db/schema";

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

// Mock shadcn/ui components
jest.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <h3 data-testid="card-title" className={className}>{children}</h3>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) => (
    <span data-testid="badge" data-variant={variant} className={className}>{children}</span>
  ),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Calendar: () => <span data-testid="icon-calendar">Calendar</span>,
  User: () => <span data-testid="icon-user">User</span>,
}));

const mockArticle: Article = {
  id: 1,
  title: "测试文章标题",
  content: "# 测试内容\n\n这是测试内容",
  summary: "这是文章的摘要",
  category: "NLP",
  author: "AI Agent",
  tags: ["测试", "AI"],
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

describe("ArticleCard", () => {
  it("渲染文章标题", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText("测试文章标题")).toBeInTheDocument();
  });

  it("渲染文章摘要", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText("这是文章的摘要")).toBeInTheDocument();
  });

  it("渲染文章分类", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText("NLP")).toBeInTheDocument();
  });

  it("渲染文章作者", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText("AI Agent")).toBeInTheDocument();
  });

  it("渲染文章标签", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText("测试")).toBeInTheDocument();
    expect(screen.getByText("AI")).toBeInTheDocument();
  });
});
