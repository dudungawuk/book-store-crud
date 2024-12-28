const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const {
  getBuku,
  deleteBookUsingID,
  addBook,
  getBukuUsingID,
  upload,
} = require("./utils/books.js");
const { redirect } = require("next/dist/server/api-utils/index.js");
const app = express();
const port = 3000;

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true })); // Menangani data form-urlencoded

const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login"); // Redirect ke login jika belum login
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.session.user.role !== "admin") {
    return res.status(403).send("Akses ditolak: Anda bukan admin.");
  }
  next();
};

// Route untuk halaman utama
app.get("/", async (req, res) => {
  const books = await getBuku();
  res.render("index", {
    books,
    title: "Home Page", // Judul halaman
    layout: "partials/main-layout", // Layout yang digunakan
  });
});
app.get("/login", (req, res) => {
  console.log(req.body);

  res.render("login", {
    title: "Login Page",
    layout: "partials/main-layout",
  });
});

app.post("/login", (req, res) => {
  console.log(req.body);
  res.redirect("/admin");
});

app.get("/admin", isAuthenticated(), isAdmin(), (req, res) => {
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

app.get("/admin/edit/:id", (req, res) => {
  const Bookid = req.params.id;
  getBukuUsingID(Bookid)
    .then((books) => {
      res.render("edit", {
        title: "Add Data Book", // Judul halaman
        layout: "partials/main-layout", // Layout yang digunakan
        books: books[0],
      });
    })
    .catch((err) => {
      throw err;
    });
});

app.post("/edit/:id", upload.single("gambar_path"), (req, res) => {
  const { id, judul, penulis, tahunTerbit, kategori, stok } = req.body;
  const gambarPath = req.file ? req.file.filename : req.body.old_gambar_path;

  updateBookByID(id, judul, penulis, tahunTerbit, kategori, stok, gambarPath);

  res.redirect("/admin");
});

app.get("/admin/add", (req, res) => {
  res.render("add", {
    title: "Add Data Book", // Judul halaman
    layout: "partials/main-layout", // Layout yang digunakan
  });
});

app.post("/add", upload.single("gambar"), (req, res) => {
  const { judul, penulis, tahunTerbit, kategori, stok } = req.body;
  const gambar = req.file ? req.file.filename : null;

  // Panggil fungsi untuk menambahkan buku, sertakan path gambar
  addBook(judul, penulis, tahunTerbit, kategori, stok, gambar);

  res.redirect("/admin");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
