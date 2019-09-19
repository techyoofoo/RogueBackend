import "dotenv/config";
const path = require("path");
const multer = require("multer");
const express = require("express");
const Unzipper = require("decompress-zip");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
var fs = require("fs");
const fsExtra = require("fs-extra");

// console.log("Hello Node.js project.");
// console.log(process.env.FRONT_END_APP_PATH);
// dotenv.config({ silent: process.env.NODE_ENV === 'production' });

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

app.post("/upload", function (req, res) {
  upload(req, res, async function (err) {
    console.log("Request ---", req.body.name);
    console.log("Request file ---", req.file); //Here you get file.
    if (req.file) {
      var filepath = path.join(req.file.destination, req.file.filename);
      var unzipper = new Unzipper(filepath);

      unzipper.on("extract", function () {
        console.log("Finished extracting");
      });
      const splitextension = req.file.filename.split(".");
      const dir = req.file.destination + "/" + splitextension[0];
      const chkPath = `${dir}/index.js`;
      console.log("Directory", chkPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        unzipper.extract({ path: dir });
      }

      if (fs.existsSync(chkPath)) {
        // Do something
        console.log("Selected Packages", req.body.package);

        const dataPlugin = fs.readFileSync(`${app_path}src/login/login-form.js`).toString();
        
        //Checking the reference files
        const chkPath = `${app_path}src/plugins/sample/`;
        const dataPlugin = fs.readFileSync(chkPath + `index.js`).toString();
        var appIndex = dataPlugin.indexOf("rootComponent");
        var appName = dataPlugin.substring(appIndex).split("\n")[0].slice(14).substring(0, dataPlugin.substring(appIndex).split("\n")[0].slice(14).substring(0, 14).length - 1).trim();
        //var webdata = dataPlugin.split("\n");
        var dta = dataPlugin.indexOf("Root");
        //var fileName = dataPlugin.substring(dta).split("\n")[0].slice(13).substring(0,(dataPlugin.substring(dta).split("\n")[0].slice(13)).length-2);
        var fileLine = dataPlugin.substring(dta).split("\n")[0].split(' ');
        var folderPath = dataPlugin.substring(dta).split("\n")[0].split(' ')[dataPlugin.substring(dta).split("\n")[0].split(' ').length - 1].split("/").length - 1
        var fileNameArray = dataPlugin.substring(dta).split("\n")[0].split(' ')[dataPlugin.substring(dta).split("\n")[0].split(' ').length - 1].split("/")
        var fileName = fileNameArray[fileNameArray.length - 1].slice(0, -2);
        var pathLocationArr = chkPath.split('/');
        var newFilePath = "";
        if (folderPath > 1) {
          newFilePath = pathLocationArr.splice(0, pathLocationArr.length - (folderPath)).join(`/`);
        }
        else {
          newFilePath = pathLocationArr.splice(0, pathLocationArr.length - (folderPath - 1)).join(`/`);
        }
        console.log(fileName);


        if (dataPlugin.indexOf("reactLifecycles") > -1 && dataPlugin.indexOf("bootstrap") > -1 && dataPlugin.indexOf("mount") > -1 && dataPlugin.indexOf("unmount") > -1 && fs.existsSync(newFilePath+fileName)) 
        {

          var appIndex = dataPlugin.indexOf("appName");
          var appName = dataPlugin.substring(appIndex).split("\n")[0].slice(9).substring(0, dataPlugin.substring(appIndex).split("\n")[0].slice(9).substring(0, 9).length - 3)

          //Update the plugin into root-application.js
          var rootData = fs.readFileSync(`${app_path}src/root-application/root-application.js`).toString().split("\n");
          rootData.splice(rootData.findIndex(x => x === "singleSpa.start();\r"), 0, "singleSpa.registerApplication('"+appName+"', () => import ('../../src/plugins/"+splitextension[0]+"/index.js'), pathPrefix('/"+splitextension[0]+`'));\n`);
          var rootText = rootData.join("\n");
          fs.writeFile(`${app_path}src/root-application/root-application.js`, rootText, function (err) {
            if (err) return console.log(err);
          }
          );

          //Update the webpack with plugin name
          var pluginnameArray=req.body.package.split(',');
          var pluginnames="'"+pluginnameArray.join("','")+"',";
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

      } else {
        //const removeZipFIle ='D:/Rogue/RogueAppFrontend/src/plugins/'+req.body.pluginName;
        console.log("File Deleted", dir);
        try {
          await fsExtra.emptyDir(dir);
          console.log("success!");
          fs.rmdir(dir, function (err) {
            if (err) throw err;
            console.log("File Deleted");
          });
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

app.post("/test", (req, res) => {
  console.log("---", req.body);
  var fs = require("fs");
  setTimeout(async function () {
    const removeZipFIle = `${app_path}src/plugins/` + req.body.name;
    console.log("File Deleted", removeZipFIle);
    try {
      await fsExtra.emptyDir(removeZipFIle);
      console.log("success!");
      fs.rmdir(removeZipFIle, function (err) {
        if (err) throw err;
        console.log("File Deleted");
      });
    } catch (err) {
      console.error(err);
    }
  }, 10000);
  res.json({ requestBody: req.body + " Deleted sucessfully" }); // <==== req.body will be a parsed JSON object
});

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

  const chkPath = `D:/Rogue/RogueAppFrontend/src/plugins/sample/`;
  const dataPlugin = fs.readFileSync(chkPath+`index.js`).toString();
  var appIndex = dataPlugin.indexOf("rootComponent");
  var appName = dataPlugin.substring(appIndex).split("\n")[0].slice(14).substring(0, dataPlugin.substring(appIndex).split("\n")[0].slice(14).substring(0, 14).length - 1).trim();
  //var webdata = dataPlugin.split("\n");
  var dta  = dataPlugin.indexOf("Root");
  //var fileName = dataPlugin.substring(dta).split("\n")[0].slice(13).substring(0,(dataPlugin.substring(dta).split("\n")[0].slice(13)).length-2);
  var fileLine=dataPlugin.substring(dta).split("\n")[0].split(' ');
  var folderPath=dataPlugin.substring(dta).split("\n")[0].split(' ')[dataPlugin.substring(dta).split("\n")[0].split(' ').length-1].split("/").length - 1
  var fileNameArray=dataPlugin.substring(dta).split("\n")[0].split(' ')[dataPlugin.substring(dta).split("\n")[0].split(' ').length-1].split("/")
  var fileName=fileNameArray[fileNameArray.length-1].slice(0, -2);
  var pathLocationArr=chkPath.split('/');
  var newFilePath="";
  if(folderPath>1)
  {
    newFilePath=pathLocationArr.splice(0,pathLocationArr.length-(folderPath)).join(`/`);
  }
  else{
    newFilePath=pathLocationArr.splice(0,pathLocationArr.length-(folderPath-1)).join(`/`);
  }
  console.log(fileName);
  if (fs.existsSync(newFilePath+fileName)) {
    console.log("Component file found");
  }
  else
  {
    console.log("Component file not found");
  }
});

app.listen(3000);
