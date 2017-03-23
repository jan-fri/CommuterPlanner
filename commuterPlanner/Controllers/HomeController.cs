using commuterPlanner.Services;
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
            JObject timeTableData;

            using (StreamReader file = new StreamReader(Server.MapPath("~/Content/data/timeTable.json")))
            using (JsonTextReader reader = new JsonTextReader(file))
            {
                timeTableData = (JObject)JToken.ReadFrom(reader);
            }

            IEnumerable<JToken> timeTable = timeTableData.SelectToken("$.busStopDetail[?(@.stopRef == '"+ busStopRef +"')]" +
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

        public ActionResult GetRoute(List<string> busStopA, List<string> busStopB)
        {
            List<Connections> connections = new List<Connections>();
            foreach (var beginning in busStopA)
            {
                foreach (var finish in busStopB)
                {
                    connections.Add(new Connections { busStopA = beginning, busStopB = finish });
                }                
            }

            GraphDatabaseService graphDatabase = new GraphDatabaseService();
            var routes = graphDatabase.getRoutes(connections);

            var settings = new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };

            var jsonResult = new ContentResult
            {
                Content = JsonConvert.SerializeObject(routes, settings),
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