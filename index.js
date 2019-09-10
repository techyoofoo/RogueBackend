const path = require("path");
const multer = require("multer");
const express = require("express");
const Unzipper = require("decompress-zip");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
var fs = require("fs");
const fsExtra = require('fs-extra');

// fs.appendFile('D:/ReactProject/Rogue-Single-SPA/src/plugins/IMAGE-1567684019063.txt', 'Hello content! \r\n', function (err) {
//   if (err) throw err;
//   console.log('Saved!');
// });
console.log("Server Started");
app.use(cors());
app.use(express.json())
// app.use(bodyParser);
const storage = multer.diskStorage({
  destination:
    "/Users/surendranadh/rogue-application/RogueAppFrontend/src/plugins",
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
    console.log("Request ---", req.body.pluginName);
    console.log("Request file ---", req.file); //Here you get file.
    if (req.file) {
      var filepath = path.join(req.file.destination, req.file.filename);
      var unzipper = new Unzipper(filepath);

      unzipper.on("extract", function() {
        console.log("Finished extracting");
      });
      const splitextension = req.file.filename.split(".");
      const dir = req.file.destination + "/" + splitextension[0];
      // console.log("Directory", dir, "---", splitextension[0]);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        unzipper.extract({ path: dir });
      }

      const menuName=req.body.pluginName;
      const data = fs.readFileSync('/Users/surendranadh/rogue-application/RogueAppFrontend/index.html').toString().split("\n");
      data.splice(data.findIndex(x => x === "    </ul>"), 0, `<a onclick="singleSpaNavigate('/`+menuName+`')"><li>`+menuName+`</li></a>`);
      const text = data.join("\n");
      fs.writeFile('/Users/surendranadh/rogue-application/RogueAppFrontend/index.html', text, function (err) {
        if (err) return console.log(err);
      });
      setTimeout(function() {
        const removeZipFIle = req.file.destination + "/" + req.file.filename;       
        fs.unlinkSync(removeZipFIle, function(err) {
          if (err) throw err;
          console.log("File Deleted");
        });
      }, 10000);
    }
    /*Now do where ever you want to do*/
    if (!err) {
      return res.send(200).end();
    }
  });
});

app.post('/test', (req, res) => {
  console.log("---", req.body);
  var fs = require("fs");
  setTimeout(async function() {
    const removeZipFIle ='/Users/surendranadh/rogue-application/RogueAppFrontend/src/plugins/'+req.body.pluginName;       
    console.log("File Deleted", removeZipFIle);    
      try {
        await fsExtra.emptyDir(removeZipFIle)
        console.log('success!')
        fs.rmdir(removeZipFIle, function(err){
          if (err) throw err;
          console.log("File Deleted");
        })
      } catch (err) {
        console.error(err)
      }   
  }, 10000);  
  res.json({requestBody: req.body +" Deleted sucessfully"})  // <==== req.body will be a parsed JSON object
})


app.get("/", function(req, res) {
  res.send("Hello World");
  var fs = require("fs");
  var data = fs
    .readFileSync(
      "/Users/surendranadh/rogue-application/RogueAppFrontend/src/root-application/root-application.js"
    )
    .toString()
    .split("\n");
  data.splice(
    data.findIndex(x => x === "singleSpa.start();\r") - 1,
    0,
    "singleSpa.registerApplication('upload-2', () =>  \r\n  import ('../log/upload-form.js'), pathPrefix('/upload'));"
  );
  var text = data.join("\n");
  fs.writeFile(
    "/Users/surendranadh/rogue-application/RogueAppFrontend/src/root-application/root-application.js",
    text,
    function(err) {
      if (err) return console.log(err);
    }
  );
});

app.listen(3000);
