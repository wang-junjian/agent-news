import { cn } from "@/lib/utils";

describe("cn function", () => {
  it("合并类名", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("处理条件类名", () => {
    expect(cn("foo", true && "bar", false && "baz")).toBe("foo bar");
  });

  it("合并 Tailwind 类并去重", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("处理对象类名", () => {
    expect(cn({ "foo-bar": true, "baz-qux": false })).toBe("foo-bar");
  });

  it("处理混合类型", () => {
    expect(cn("foo", { bar: true, baz: false }, ["qux", "quux"])).toBe(
      "foo bar qux quux"
    );
  });
});
