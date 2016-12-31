using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace commuterPlanner.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult GetBusTimeTable(string busNo, string busStopRef)
        {
            //var json = @"{
            //    'busStopDetail': [{
            //    'StopRef': '329',
            //    'name': 'Osiedle Langiewicza',
            //    'timeTable': [
            //      {
            //        'line': '15',
            //        'time': [
            //          {
            //            'day': 'Dni robocze',
            //            'hour': [ '4.50', '5.35', '6.15', '7.20', '8.25', '9.05', '10.05', '10.50', '11.40', '12.40', '13.20', '14.10', '14.50', '15.40', '16.20', '17.30', '18.40', '19.20', '20.05', '20.55', '21.50', '22.15' ]
            //            },
            //          {
            //            'day': 'Soboty',
            //            'hour': [ '5.35', '6.15', '7.20', '8.25', '9.05', '10.05', '10.50', '11.40', '12.40', '13.20', '14.10', '14.50', '15.40', '16.20', '17.30', '18.40', '19.20', '20.05', '20.55', '21.50', '22.15' ]
            //            },
            //          {
            //            'day': 'Niedziele i Święta',
            //            'hour': [ '6.10', '8.00', '9.30', '11.00', '12.25', '13.55', '15.25', '17.20', '18.00', '18.50', '20.10', '21.26', '22.15' ]
            //            }]
            //      },
            //        {
            //        'line': '34',
            //        'time': [
            //          {
            //            'day': 'Dni robocze',
            //            'hour': [ '4.50', '5.35', '6.15', '7.20', '8.25', '9.05', '10.05', '10.50', '11.40', '12.40', '13.20', '14.10', '14.50', '15.40', '16.20', '17.30', '18.40', '19.20', '20.05', '20.55', '21.50', '22.15' ]
            //            },
            //          {
            //            'day': 'Soboty',
            //            'hour': [ '5.35', '6.15', '7.20', '8.25', '9.05', '10.05', '10.50', '11.40', '12.40', '13.20', '14.10', '14.50', '15.40', '16.20', '17.30', '18.40', '19.20', '20.05', '20.55', '21.50', '22.15' ]
            //            },
            //          {
            //            'day': 'Niedziele i Święta',
            //            'hour': [ '6.10', '8.00', '9.30', '11.00', '12.25', '13.55', '15.25', '17.20', '18.00', '18.50', '20.10', '21.26', '22.15' ]
            //            }]
            //      },
            //        ],
            //    },
            //    {
            //    'StopRef': '340',
            //    'name': 'Os',
            //    'timeTable': [
            //      {
            //        'line': '14',
            //        'time': [
            //          {
            //            'day': 'rob ',
            //            'hour': [ '4.50', '5.35', '6.15', '7.20', '8.25', '9.05', '10.05', '10.50', '11.40', '12.40', '13.20', '14.10', '14.50', '15.40', '16.20', '17.30', '18.40', '19.20', '20.05', '20.55', '21.50', '22.15' ]
            //            },
            //          {
            //            'day': 'Soboty',
            //            'hour': [ '5.35', '6.15', '7.20', '8.25', '9.05', '10.05', '10.50', '11.40', '12.40', '13.20', '14.10', '14.50', '15.40', '16.20', '17.30', '18.40', '19.20', '20.05', '20.55', '21.50', '22.15' ]
            //            },
            //          {
            //            'day': 'Niedziele i Święta',
            //            'hour': [ '6.10', '8.00', '9.30', '11.00', '12.25', '13.55', '15.25', '17.20', '18.00', '18.50', '20.10', '21.26', '22.15' ]
            //            }]
            //      },
            //        {
            //        'line': '34',
            //        'time': [
            //          {
            //            'day': 'Dni robocze',
            //            'hour': [ '4.50', '5.35', '6.15', '7.20', '8.25', '9.05', '10.05', '10.50', '11.40', '12.40', '13.20', '14.10', '14.50', '15.40', '16.20', '17.30', '18.40', '19.20', '20.05', '20.55', '21.50', '22.15' ]
            //            },
            //          {
            //            'day': 'Soboty',
            //            'hour': [ '5.35', '6.15', '7.20', '8.25', '9.05', '10.05', '10.50', '11.40', '12.40', '13.20', '14.10', '14.50', '15.40', '16.20', '17.30', '18.40', '19.20', '20.05', '20.55', '21.50', '22.15' ]
            //            },
            //          {
            //            'day': 'Niedziele i Święta',
            //            'hour': [ '6.10', '8.00', '9.30', '11.00', '12.25', '13.55', '15.25', '17.20', '18.00', '18.50', '20.10', '21.26', '22.15' ]
            //            }]
            //      },
            //        ]
            //    }]}";

            JObject timeTableData;

            using (StreamReader file = new StreamReader(Server.MapPath("~/Content/data/timeTableTest.json")))
            using (JsonTextReader reader = new JsonTextReader(file))
            {
                timeTableData = (JObject)JToken.ReadFrom(reader);
            }

            //   JObject timeTableData = JObject.Parse(json);

            IEnumerable<JToken> timeTable = timeTableData.SelectToken("$.busStopDetail[?(@.StopRef == '"+ busStopRef +"')]" +
                ".timeTable[?(@.line == '" + busNo + "')]" +
                ".time");

            var settings = new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };

            var jsonResult = new ContentResult
            {
                Content = JsonConvert.SerializeObject(timeTable, settings),
                ContentType = "application/json"
            };

            return jsonResult;
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}