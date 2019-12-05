using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace RealTimeElection.Hubs
{
    public class ElectionHub : Hub
    {
        public async Task SendVote(string user, /*string status,*/ int vote)
        {
            await Clients.All.SendAsync("ReceiveVote", user, /*status*/ vote);
        }
    }
}
