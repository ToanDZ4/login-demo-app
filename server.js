// server.js
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("./db.sqlite");

// 1) Thiết lập view engine & static folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

// 2) Khởi tạo bảng users nếu chưa có
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

// 3) Session config
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    // cookie: sẽ thiết lập dynamically khi login
  })
);

// 4) Routes

// GET /login
app.get(["/", "/login"], (req, res) => {
  res.render("login", { error: null });
});

// POST /login
app.post("/login", async (req, res) => {
  const { username, password, remember } = req.body;
  // 1. Check empty
  if (!username || !password) {
    return res.render("login", { error: "Điền đầy đủ username và password" });
  }
  // 2. Check unicode (ví dụ chỉ cho phép a–z, 0–9, _)
  if (/[^A-Za-z0-9_]/.test(username)) {
    return res.render("login", {
      error: "Username không được dùng kí tự đặc biệt",
    });
  }
  if (/[^A-Za-z0-9_]/.test(password)) {
    return res.render("login", {
      error: "Password không được dùng kí tự đặc biệt",
    });
  }
  // 3. Tìm user
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) return res.render("login", { error: "Lỗi hệ thống" });
      if (!user)
        return res.render("login", { error: "Sai thông tin đăng nhập" });
      // 4. So khớp mật khẩu
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.render("login", { error: "Sai thông tin đăng nhập" });
      // 5. Đăng nhập thành công → gán session
      req.session.user = { id: user.id, username: user.username };
      // 6. Thiết lập cookie nhớ đăng nhập
      if (remember) {
        req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 ngày
      } else {
        req.session.cookie.expires = false; // session cookie
      }
      return res.redirect("/home");
    }
  );
});

// GET /home
app.get("/home", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("home", { username: req.session.user.username });
});

// GET /auth/register
app.get("/auth/register", (req, res) => {
  res.render("register", { error: null, success: null });
});

// POST /auth/register
app.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render("register", {
      error: "Điền đủ thông tin",
      success: null,
    });
  }
  if (/[^A-Za-z0-9_]/.test(username)) {
    return res.render("register", {
      error: "Username không hợp lệ",
      success: null,
    });
  }
  const hash = await bcrypt.hash(password, 10);
  db.run(
    "INSERT INTO users(username,password) VALUES(?,?)",
    [username, hash],
    (err) => {
      if (err) {
        return res.render("register", {
          error: "Username đã tồn tại",
          success: null,
        });
      }
      res.render("register", {
        error: null,
        success: "Đăng ký thành công! Đăng nhập thôi.",
      });
    }
  );
});

// GET /auth/forgotpassword
app.get("/auth/forgotpassword", (req, res) => {
  res.render("forgot");
});

// GET /logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// 5) Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
