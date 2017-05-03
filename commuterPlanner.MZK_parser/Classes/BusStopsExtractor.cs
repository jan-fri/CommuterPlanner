using commuterPlanner.MZK_parser.Interfaces;
using commuterPlanner.MZK_parser.Models;
using HtmlAgilityPack;
using System.Collections.Generic;

namespace commuterPlanner.MZK_parser.Classes
{
    public class BusStopsExtractor
    {
        IBusStopsExtractor _busStopsExtractor = null;
        public BusStopsExtractor(IBusStopsExtractor busStopsExtractor, List<BusStopLink> busStopLink, List<BusLink> busLinkList, HtmlWeb htmlWeb, List<string> processedLinks)
        {
            _busStopsExtractor = busStopsExtractor;
            _busStopsExtractor.GetBusStopList(busStopLink, busLinkList, htmlWeb, processedLinks);
        }
    }
}
