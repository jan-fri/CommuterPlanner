using commuterPlanner.MZK_parser.Classes;
using commuterPlanner.MZK_parser.Models;
using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Text;


namespace commuterPlanner.MZK_parser
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Wybierz opcję:");
            Console.WriteLine("1. Rozkład jazdy - utworzenie nowego pliku timeTable.json");
            Console.WriteLine("2. Pliki CSV do konfiguracji grafowej bazy danych (Neo4j)");
            string input = Console.ReadLine();

            //html agile config
            HtmlWeb htmlWeb = new HtmlWeb()
            {
                AutoDetectEncoding = false,
                OverrideEncoding = Encoding.GetEncoding("iso-8859-2")
            };
            //read html page
            HtmlDocument htmlDocument = htmlWeb.Load("http://www.mzkb-b.internetdsl.pl/linie_r.htm#1");
            IEnumerable<HtmlNode> table = htmlDocument.DocumentNode.SelectNodes("//table").Descendants("tr");

            List<BusLink> busLinkList = new List<BusLink>();
            List<BusStopLink> busStopLink = new List<BusStopLink>();
            List<string> processedLinks = new List<string>();

            //extract content from main page
            MainPage mainPage = new MainPage();
            BusLinksExtractor busLinksExtractor = new BusLinksExtractor(mainPage, table, busLinkList);

            if (input == "1")
            {
                //Extract time tables from MZK Bielsko website
                TimeTableParser timeTableParser = new TimeTableParser();
                TimeTableExtractor timeTableExtractor = new TimeTableExtractor(timeTableParser, busStopLink, busLinkList, htmlWeb, processedLinks);
            }
            else if (input == "2")
            {
                //Extract busStops for Neo4j graph database
                BusStopsParser busStopsParser = new BusStopsParser();
                BusStopsExtractor busStopsExtractor = new BusStopsExtractor(busStopsParser, busStopLink, busLinkList, htmlWeb, processedLinks);
            }
            

            
        }
    }
}
