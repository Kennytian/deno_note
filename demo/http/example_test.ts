#!/usr/bin/env deno --allow-run --allow-net
import { assertEquals, equal } from "https://deno.land/std@0.51.0/testing/asserts.ts";

const test = Deno.test;
const run = Deno.run;
const testSite = "http://127.0.0.1:3001";
// 启动测试服务

let httpServer: Deno.Process;

async function startHTTPServer() {
  httpServer = run({
    cmd: [Deno.execPath(), "run", "--allow-net", "./demo/http/example.ts"],
    stdout: "piped"
  });
}

function closeHTTPServer() {
  httpServer.close();
  httpServer.stdout && httpServer.stdout.close();
}

async function sleep(time: number = 10): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time)
  })
}


test('http/example_test', async function() {
  try {
    // 等待服务启动
    await startHTTPServer();
    await sleep(1000);
    const res1 = await fetch(`${testSite}`);
    const result = await res1.text();
    const expectResult = "hello world";
    assertEquals(result, expectResult);
  } finally {
    // 关闭测试服务
    closeHTTPServer();
  }
});