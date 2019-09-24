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
var extract = require('extract-zip');
const { transform, prettyPrint } = require('camaro');


const soapRequest = require('easy-soap-request');


//var parser = require('fast-xml-parser');


//var soap = require('strong-soap').soap;
/* var XMLHandler = soap.XMLHandler;
var xmlHandler = new XMLHandler();
var util = require('util');
var url = 'http://chalkcouture-api.exigo.com/3.0/ExigoApi.asmx?WSDL'; */

// console.log("Hello Node.js project.");
// console.log(process.env.FRONT_END_APP_PATH);
// dotenv.config({ silent: process.env.NODE_ENV === 'production' });

//const app_path = "E:/Rogue.git/RogueFrontend/"; //
const app_path = process.env.FRONT_END_APP_PATH;//"D:/Rogue/RogueAppFrontend/";
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

app.post("/testupload", async function (req, res) {
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
        //Checking the referenced files
        var fs = require("fs");
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


        if (data.indexOf("reactLifecycles") > -1 && data.indexOf("bootstrap") > -1 && data.indexOf("mount") > -1 && data.indexOf("unmount") > -1 && fs.existsSync(newFilePath + fileName)) 
        {
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

app.post("/upload", function (req, res) {
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






app.post("/authenticate", function (req, res) {

  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
    'soapAction': 'http://api.exigo.com/AuthenticateCustomer',
  };

  const xml = `<soap:Envelope 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
  <ApiAuthentication xmlns="http://api.exigo.com/">
  <LoginName>`+req.body.ApiAuthentication.LoginName+`</LoginName>
  <Password>`+req.body.ApiAuthentication.Password+`</Password>
  <Company>`+req.body.ApiAuthentication.Company+`</Company>
  </ApiAuthentication>
  </soap:Header>
  <soap:Body>
  <AuthenticateCustomerRequest xmlns="http://api.exigo.com/">
  <LoginName>`+req.body.AuthenticateCustomerRequest.LoginName+`</LoginName>
  <Password>`+req.body.AuthenticateCustomerRequest.Password+`</Password>
  </AuthenticateCustomerRequest>
  </soap:Body>
  </soap:Envelope>`;

  const template = {
    CustomerResult: ["//AuthenticateCustomerResult", {
      Result: ["//Result", {
        Status: "Status",
        Errors: "Errors",
        TransactionKey: "TransactionKey"
      }],
      CustomerID: "CustomerID",
      FirstName: "FirstName",
      LastName: "LastName"
    }]
  };

  (async () => {
    const { response } = await soapRequest('http://sandboxapi3.exigo.com/3.0/ExigoApi.asmx?WSDL?op=AuthenticateCustomer', headers, xml, 10000); // Optional timeout parameter(milliseconds)
    const { body, statusCode } = response;
    const result = await transform(response.body, template);
    const prettyStr = await prettyPrint(response.body, { indentSize: 4 });

    return res.send(result.CustomerResult[0]);
  })();


  /* 
    var requestArgs = {
      // symbol: 'IBM'
    };
  
    var options = {
      LoginName: 'dd.holman@comcast.net',
      Password: 'Holman39724@@@'
    };
    var clientOptions = {
    };
    soap.createClient(url, clientOptions, function (err, client) {
      // client.setSOAPAction(`http://api.exigo.com/AuthenticateCustomer`);
      client.addSoapHeader(`<ApiAuthentication xmlns="http://api.exigo.com/">
                            <LoginName>chalkapi</LoginName>
                            <Password>5PhHK339B76k2eM8</Password>
                            <Company>chalkcouture</Company>      
                            </ApiAuthentication>`);
      client.AuthenticateCustomer(options, function (err, result, envelope, soapHeader) {
        console.log('result', result);
        console.log('envelope', envelope);
        if (err) {
          throw err;
        }
        console.log(result);
      })
  
    }); */
});

app.post("/getitems", function (req, res) {

  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
    'soapAction': 'http://api.exigo.com/GetItems',
  };
  const xml = `<soap:Envelope 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
  <ApiAuthentication xmlns="http://api.exigo.com/">
  <LoginName>`+req.body.ApiAuthentication.LoginName+`</LoginName>
  <Password>`+req.body.ApiAuthentication.Password+`</Password>
  <Company>`+req.body.ApiAuthentication.Company+`</Company>
  </ApiAuthentication>
  </soap:Header>
  <soap:Body>
  <GetItemsRequest xmlns="http://api.exigo.com/">
    <CurrencyCode>`+req.body.GetItemsRequest.CurrencyCode+`</CurrencyCode>
    <PriceType>`+req.body.GetItemsRequest.PriceType+`</PriceType>
    <WarehouseID>`+req.body.GetItemsRequest.WarehouseID+`</WarehouseID>
      <WebID>`+req.body.GetItemsRequest.WebID+`</WebID>
      <WebCategoryID>`+req.body.GetItemsRequest.WebCategoryID+`</WebCategoryID>
  </GetItemsRequest>
</soap:Body>
  </soap:Envelope>`;

  const template = {
    ItemsResult: ["//GetItemsResult", {
      Result: ["//Result", {
        Status: "Status",
        Errors: "Errors",
        TransactionKey: "TransactionKey"
      }],
      Items: ["//Items//ItemResponse", {
        ItemCode: "ItemCode",
        Description: "Description",
        Price: "Price"
      }]
    }]
  };

  (async () => {
    const { response } = await soapRequest('http://sandboxapi3.exigo.com/3.0/ExigoApi.asmx?WSDL?op=GetItems', headers, xml, 10000); // Optional timeout parameter(milliseconds)
    const { body, statusCode } = response;
    const result = await transform(response.body, template);
    const prettyStr = await prettyPrint(response.body, { indentSize: 4 });

    return res.send(result.ItemsResult[0]);
  })();
});

app.post("/getcustomers", function (req, res) {

  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
    'soapAction': 'http://api.exigo.com/GetCustomers',
  };
  const xml = `<soap:Envelope 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
  <ApiAuthentication xmlns="http://api.exigo.com/">
  <LoginName>`+req.body.ApiAuthentication.LoginName+`</LoginName>
  <Password>`+req.body.ApiAuthentication.Password+`</Password>
  <Company>`+req.body.ApiAuthentication.Company+`</Company>
  </ApiAuthentication>
  </soap:Header>
  <soap:Body>
  <GetCustomersRequest xmlns="http://api.exigo.com/">
  </GetCustomersRequest>
</soap:Body>
  </soap:Envelope>`;

  const template = {
    ItemsResult: ["//GetCustomersResult", {
      Result: ["//Result", {
        Status: "Status",
        Errors: "Errors",
        TransactionKey: "TransactionKey"
      }],
      Items: ["//Customers//CustomerResponse", {
        CustomerID: "CustomerID",
        FirstName: "FirstName",
        LastName: "LastName",
        Company:"Company",
        CustomerType:"CustomerType",
        CustomerStatus:"CustomerStatus",
        Email:"Email"
      }]
    }]
  };

  (async () => {
    const { response } = await soapRequest('http://sandboxapi3.exigo.com/3.0/ExigoApi.asmx?WSDL?op=GetCustomers', headers, xml, 10000); // Optional timeout parameter(milliseconds)
    const { body, statusCode } = response;
    const result = await transform(response.body, template);
    const prettyStr = await prettyPrint(response.body, { indentSize: 4 });

    return res.send(result.ItemsResult);
  })();
});


app.post("/getautoorder", function (req, res) {

  const headers = {
    'Content-Type': 'text/xml;charset=UTF-8',
    'soapAction': 'http://api.exigo.com/GetAutoOrders',
  };
  const xml = `<soap:Envelope 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
  <ApiAuthentication xmlns="http://api.exigo.com/">
  <LoginName>`+req.body.ApiAuthentication.LoginName+`</LoginName>
  <Password>`+req.body.ApiAuthentication.Password+`</Password>
  <Company>`+req.body.ApiAuthentication.Company+`</Company>
  </ApiAuthentication>
  </soap:Header>
  <soap:Body>
  <GetAutoOrdersRequest xmlns="http://api.exigo.com/">
  <CustomerID>`+req.body.GetAutoOrdersRequest.CustomerID+`</CustomerID>    
      </GetAutoOrdersRequest>
</soap:Body>
  </soap:Envelope>`;

  const template = {
    ItemsResult: ["//GetAutoOrdersResult", {
      Result: ["//Result", {
        Status: "Status",
        Errors: "Errors",
        TransactionKey: "TransactionKey"
      }],
      Items: ["//AutoOrders//AutoOrderResponse", {
        CustomerID: "CustomerID",
        AutoOrderID: "AutoOrderID",
        AutoOrderStatus: "AutoOrderStatus",
        Frequency:"Frequency",
        StartDate:"StartDate",
        StopDate:"StopDate",
        LastRunDate:"LastRunDate",
        NextRunDate:"NextRunDate",
        CurrencyCode:"CurrencyCode"
      }]
    }]
  };

  (async () => {
    const { response } = await soapRequest('http://sandboxapi3.exigo.com/3.0/ExigoApi.asmx?WSDL?op=GetAutoOrders', headers, xml, 10000); // Optional timeout parameter(milliseconds)
    const { body, statusCode } = response;
    const result = await transform(response.body, template);
    const prettyStr = await prettyPrint(response.body, { indentSize: 4 });
    return res.send(result.ItemsResult[0]);
  })();
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

  // const chkPath = `D:/Rogue/RogueAppFrontend/src/plugins/sample/`;
  // const dataPlugin = fs.readFileSync(chkPath + `index.js`).toString();
  // var appIndex = dataPlugin.indexOf("rootComponent");
  // var appName = dataPlugin.substring(appIndex).split("\n")[0].slice(14).substring(0, dataPlugin.substring(appIndex).split("\n")[0].slice(14).substring(0, 14).length - 1).trim();
  // //var webdata = dataPlugin.split("\n");
  // var dta = dataPlugin.indexOf("Root");
  // //var fileName = dataPlugin.substring(dta).split("\n")[0].slice(13).substring(0,(dataPlugin.substring(dta).split("\n")[0].slice(13)).length-2);
  // var fileLine = dataPlugin.substring(dta).split("\n")[0].split(' ');
  // var folderPath = dataPlugin.substring(dta).split("\n")[0].split(' ')[dataPlugin.substring(dta).split("\n")[0].split(' ').length - 1].split("/").length - 1
  // var fileNameArray = dataPlugin.substring(dta).split("\n")[0].split(' ')[dataPlugin.substring(dta).split("\n")[0].split(' ').length - 1].split("/")
  // var fileName = fileNameArray[fileNameArray.length - 1].slice(0, -2);
  // var pathLocationArr = chkPath.split('/');
  // var newFilePath = "";
  // if (folderPath > 1) {
  //   newFilePath = pathLocationArr.splice(0, pathLocationArr.length - (folderPath)).join(`/`);
  // }
  // else {
  //   newFilePath = pathLocationArr.splice(0, pathLocationArr.length - (folderPath - 1)).join(`/`);
  // }
  // console.log(fileName);
  // if (fs.existsSync(newFilePath + fileName)) {
  //   console.log("Component file found");
  // }
  // else {
  //   console.log("Component file not found");
  // }
});

app.listen(3000);
