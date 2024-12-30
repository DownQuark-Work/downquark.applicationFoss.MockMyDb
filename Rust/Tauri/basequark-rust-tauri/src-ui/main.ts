import { invoke } from "@tauri-apps/api/core";

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;

async function greet() {
  if (greetMsgEl && greetInputEl) {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    greetMsgEl.textContent = await invoke("greet", {
      name: greetInputEl.value,
    });
    return greetMsgEl.textContent;
  }
  return "no greeting";
}

// Utility function to implement a sleep function in TypeScript
function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

// Setup function
async function setup() {
  // Fake perform some really heavy setup task
  console.log("Performing really heavy frontend setup task...");
  await sleep(3);
  console.log("Frontend setup task complete!");
  // Set the frontend task as being completed
  await invoke("set_complete", { task: "frontend" });
}

// Effectively a JavaScript main function
// window.addEventListener("DOMContentLoaded", () => {
//   setup()
// });

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    greet().then((r) => {
      console.log("greet", r);
    });
  });
  setup().then((r) => {
    console.log("setup", r);
  });
});
