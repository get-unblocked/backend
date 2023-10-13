import {serve} from "https://deno.land/std/http/server.ts";

export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  serve((req) => {
    return new Response(`Add 2 + 3 = ${add(2, 3)}`);
  });
  //console.log("Add 2 + 3 =", add(2, 3));
}


