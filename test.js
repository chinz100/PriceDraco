const axios = require('axios');
const qs = require("qs");
var cron = require('node-cron');
require('dotenv').config({ path: '.env' })




let config = {
    method: 'post',
    url: 'https://api.mir4global.com/wallet/prices/draco/lastest',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
        'Referer': 'https://www.mir4draco.com/'
    },
    timeout: 6000
};

console.log("Start ing...." + process.env.tokenline)
cron.schedule('*/30 * * * *', () => {
    axios(config)
        .then((response) => {
            let ans = JSON.parse(JSON.stringify(response.data))

            let thb_us = 33

            let DrapriceTHB = ans.Data.USDDracoRate * thb_us;
            let Wemixone_THB = ans.Data.USDWemixRate * thb_us;
            let alerttoline = `Draco-THB: ${parseFloat(DrapriceTHB).toFixed(2)}\n\rWemix-THB: ${parseFloat(Wemixone_THB).toFixed(2)}\n\rDraco-ExchageWemix: ${parseFloat(ans.Data.DracoPrice).toFixed(2)}`;


            console.log(alerttoline)
            let bodydata = qs.stringify({
                message: alerttoline
            });
            let configfailed = {
                method: "post",
                url: "https://notify-api.line.me/api/notify",
                headers: {
                    authorization:
                    `Bearer ${process.env.tokenline}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: bodydata,
            };

              axios(configfailed)
                .then((response) => {
                  // console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                  console.log("Line noti err");
                });


        }).catch((error) => {
            console.log(error);
        });

});

