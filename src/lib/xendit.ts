import { Xendit } from "xendit-node";

const xenditClient = new Xendit({
  secretKey: process.env.NEXT_PUBLIC_XENDIT_API_KEY ?? "-",
});


export default xenditClient;