using System.Collections.Generic;
using System.Linq;
using Neo4j.Driver.V1;
using System.Collections;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using commuterPlanner.Models;
using commuterPlanner.Interfaces;

namespace commuterPlanner.Services
{
    public class GraphDatabaseService : IGraphDatabaseWrapper
    {
        //selected travel time by user
        public static string selectedTime { get; set; }

        //list of hours of bus arrival
        public static List<string> arrivalTimeList;
             
        public List<Route> getRoutes(List<Connections> connections, string selectedTravelDay, string selectedTravelTime)
        {
            selectedTravelDay = validateWeekDay(selectedTravelDay);

            using (var driver = GraphDatabase.Driver("bolt://localhost:7687", AuthTokens.Basic("neo4j", "password")))
            using (var session = driver.Session())
            {
                //list of shortest routes (least bus changes)
                List<Route> routes = new List<Route>();

                foreach (var connection in connections)
                {
                    //Neo4j query - receive all possible routes between bus stop A to bus stop B
                    var result = session.Run("MATCH p=shortestPath((a:BusStop {refNo:\"" + connection.busStopA + "\"})-[r:RELATION*]->(b:BusStop {refNo:\"" + connection.busStopB + "\"})) return extract(n in nodes(p)" +
                                   " | n) AS nodes, EXTRACT (rel in rels(p) | rel) AS relations");

                    //all bus stops names within route
                    List<string> busStopsName = new List<string>();
                    //all bus stops refs within route
                    List<string> busStopsRef = new List<string>();
                    //cities where the bus stops are
                    List<string> busStopCity = new List<string>();
                    //all possible relations
                    List<Relation> relations = new List<Relation>();

                    //extracts data from Neo4j query result, that is relations, bus name, bus ref and bus city
                    extractRelations(result, relations, busStopsName, busStopsRef, busStopCity);     

                    if (!busStopsRef.Any())
                    {
                        continue;
                    }
                
                    List<List<string>> allPaths = new List<List<string>>();                  
                    
                    //create all posible paths
                    getAllPaths(allPaths, relations);


                    //* the purpose of the below code is to select the shortest path (one with least bus change)
                    //calculating shortes connection from all available 
                    List<int> changes = new List<int>();
                    calculateShortestPath(changes, allPaths);
                    
                    //selecting route with least changes
                    int shortestPath = changes.IndexOf(changes.Min());

                    //get arrival time for each stop
                    bool isValidRoute = true;
                    getBusArrivalTimes(shortestPath, ref isValidRoute, allPaths, selectedTravelDay, selectedTravelTime, busStopsRef);                    

                    //adding shortest route to list i
                    if (isValidRoute)
                    {
                        var coordinates = getBusStopsCoordinates(busStopsRef, busStopCity);
                        if (coordinates.Count != busStopsName.Count)
                            continue;

                        routes.Add(new Route
                        {
                            busChanges = changes.Min(),
                            busNumber = new List<string>(allPaths[shortestPath]),
                            busStopNameList = new List<string>(busStopsName),
                            busStopCity = new List<string>(busStopCity),
                            busStopRefList = new List<string>(busStopsRef),
                            coordinates = new List<string>(coordinates),
                            arrivalTime = new List<string>(arrivalTimeList)
                        });
                    }
                }
                return routes;
            }
        }

        private void getBusArrivalTimes(int shortestPath, ref bool isValidRoute, List<List<string>> allPaths, string selectedTravelDay, string selectedTravelTime, List<string> busStopsRef)
        {
            arrivalTimeList = new List<string>();
            int indexPath = 0;
            int currentBusNo = new int();
            int lastBusNo = new int();

            foreach (var stopRef in busStopsRef)
            {
                bool isChange = false;

                if (indexPath == 0)
                {
                    int.TryParse(allPaths[shortestPath][indexPath], out currentBusNo);
                }
                else if (indexPath < busStopsRef.Count - 1)
                {
                    lastBusNo = currentBusNo;
                    int.TryParse(allPaths[shortestPath][indexPath], out currentBusNo);
                    if (lastBusNo != currentBusNo)
                        isChange = true;
                }
                else
                {
                    indexPath--;
                    isValidRoute = getArrivalTimes(stopRef, allPaths[shortestPath][indexPath], selectedTravelDay, selectedTravelTime, indexPath, isChange);
                    break;
                }

                isValidRoute = getArrivalTimes(stopRef, allPaths[shortestPath][indexPath], selectedTravelDay, selectedTravelTime, indexPath, isChange);
                if (!isValidRoute)
                    break;
                indexPath++;
            }
        }

        private void calculateShortestPath(List<int> changes, List<List<string>> allPaths)
        {
            int currentBusNo;
            int lastBusNo;

            foreach (var path in allPaths)
            {
                int change = 0;
                currentBusNo = new int();
                lastBusNo = new int();
                int index = 0;
                foreach (var busNumber in path)
                {
                    if (index > 0)
                    {
                        lastBusNo = currentBusNo;
                        int.TryParse(busNumber, out currentBusNo);
                        if (lastBusNo != currentBusNo)
                            change++;
                    }
                    else
                        int.TryParse(busNumber, out currentBusNo);

                    index++;
                }
                changes.Add(change);
            }
        }

        private void getAllPaths(List<List<string>> allPaths, List<Relation> relations)
        {
            List<List<string>> allRelations = new List<List<string>>();

            //extracting bus numebers
            foreach (var rel in relations)
            {
                allRelations.Add(new List<string>(rel.busNumber));
            }

            //savig to single string for each route
            IEnumerable<string> possibleRelations = new List<string> { null };
            foreach (var list in allRelations)
            {
                // cross join the current result with each member of the next list
                possibleRelations = possibleRelations.SelectMany(o => list.Select(s => o + s + " "));
            }


            foreach (var rel in possibleRelations)
            {
                var path = rel.Split(' ').Where(x => x != "").ToArray();
                allPaths.Add(new List<string>(path));
            }
        }

