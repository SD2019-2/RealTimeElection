using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace RealTimeElection.Hubs
{
    public class ElectionHub : Hub
    {
        static int vermelho;
        static int azul;
        static int amarelo;
        static int verde;

        public void UpdateChartValues(int vote)
        {
            switch (vote)
            {
                case 0:
                    vermelho++;
                    break;
                case 1:
                    azul++;
                    break;
                case 2:
                    amarelo++;
                    break;
                case 3:
                    verde++;
                    break;
            }
        }

        public async Task SendVote(string user, int vote)
        {
            UpdateChartValues(vote);
            await Clients.All.SendAsync("ReceiveVote", user, vote);
        }

        public async Task SendComment(string user, string comment)
        {
            await Clients.All.SendAsync("ReceiveComment", user, comment);
        }

        public async Task UpdateChart()
        {
            await Clients.Caller.SendAsync("UpdateChart", vermelho, azul, amarelo, verde);
        }
    }
}
