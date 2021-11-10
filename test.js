const axios = require('axios');
const qs = require("qs");
var cron = require('node-cron');
require('dotenv').config({ path: '.env' })


const alertfunc = (alertnow = false) => {

    let config = {
        method: 'post',
        url: 'https://api.mir4global.com/wallet/prices/draco/lastest',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
            'Referer': 'https://www.mir4draco.com/'
        }
    };

    axios(config)
        .then((response) => {
            let ans = JSON.parse(JSON.stringify(response.data))
            let thb_us = 32.82
            let DrapriceTHB = ans.Data.USDDracoRate * thb_us;
            let Wemixone_THB = ans.Data.USDWemixRate * thb_us;
            let alerttoline = `Draco-THB: ${parseFloat(DrapriceTHB).toFixed(3)}\n\rWemix-THB: ${parseFloat(Wemixone_THB).toFixed(3)}\n\rDraco-ExchageWemix: ${parseFloat(ans.Data.DracoPrice).toFixed(3)}`;

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

            // console.log(configfailed.headers.authorization)

            if (alertnow === 30) {

                axios(configfailed)
                    .then((response) => {
                        // console.log(JSON.stringify(response.data));
                    })
                    .catch((error) => {
                        console.log("Line noti err");
                    });

                /////// alert Group2

            }else if(alertnow === 10){ //alert 5 min

                configfailed.headers.authorization = `Bearer ${process.env.tokenline_PB}`

                axios(configfailed)
                    .then((response) => {
                        // console.log(JSON.stringify(response.data));
                    })
                    .catch((error) => {
                        console.log("Line noti err");
                    });

            }
        }).catch((error) => {
            console.log(error);
        });
}


console.log("Start ing...." + process.env.tokenline);
alertfunc();
cron.schedule('*/30 * * * *', () => {

    alertfunc(30);
});

cron.schedule('*/10 * * * *', () => {

    alertfunc(10);
});