        private void extractRelations(IStatementResult result, List<Relation> relations, List<string> busStopsName, List<string> busStopsRef, List<string> busStopCity)
        {
            foreach (var record in result)
            {
                //all nodes returned by query
                var nodes = record["nodes"].As<List<INode>>();
                //all relation returned by query
                var rels = record["relations"].As<List<IRelationship>>();

                //saving nodes to busStop list variable
                foreach (var node in nodes)
                {
                    var nodeProperties = node.Properties.Values.ToList();
                    busStopsName.Add(nodeProperties[2].ToString());
                    busStopsRef.Add(nodeProperties[0].ToString());
                    busStopCity.Add(nodeProperties[1].ToString());
                }

                //saving relation to relations list variable
                foreach (var rel in rels)
                {
                    var relationProperties = rel.Properties["busNumber"];

                    if (relationProperties is IList)
                    {
                        List<string> listRel = new List<string>();
                        foreach (var numbers in relationProperties.As<List<string>>())
                        {
                            listRel.Add(numbers);
                        }
                        relations.Add(new Relation
                        {
                            busNumber = new List<string>(listRel)
                        });
                    }
                    else
                    {
                        relations.Add(new Relation
                        {
                            busNumber = new List<string> { relationProperties.ToString() }
                        });
                    }
                }
            }
        }

        public static List<string> getBusStopsCoordinates(List<string> busStopsRef, List<string> busStopCity)
        {
            List<string> coordinates = new List<string>();

            JObject busStopJSONData;


            using (StreamReader file = new StreamReader(System.Web.HttpContext.Current.Server.MapPath("~/Content/data/busStops.json")))
            using (JsonTextReader reader = new JsonTextReader(file))
            {
                busStopJSONData = (JObject)JToken.ReadFrom(reader);
            }

            // IEnumerable<JObject> busStops = busStopData["busStops"].Values<JObject>();
            IList<JToken> busStops = busStopJSONData["busStops"].Children().ToList();

            var selectedBusStops = busStopsRef.Zip(busStopCity, (r, c) => new { stopRef = r, stopCity = c });
            foreach (var busStop in selectedBusStops)
            {
                JToken cityStops = null;
                foreach (var item in busStops)
                {
                    cityStops = item[busStop.stopCity];
                    if (cityStops != null)
                        break;
                }

                JObject stop = cityStops.Values<JObject>()
                    .Where(m => m["tags"]["ref"].Value<string>() == busStop.stopRef)
                    .FirstOrDefault();

                if (stop == null)
                    break;

                var lat = (string)stop["lat"];
                var lon = (string)stop["lon"];

                coordinates.Add(lat + ", " + lon);

            }
            return coordinates;

        }
        public int calculateTimeDifference(string time)
        {
            if (time.Contains(':'))
                time = time.Replace(':', '.');

            int totalMinutes;

            string selectedTimeHours = time.ToString().Split('.').First();
            string selectedTimeMinutes = time.ToString().Split('.').Last();
            totalMinutes = int.Parse(selectedTimeHours) * 60 + int.Parse(selectedTimeMinutes);

            return totalMinutes;
        }
        public bool getArrivalTimes(string busStopRef, string busNo, string day, string time, int busStopOrderNo, bool isChange)
        {
            JObject timeTableData;

            using (StreamReader file = new StreamReader(System.Web.HttpContext.Current.Server.MapPath("~/Content/data/timeTable.json")))
            using (JsonTextReader reader = new JsonTextReader(file))
            {
                timeTableData = (JObject)JToken.ReadFrom(reader);
            }

            IEnumerable<JToken> timeTable = timeTableData.SelectToken("$.busStopDetail[?(@.stopRef == '" + busStopRef + "')]" +
               ".timeTable[?(@.line == '" + busNo + "')]" +
               ".time[?(@.day == '" + day + "')]" +
               ".hour");

            //check if there is any bus on the selected day, if no then the route is not valid
            if (timeTable == null || !timeTable.Any())
            {
                return false;
            }

            //if bus stop is first in sequence then calculate total number of minutes in selected time and select closest hour in timetable
            if (busStopOrderNo == 0)
                selectedTime = time;

            int totalMinutes = calculateTimeDifference(selectedTime);

            //if change in bus line then add additional time to ensure that passeger makes on time
            if (isChange)
                totalMinutes += 10;

            //select closest hour in timetable
            foreach (var item in timeTable)
            {
                int totalTimeTableMinutes = calculateTimeDifference(item.ToString());

                int difference = totalMinutes - totalTimeTableMinutes;
                if (difference < 0)
                {
                    arrivalTimeList.Add(item.ToString());
                    break;
                }

                if (item == timeTable.Last())
                {
                    arrivalTimeList.Add(timeTable.First().ToString());
                }
            }

            selectedTime = arrivalTimeList.Last();
            return true;
        }

        public string validateWeekDay(string selectedTravelDay)
        {
            string weekDay = string.Empty;
            switch (selectedTravelDay)
            {
                case "Saturday":
                    weekDay = "SOBOTY";
                    break;
                case "Sunday":
                    weekDay = "NIEDZIELE I ŚWIĘTA";
                    break;
                default:
                    weekDay = "DNI ROBOCZE";
                    break;
            }
            return weekDay;
        }
    }
}
