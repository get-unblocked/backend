import { watch } from "https://deno.land/x/watch/mod.ts";

async function monitorFiles() {
  const watcher = watch("./path/to/your/files");

  for await (const event of watcher) {
    if (event.kind === "modify") {
      switch (event.paths[0]) {
        case "./path/to/your/files/store.ts":
          console.log("`store.ts` has been modified");
          break;
        case "./path/to/your/files/notif.ts":
          console.log("`notif.ts` has been modified");
          break;
        case "./path/to/your/files/auth.ts":
          console.log("`auth.ts` has been modified");
          break;
      }
    }
  }
}

if (import.meta.main) {
  monitorFiles();
}