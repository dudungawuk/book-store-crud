const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const { getBuku, deleteBookUsingID, addBook } = require("./utils/books.js");
const { redirect } = require("next/dist/server/api-utils/index.js");
const app = express();
const port = 3000;

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true })); // Menangani data form-urlencoded

// Route untuk halaman utama
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home Page", // Judul halaman
    layout: "partials/main-layout", // Layout yang digunakan
  });
});

app.get("/admin", (req, res) => {
  getBuku()
    .then((books) => {
      res.render("dashboard", {
        title: "Admin", // Judul halaman
        layout: "partials/main-layout", // Layout yang digunakan
        books,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/delete/:id", (req, res) => {
  const bookid = req.params.id;
  deleteBookUsingID(bookid);
  res.redirect("/admin");
});

app.get("/admin/add", (req, res) => {
  res.render("add", {
    title: "Add Data Book", // Judul halaman
    layout: "partials/main-layout", // Layout yang digunakan
  });
});

app.post("/add", (req, res) => {
  const { judul, penulis, tahunTerbit, kategori, stok } = req.body;
  addBook(judul, penulis, tahunTerbit, kategori, stok);
  res.redirect("/admin");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
