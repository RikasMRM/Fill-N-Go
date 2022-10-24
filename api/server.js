const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { notFound, errorHandler } = require("./middlewares/error.Middleware");
const connectDB = require("./config/db");
const colors = require("colors");
const bodyParser = require("body-parser");
const cors = require("cors");

//Import Routes
const usermanagement = require("./controllers/user.controller");
const orderRoutes = require("./routes/order.route");
const districtRoutes = require("./routes/category.route");
const shedRoutes = require("./routes/product.route");
const shedDistRoutes = require("./controllers/prodcat.controller");
const fuelqueRoutes = require("./controllers/shoppingCart.controller");
const fuelSinglequeRoutes = require("./controllers/shed.que.controller");

const authRoute = require("./controllers/user.controller");
const { create, update } = require("./models/user.model");

const app = express();



dotenv.config();
app.use(bodyParser.json());
app.use(cors());

connectDB();

//Route Middlewares
app.use("/api/v1/user", usermanagement);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/district", districtRoutes);
app.use("/api/v1/shed/", shedRoutes);
app.use("/api/v1/user/", authRoute);
app.use("/api/v1/sheds/list", shedDistRoutes);
app.use("/api/v1/fuelques/list", fuelSinglequeRoutes);
app.use("/api/v1/fuelque", fuelqueRoutes);


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue
      .underline.bold
  )
);
