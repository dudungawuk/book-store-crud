const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");

require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
connection.connect((err) => {
  if (err) throw err;
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder untuk menyimpan gambar
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
  },
});

const upload = multer({ storage });

getBuku = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM buku", (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

getBukuUsingID = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM buku WHERE id = ${id}`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

deleteBookUsingID = (id) => {
  query = `DELETE FROM buku where id = ?`;
  connection.query(query, [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      console.log("Buku tidak ditemukan.");
    } else {
      console.log("Buku berhasil dihapus.");
    }
  });
};
deleteAllDataBook = () => {
  query = "TRUNCATE TABLE buku";
  connection.query(query, (err) => {
    if (err) throw err;
    console.log("semua Data berhasil dihapus!");
  });
};

addBook = (judul, penulis, tahunTerbit, kategori, stok, gambar) => {
  const query = `
    INSERT INTO buku (judul, penulis, tahunTerbit, kategori, stok, gambar_path) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [judul, penulis, tahunTerbit, kategori, stok, gambar],
    (err, result) => {
      if (err) {
        console.error("Error saat menambahkan buku:", err);
        throw err;
      }
      console.log("Buku berhasil ditambahkan!");
    }
  );
};

updateBookByID = (
  id,
  judul,
  penulis,
  tahunTerbit,
  kategori,
  stok,
  gambar_path
) => {
  query =
    "UPDATE buku SET judul = ?,penulis = ?,tahunTerbit = ?,kategori = ?,stok = ?, gambar_path = ? where id = ?";
  connection.query(
    query,
    [judul, penulis, tahunTerbit, kategori, stok, gambar_path, id],
    (err, result) => {
      if (err) throw err;
      if (result.affectedRows === 0) {
        console.log("Buku tidak ditemukan");
      } else {
        console.log("Data Berhasil di edit");
      }
    }
  );
};

// updataeBook = (id, judul, penulis, tahunTerbit, kategori, stok) => {
//   let values = [];
//   let fields = [];
//   if (judul) {
//     fields.push("judul = ?");
//     values.push(judul);
//   }
//   if (penulis) {
//     fields.push("penulis = ?");
//     values.push(penulis);
//   }
//   if (tahunTerbit) {
//     fields.push("tahunTerbit= ?");
//     values.push(tahunTerbit);
//   }
//   if (kategori) {
//     fields.push("kategori= ?");
//     values.push(kategori);
//   }
//   if (stok) {
//     fields.push("stok= ?");
//     values.push(stok);
//   }

//   if (fields.length === 0) {
//     console.log("Tidak ada buku yang di update");
//   }

//   values.push(id);

//   console.log(`update buku dengan ID : ${id}`);

//   query = `UPDATE buku SET ${fields.join(", ")} WHERE id=?`;

//   connection.query(query, values, (err, result) => {
//     if (err) throw err;
//     if (result.affectedRows === 0) {
//       console.log("Buku tidak ditemukan");
//     } else {
//       console.log("Data Berhasil di edit");
//     }
//   });
// };

module.exports = {
  getBuku,
  deleteBookUsingID,
  addBook,
  getBukuUsingID,
  updateBookByID,
  upload,
};

// const books = await getBuku();

// console.log(books);
