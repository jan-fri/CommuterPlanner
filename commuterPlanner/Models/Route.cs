using System.Collections.Generic;

namespace commuterPlanner.Models
{
    public class Route
    {
        public int busChanges;
        public List<string> busStopNameList;
        public List<string> busStopCity;
        public List<string> busStopRefList;
        public List<string> coordinates;
        public List<string> busNumber;
        public List<string> arrivalTime;
    }
}