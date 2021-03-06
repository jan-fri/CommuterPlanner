﻿using commuterPlanner.MZK_parser.Interfaces;
using commuterPlanner.MZK_parser.Models;
using HtmlAgilityPack;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace commuterPlanner.MZK_parser.Classes
{
    public class BusStopsParser : IBusStopsExtractor
    {
        //extracts bus stop list for each bus line number - used in graph database
        public void GetBusStopList(List<BusStopLink> busStopLink, List<BusLink> busLinkList, HtmlWeb htmlWeb, List<string> processedLinks)
        {
            List<string> processedStops = new List<string>();
            Dictionary<string, List<string>> processedRelations = new Dictionary<string, List<string>>();

            System.IO.StreamWriter busStopsFile = new System.IO.StreamWriter(@"../../Neo4jOutputData/busStops.csv");
            System.IO.StreamWriter createRelationsFile = new System.IO.StreamWriter(@"../../Neo4jOutputData/createRelations.csv");
            System.IO.StreamWriter mergeRelationsFile = new System.IO.StreamWriter(@"../../Neo4jOutputData/mergeRelations.csv");

            busStopsFile.WriteLine("ref,name,city");
            createRelationsFile.WriteLine("busA,line,busB");
            mergeRelationsFile.WriteLine("busA,line,busB");

            foreach (var bLink in busLinkList)
            {
                if (bLink.busNumber == null)
                    continue; // break;

                string link = "http://www.mzkb-b.internetdsl.pl/" + bLink.linktoBus;
                HtmlDocument doc = htmlWeb.Load(link);

                var tab = doc.DocumentNode.SelectNodes("//table").Descendants("tr");
                int iterations = 0;

                foreach (var stop in tab)
                {
                    if (stop.InnerText.Contains("Pozostałe przystanki linii"))
                    {
                        iterations++;
                        if (iterations <= 1)
                            continue;
                        else if (iterations >= 2)
                            break;
                    }
                    //IEnumerable<HtmlNode> stopLinks = stop.Descendants("td");
                    IEnumerable<HtmlNode> stopLinks = stop.Descendants("a").Where(x => x.Attributes.Contains("href"));
                    // IEnumerable<HtmlNode> s = stop.Descendants("td").Where(x => x.InnerText.Contains("Pozostałe przystanki linii"));
                
                    foreach (var sLink in stopLinks)
                    {
                        BusStopLink tempStopLink;
                        if (sLink.InnerText.Contains('('))
                        {
                            string stopName = Regex.Replace(sLink.InnerText.Replace("&nbsp;", ""), "(\\(.*\\))", "");

                            string stopNo = sLink.Attributes["href"].Value.Split('_', '_')[1];
                            string extractedStopLink = "p_" + stopNo + "_l.htm";

                            tempStopLink = new BusStopLink
                            {
                                stopRef = sLink.InnerText.Split('(', ')')[1],
                                stopLink = extractedStopLink,
                                stopName = stopName
                            };

                            if (processedLinks.Contains(extractedStopLink))
                                break;
                            else
                                processedLinks.Add(extractedStopLink);

                            busStopLink.Add(tempStopLink);
                        }
                    }
                }

                processedLinks.Clear();

                int index = 0;
                StringBuilder busStopBuilder = new StringBuilder();
                StringBuilder createRelationsBuilder = new StringBuilder();
                StringBuilder mergeRelationsBuilder = new StringBuilder();

                foreach (var busStop in busStopLink)
                {
                    if (!processedStops.Contains(busStop.stopRef))
                    {
                        busStopBuilder.Append(busStop.stopRef + "," + busStop.stopName + "," + "Bielsko Biała" + "\n");
                        processedStops.Add(busStop.stopRef);
                    }

                    if (index < busStopLink.Count - 1)
                    {
                        bool relationCreated = false;
                        bool relationExists = false;

                        if (processedRelations.ContainsKey(busStop.stopRef))
                        {
                            relationExists = true;
                            foreach (var rel in processedRelations[busStop.stopRef])
                            {
                                if (rel == busStopLink[index + 1].stopRef)
                                {
                                    mergeRelationsBuilder.Append(busStop.stopRef + "," + bLink.busNumber + "," + busStopLink[index + 1].stopRef + "\n");
                                    relationCreated = true;
                                    break;
                                }
                            }
                            processedRelations[busStop.stopRef].Add(busStopLink[index + 1].stopRef);
                        }

                        if (!relationCreated)
                        {
                            createRelationsBuilder.Append(busStop.stopRef + "," + bLink.busNumber + "," + busStopLink[index + 1].stopRef + "\n");
                            if (!relationExists)
                            {
                                processedRelations.Add(busStop.stopRef, new List<string>() { busStopLink[index + 1].stopRef });
                            }
                        }
                    }
                    index++;
                }

                busStopLink.Clear();

                busStopsFile.WriteLine(busStopBuilder);
                createRelationsFile.WriteLine(createRelationsBuilder);
                mergeRelationsFile.WriteLine(mergeRelationsBuilder);
            }
            busStopsFile.Close();
            createRelationsFile.Close();
            mergeRelationsFile.Close();
        }
    }
}
