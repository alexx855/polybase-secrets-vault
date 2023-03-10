import { Polybase } from "@polybase/client";

export const db = new Polybase({
  defaultNamespace: "pk/0x5009d7afd855f3308a193071d5116d464467ce51c010d7d9454a19830bcc62c3723a899fd70d6c4185667acd7ceb8231fdc743ed740fc84b6006c79440e8f0f1/polytest-url-shorter",
});

export const urlsCollectionRef =  db.collection<{ id: string, url: string }>("Urls");
