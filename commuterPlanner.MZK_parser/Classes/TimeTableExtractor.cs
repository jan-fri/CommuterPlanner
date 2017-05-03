using commuterPlanner.MZK_parser.Interfaces;
using commuterPlanner.MZK_parser.Models;
using HtmlAgilityPack;
using System.Collections.Generic;

namespace commuterPlanner.MZK_parser.Classes
{
    public class TimeTableExtractor
    {
        ITimeTableExtractor _timeTableExtractor = null;
        public TimeTableExtractor(ITimeTableExtractor timeTableExtractor, List<BusStopLink> busStopLink, List<BusLink> busLinkList, HtmlWeb htmlWeb, List<string> processedLinks)
        {
            _timeTableExtractor = timeTableExtractor;
            _timeTableExtractor.GetTimeTable(busStopLink, busLinkList, htmlWeb, processedLinks);
        }
    }
}
