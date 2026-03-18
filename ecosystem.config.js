module.exports = {
  apps: [{
    name: "agent-news",
    // 1. 直接指向 next 命令，避免通过 npm 转发
    script: "./node_modules/next/dist/bin/next",
    // 2. 使用 start
    args: "start", 
    // 3. 开启集群模式，利用多核 CPU (可选)
    // instances: "max",
    // exec_mode: "cluster",
    env: {
      NODE_ENV: "production", // 明确生产环境
      PORT: 80  // 固定端口
    }
  }]
}