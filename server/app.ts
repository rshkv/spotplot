import * as express from "express";
import * as path from "path";
import router from "./routes";

const PORT = 3000;
const app = express();

app
  .use(express.static(path.resolve(__dirname, "../client/public")))
  .use("/", router)
  .listen(PORT, () => {
    // tslint:disable-next-line no-console
    console.log(`Server listening on port ${PORT}`);
  });
