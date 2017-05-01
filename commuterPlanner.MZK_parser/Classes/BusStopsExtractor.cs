using commuterPlanner.MZK_parser.Interfaces;
using commuterPlanner.MZK_parser.Models;
using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
