const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan"); // logging our api's requests

dotenv.config({ path: "config.env" }); // if the file name is .env, we don't need the path else we should include the path.
const dbConnection = require("./config/database");
const ApiError = require("./utilities/apiError");
const globalError = require("./middelwares/errorMiddleware");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");

//connecting with db
dbConnection();

//express app
const app = express();

//middlewares
app.use(express.json());

//eg. -- localhost/portnum/categories/imageName.
//my website will  show it.
//this line says: serve the static files in the uploads folder.
app.use(express.static(path.join(__dirname, "uploads")));

// we want to execute this only in development mode.
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // "format" elly khas by el dev.
  console.log("Mode: Development");
}

// mount routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subCategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);

// this handles the routes not in our routes.
app.all("*", (req, res, next) => {
  // create error and sends it to the error handling middleware.
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400)); // pass it to the next middleware.
});

// express provides us with MIDDLEWARE if we passed 4 parameters to it, express understands that it is an (error handling middleware)
// so it takes the error and pass it to this middleware.

// next parameter, moves it to the next middleware.
// express understands that it is (error handling middleware) and all th errors happens express passes then to this middleware to err parameter first parameter.
// this middleware only executes when an error happens.

//global error handling middelware for express.
// mlhash d3wa be el errors from the promises ouside express like the database connection and so on.
// 3ayzeen n3ml mkan global y 2dr ye catch ay error y7sal
app.use(globalError);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});

// rejections outside express. promises outide express. like databaseConnection.
// ay error oustide express -->> rejection means promise (Asyncronous).
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection Errors: ${err.name} | ${err.message}`);

  //when the server finishes the async codes (pending or executing  requests), the callback function gets executed and the server is closed.
  //  (pending or executing  requests) waits for them, then shut down. (-server.close()-) helps with that.
  server.close(() => {
    console.log("the server is shutting down.....");
    process.exit(1);
  });
});
//when an rejection happens, an event emitts, so process listening on this event.
