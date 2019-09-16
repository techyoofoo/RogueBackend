//import "dotenv/config";
const path = require("path");
const multer = require("multer");
const express = require("express");
const Unzipper = require("decompress-zip");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
var fs = require("fs");
const fsExtra = require("fs-extra");
var extract = require('extract-zip')

// console.log("Hello Node.js project.");
// console.log(process.env.FRONT_END_APP_PATH);
// dotenv.config({ silent: process.env.NODE_ENV === 'production' });

//const app_path = "E:/Rogue.git/RogueFrontend/"; //
const app_path =  process.env.FRONT_END_APP_PATH;//"D:/Rogue/RogueAppFrontend/";
// fs.appendFile('D:/ReactProject/Rogue-Single-SPA/src/plugins/IMAGE-1567684019063.txt', 'Hello content! \r\n', function (err) {
//   if (err) throw err;
//   console.log('Saved!');
// });
console.log("Server Started");
app.use(cors());
app.use(express.json());
// app.use(bodyParser);
const storage = multer.diskStorage({
  destination: `${app_path}src/plugins`,
  filename: function (req, file, cb) {
    // cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
}).single("myImage");
// const router = express.Router();

app.post("/upload", async function (req, res) {
  upload(req, res, async function (err) {
    console.log("Request ---", req.body.pluginName);
    console.log("Request file ---", req.file); //Here you get file.
    if (req.file) {
      var filepath = path.join(req.file.destination, req.file.filename);
      var unzipper = new Unzipper(filepath);

      unzipper.on("extract", function () {
        console.log("Finished extracting");
      });
      // unzipper.on('error', function (err) {
      //   console.log('Caught an error');
      // });
      const splitextension = req.file.filename.split(".");
      const dir = req.file.destination + "/" + splitextension[0];
      // console.log("Directory", dir, "---", splitextension[0]);
      var fs = require("fs");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        unzipper.extract({ path: dir });
      }

      //const testFolder1 = "D:/Rogue/RogueAppFrontend/webpack.config1.js";
      if (fs.existsSync(dir + "/index.js")) {
        // Do something
        console.log("file found");

        const data = fs.readFileSync(`${app_path}src/login/login-form.js`).toString();
        if (data.indexOf("reactLifecycles") > -1 && data.indexOf("bootstrap") > -1 && data.indexOf("mount") > -1 && data.indexOf("unmount") > -1) {
          var appIndex = data.indexOf("appName");
          var appName = data.substring(appIndex).split("\n")[0].slice(9).substring(0, data.substring(appIndex).split("\n")[0].slice(9).substring(0, 9).length - 3)


          const menuName = req.body.pluginName;
          const data = fs.readFileSync(`${app_path}index.html`).toString().split("\n");
          data.splice(data.findIndex(x => x === "    </ul>"), 0, `<a onclick="singleSpaNavigate('/` + menuName + `')"><li>` + menuName + `</li></a>`);
          const text = data.join("\n");
          fs.writeFile(`${app_path}index.html`, text, function (err) {
            if (err) return console.log(err);
          });
        }
        else {
          //const removeZipFIle ='D:/Rogue/RogueAppFrontend/src/plugins/'+req.body.pluginName;       
          console.log("File Deleted", dir);
          try {
            await fsExtra.emptyDir(dir)
            console.log('success!')
            fs.rmdir(dir, function (err) {
              if (err) throw err;
              console.log("File Deleted");
            })
          } catch (err) {
            console.error(err)
          }
        }
      }
      else {
        //const removeZipFIle ='D:/Rogue/RogueAppFrontend/src/plugins/'+req.body.pluginName;       
        console.log("File Deleted", dir);
        try {
          await fsExtra.emptyDir(dir)
          console.log('success!')
          fs.rmdir(dir, function (err) {
            if (err) throw err;
            console.log("File Deleted");
          })
        } catch (err) {
          console.error(err)
        }
      }


      setTimeout(function () {
        const removeZipFIle = req.file.destination + "/" + req.file.filename;
        fs.unlinkSync(removeZipFIle, function (err) {
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

app.post("/testupload", function (req, res) {
  upload(req, res, async function (err) {
    if (req.file) {
      var filepath = path.join(req.file.destination, req.file.filename);
      //var unzipper = new Unzipper(filepath);

      // unzipper.on("extract", function () {
      //   console.log("Finished extracting");
      // });

      const splitextension = req.file.filename.split(".");
      const dir = req.file.destination + "/" + splitextension[0];

      if (!fs.existsSync(dir)) {
        console.log("Directory Created : " + dir)
        fs.mkdirSync(dir);
        //unzipper.extract({ path: dir });
      }

      extract(filepath, { dir: req.file.destination }, function (err) {
        const chkPath = `${dir}/index.js`;
  
        if (fs.existsSync(chkPath)) {
         // console.log("Selected Packages", req.body.package);
  
          const dataPlugin = fs.readFileSync(`${app_path}src/login/login-form.js`).toString();
          if (dataPlugin.indexOf("reactLifecycles") > -1 && dataPlugin.indexOf("bootstrap") > -1 && dataPlugin.indexOf("mount") > -1 && dataPlugin.indexOf("unmount") > -1) {
            var appIndex = dataPlugin.indexOf("appName");
            var appName = dataPlugin.substring(appIndex).split("\n")[0].slice(9).substring(0, dataPlugin.substring(appIndex).split("\n")[0].slice(9).substring(0, 9).length - 3)
        
            //Update the plugin into root-application.js
            var rootData = fs.readFileSync(`${app_path}src/root-application/root-application.js`).toString().split("\n");
            rootData.splice(rootData.findIndex(x => x === "singleSpa.start();\r"), 0, "singleSpa.registerApplication('" + appName + "', () => import ('../../src/Plugins/" + splitextension[0] + "/index.js'), pathPrefix('/" + splitextension[0] + `'));\n`);
            var rootText = rootData.join("\n");
            fs.writeFile(`${app_path}src/root-application/root-application.js`, rootText, function (err) {
              if (err) return console.log(err);
            }
            );
  
            //Update the webpack with plugin name
            var pluginnameArray = req.body.package.split(',');
            var pluginnames = "'" + pluginnameArray.join("','") + "',";
            var webdata = fs.readFileSync(`${app_path}webpack.config.js`).toString().split("\n");
            webdata.splice(webdata.findIndex(x => x === "  output: {\r") - 2, 0, pluginnames);
            var webtext = webdata.join("\n");
            fs.writeFile(`${app_path}webpack.config.js`, webtext, function (err) {
              if (err) return console.log(err);
            });
  
  
            const menuName = req.body.name;
            const indexdata = fs.readFileSync(`${app_path}index.html`).toString();
            //.split("\n");
            var index = indexdata.indexOf("</ul>");
            var newData = indexdata.slice(0, index) + (
              `<a onclick="singleSpaNavigate('/` + menuName + `')"><li>` + menuName + `</li></a>\n`) + indexdata.slice(index);
            const text = newData;
            fs.writeFile(`${app_path}index.html`, text, function (err) {
              if (err) return console.log(err);
            });
          } else {
            //const removeZipFIle ='D:/Rogue/RogueAppFrontend/src/plugins/'+req.body.pluginName;       
            console.log("File Deleted", dir);
            try {
               fsExtra.emptyDir(dir)
              console.log('success!')
              fs.rmdir(dir, function (err) {
                if (err) throw err;
                console.log("File Deleted");
              })
            } catch (err) {
              console.error(err)
            }
          }
  
        } else {
          //const removeZipFIle ='D:/Rogue/RogueAppFrontend/src/plugins/'+req.body.pluginName;
          console.log("File Deleted", dir);
          try {
             fsExtra.emptyDir(dir);
            console.log("success!");
            fs.rmdir(dir, function (err) {
              if (err) throw err;
              console.log("File Deleted");
            });
          } catch (err) {
            console.error(err)
          }
        }
      })
      
  

      setTimeout(function () {
        const removeZipFIle = req.file.destination + "/" + req.file.filename;
        fs.unlinkSync(removeZipFIle, function (err) {
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

// app.post("/test", (req, res) => {
//   console.log("---", req.body);
//   var fs = require("fs");
//   setTimeout(async function () {
//     const removeZipFIle = `${app_path}src/plugins/` + req.body.name;
//     console.log("File Deleted", removeZipFIle);
//     try {
//       await fsExtra.emptyDir(removeZipFIle);
//       console.log("success!");
//       fs.rmdir(removeZipFIle, function (err) {
//         if (err) throw err;
//         console.log("File Deleted");
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   }, 10000);
//   res.json({ requestBody: req.body + " Deleted sucessfully" }); // <==== req.body will be a parsed JSON object
// });

app.get("/", function (req, res) {
  res.send("Hello World");

  var fs = require("fs");


  // const testFolder1 = "D:/Rogue/RogueAppFrontend/webpack.config1.js";
  // if (!fs.existsSync(testFolder1)) {
  //   // Do something
  //   console.log("not found");
  // }
  //Update the plugin into root-application.js
  // var data = fs.readFileSync("D:/Rogue/RogueAppFrontend/src/root-application/root-application.js").toString().split("\n");
  // data.splice(data.findIndex(x => x === "singleSpa.start();\r"), 0,"singleSpa.registerApplication('upload-2', () => import ('../log/upload-form.js'), pathPrefix('/upload'));\n");
  // var text = data.join("\n");
  // fs.writeFile("D:/Rogue/RogueAppFrontend/src/root-application/root-application.js",text,function(err) {
  //     if (err) return console.log(err);
  //   }
  // );

  //Update the webpack with plugin name
  //  var webdata = fs.readFileSync('D:/Rogue/RogueAppFrontend/webpack.config.js').toString().split("\n");
  //  webdata.splice(webdata.findIndex(x => x === "  output: {\r") - 2, 0, "'sample-dom',");
  //   var webtext = webdata.join("\n");
  //   fs.writeFile('D:/Rogue/RogueAppFrontend/webpack.config.js', webtext, function (err) {
  //     if (err) return console.log(err);
  //   });
});

app.listen(3000);
