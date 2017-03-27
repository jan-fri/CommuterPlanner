using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Neo4jClient;
using Neo4j;
using Neo4j.Driver;
using Neo4j.Driver.V1;
using System.Collections;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using System.Web.Mvc;

namespace commuterPlanner.Services
{
    public class Relation
    {
        public List<string> busNumber;
    }
    public class Route
    {
        public int busChanges;
        public List<string> busStopNameList;
        public List<string> busStopRefList;
        public List<string> coordinates;
        public List<string> busNumber;
        public List<string> arrivalTime;
    }
    public class Connections
    {
        public string busStopA;
        public string busStopB;
    }
    public class GraphDatabaseService
    {
        //selected travel time by user
        public static string selectedTime { get; set; }

        //list of hours of bus arrival
        public static List<string> arrivalTimeList;

        public int calculateTimeDifference(string time)
        {
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
            //JObject timeTableData = JObject.Parse(File.ReadAllText("~/Content/data/timeTable.json"));

            IEnumerable<JToken> timeTable = timeTableData.SelectToken("$.busStopDetail[?(@.stopRef == '" + busStopRef + "')]" +
               ".timeTable[?(@.line == '" + busNo + "')]" +
               ".time[?(@.day == '" + day + "')]" +
               ".hour");

            //check if there is any bus on the selected day, if no then the route is not valid
            if (!timeTable.Any())
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

                    //all possible relations
                    List<Relation> relations = new List<Relation>();

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
                            busStopsName.Add(nodeProperties[1].ToString());
                            busStopsRef.Add(nodeProperties[0].ToString());
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

                    //* the purpose of the below code is to select the shortest path (one with least bus change)
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


                    List<List<string>> allPaths = new List<List<string>>();
                    foreach (var rel in possibleRelations)
                    {
                        var path = rel.Split(' ').Where(x => x != "").ToArray();
                        allPaths.Add(new List<string>(path));
                    }

                    //calculating shortes connection from all available 
                    List<int> changes = new List<int>();
                    int currentBusNo;
                    int lastNusNo;
                    foreach (var path in allPaths)
                    {
                        int change = 0;
                        currentBusNo = new int();
                        lastNusNo = new int();
                        int index = 0;
                        foreach (var busNumber in path)
                        {
                            if (index > 0)
                            {
                                lastNusNo = currentBusNo;
                                int.TryParse(busNumber, out currentBusNo);
                                if (lastNusNo != currentBusNo)
                                    change++;
                            }
                            else
                                int.TryParse(busNumber, out currentBusNo);

                            index++;
                        }
                        changes.Add(change);
                    }

                    //selecting route with least changes
                    int shortestPath = changes.IndexOf(changes.Min());

                    //get arrival time for each stop
                    arrivalTimeList = new List<string>();
                    int indexPath = 0;
                    currentBusNo = new int();
                    lastNusNo = new int();
                    bool isValidRoute = true;
                    foreach (var stopRef in busStopsRef)
                    {
                        bool isChange = false;

                        if (indexPath == 0)
                        {
                            int.TryParse(allPaths[shortestPath][indexPath], out currentBusNo);
                        }
                        else if (indexPath < busStopsRef.Count - 1)
                        {
                            lastNusNo = currentBusNo;
                            int.TryParse(allPaths[shortestPath][indexPath], out currentBusNo);
                            if (lastNusNo != currentBusNo)
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
                    
                    //adding shortest route to list i
                    if (isValidRoute)
                    {
                        var coordinates = getBusStopsCoordinates(busStopsRef);

                        routes.Add(new Route
                        {
                            busChanges = changes.Min(),
                            busNumber = new List<string>(allPaths[shortestPath]),
                            busStopNameList = new List<string>(busStopsName),
                            busStopRefList = new List<string>(busStopsRef),
                            coordinates = new List<string>(coordinates),
                            arrivalTime = new List<string>(arrivalTimeList)
                        }); 
                    }
                }
                return routes;
            }
        }
        public static List<string> getBusStopsCoordinates(List<string> busStopsRef)
        {
            //hardcodedselected city - to be implemented through Neo4j add city to database
            string selectedCity = "Bielsko Biała";

            List<string> coordinates = new List<string>();

            JObject busStopData;

            using (StreamReader file = new StreamReader(System.Web.HttpContext.Current.Server.MapPath("~/Content/data/busStops.json")))
            using (JsonTextReader reader = new JsonTextReader(file))
            {
                busStopData = (JObject)JToken.ReadFrom(reader);
            }

            foreach (string stopRef in busStopsRef)
            {
                JObject busStops = busStopData["busStops"].Values<JObject>().FirstOrDefault();

                JObject busStop = busStops[selectedCity].Values<JObject>()
                    .Where(m => m["tags"]["ref"].Value<string>() == stopRef)
                    .FirstOrDefault();

                var lat = (string)busStop["lat"];
                var lon = (string)busStop["lon"];

                coordinates.Add(lat + ", " + lon);

            }
            return coordinates;

        }
    }
}
