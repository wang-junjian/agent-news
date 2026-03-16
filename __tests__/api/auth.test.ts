describe("Auth Module", () => {
  describe("validateApiKey function", () => {
    let validateApiKey: any;
    let originalEnv: any;

    beforeEach(async () => {
      originalEnv = process.env.API_KEY;
      process.env.API_KEY = "test-secret-key-123";
      // Clear module cache
      jest.resetModules();
      const authModule = await import("@/app/api/auth");
      validateApiKey = authModule.validateApiKey;
    });

    afterEach(() => {
      process.env.API_KEY = originalEnv;
    });

    it("当 API Key 正确时返回 true", () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("test-secret-key-123"),
        },
      } as any;

      expect(validateApiKey(mockRequest)).toBe(true);
    });

    it("当 API Key 错误时返回 false", () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("wrong-key"),
        },
      } as any;

      expect(validateApiKey(mockRequest)).toBe(false);
    });

    it("当缺少 API Key 时返回 false", () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      } as any;

      expect(validateApiKey(mockRequest)).toBe(false);
    });

    it("当环境变量未设置时返回 false", () => {
      delete process.env.API_KEY;

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("test-secret-key-123"),
        },
      } as any;

      expect(validateApiKey(mockRequest)).toBe(false);
    });
  });
});
