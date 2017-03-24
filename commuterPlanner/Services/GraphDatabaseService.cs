using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Neo4jClient;
using Neo4j;
using Neo4j.Driver;
using Neo4j.Driver.V1;
using System.Collections;

namespace commuterPlanner.Services
{
    public class Relation
    {
        public List<string> busNumber;
    }
    //public class BusStop
    //{
    //    public string name;
    //    public string refNo;
    //}
    public class Route
    {
        public int busChanges;
        public List<string> busStopNameList;
        public List<string> busStopRefList;
        public List<string> busNumber;
    }

    public class Connections
    {
        public string busStopA;
        public string busStopB;
    }

    public class GraphDatabaseService
    {
        public List<Route> getRoutes(List<Connections> connections)
        {
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
                            //busStops.Add(new BusStop
                            //{
                            //    refNo = nodeProperties[0].ToString(),
                            //    name = nodeProperties[1].ToString()
                            //});
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
                    foreach (var path in allPaths)
                    {
                        int change = 0;
                        int currentBusNo = new int();
                        int lastNusNo = new int();
                        int index = 0;
                        foreach (var busNumber in path)
                        {
                            if (index > 0)
                            {
                                lastNusNo = currentBusNo;
                                int.TryParse(busNumber, out currentBusNo);
                                if (lastNusNo != currentBusNo)
                                {
                                    change++;
                                }
                            }
                            else
                            {
                                int.TryParse(busNumber, out currentBusNo);
                            }

                            index++;
                        }
                        changes.Add(change);
                    }

                    //selecting route with least changes
                    int shortestPath = changes.IndexOf(changes.Min());

                    //adding shortest route to list
                    routes.Add(new Route
                    {
                        busChanges = changes.Min(),
                        busNumber = new List<string>(allPaths[shortestPath]),
                        busStopNameList = new List<string>(busStopsName),
                        busStopRefList = new List<string>(busStopsRef)
                    });
                }
                return routes;
            }
             
        }
    }
}
