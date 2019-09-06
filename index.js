const path = require("path");
const multer = require("multer");
const express = require("express");
const Unzipper = require("decompress-zip");
const app = express();
// var fs = require("fs");

// fs.appendFile('D:/ReactProject/Rogue-Single-SPA/src/plugins/IMAGE-1567684019063.txt', 'Hello content! \r\n', function (err) {
//   if (err) throw err;
//   console.log('Saved!');
// });
console.log('Server Started')
const storage = multer.diskStorage({
  destination: "/Users/surendranadh/ReactJS/single-spa-rogue/src/plugins",
  filename: function(req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
}).single("myImage");
// const router = express.Router();

app.post("/upload", function(req, res) {
  upload(req, res, function(err) {
    console.log("Request ---", req.body);
    console.log("Request file ---", req.file); //Here you get file.
    if (req.file) {
      var filepath = path.join(req.file.destination, req.file.filename);
      var unzipper = new Unzipper(filepath);

      unzipper.on("extract", function() {
        console.log("Finished extracting");
      });

      unzipper.extract({ path: req.file.destination });
    }
    /*Now do where ever you want to do*/
    if (!err) {
      return res.send(200).end();
    }
  });
});

app.get("/", function(req, res) {
  res.send("Hello World");
  var fs = require("fs");
  var data = fs
    .readFileSync(
      "/Users/surendranadh/ReactJS/single-spa-rogue/src/root-application/root-application.js"
    )
    .toString()
    .split("\n");
  data.splice(
    data.findIndex(x => x === "singleSpa.start();") - 1,
    0,
    "singleSpa.registerApplication('upload-2', () =>  \r\n  import ('../log/upload-form.js'), pathPrefix('/upload'));"
  );
  var text = data.join("\n");
  fs.writeFile(
    "/Users/surendranadh/ReactJS/single-spa-rogue/src/root-application/root-application.js",
    text,
    function(err) {
      if (err) return console.log(err);
    }
  );
});

app.listen(4000);
