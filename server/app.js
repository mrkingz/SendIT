import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes";

dotenv.config();
const app = express();
let NODE_ENV = process.env.NODE_ENV
  ? process.env.NODE_ENV.trim()
  : "development";

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(cookieParser());
app.disable("x-powered-by");
app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

app.set("view options", { layout: false });
app.use(express.static("./public"));
app.use(routes.authRoutes);
app.use(routes.parcelRoutes);
app.use(routes.pageRoutes);

app.all("/api", (req, res) => {
  res.status("200").send({
    status: "Success",
    message: "Connection ok"
  });
});

app.all("*", (req, res) => {
  res.status("404").json({
    status: "Fail",
    message: "Sorry, there is nothing here!"
  });
});
const listener = app.listen(process.env.PORT || 8000, () => {
  if (NODE_ENV !== "production") {
    console.log(`Server running on port: ${listener.address().port}`);
  }
});
export default app;
