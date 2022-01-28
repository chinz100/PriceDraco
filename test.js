const axios = require('axios');
const qs = require("qs");
var cron = require('node-cron');
var thb_us = 32.82;
var HydraPriceWemix;
require('dotenv').config({ path: '.env' })

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
  }


const alertfunc = async (alertnow = false) => {

    let config = {
        method: 'post',
        url: 'https://api.mir4global.com/wallet/prices/draco/lastest',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
            'Referer': 'https://www.mir4draco.com/'
        }
    };

    let confighydra = {
        method: 'post',
        url: 'https://api.mir4global.com/wallet/prices/hydra/lastest',
        headers: { 
            'Accept': 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
            'Referer': 'https://www.mir4draco.com/'
        },
        };

        let getEGG = {
            method: 'post',
            url: 'https://api.mir4global.com/wallet/prices/hydra',
            headers: { 
                'Accept': 'application/json, text/plain, */*',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
                'Referer': 'https://www.mir4draco.com/'
            },
            };


        
         let HydraPriceWemix,totlesupply_hydra;
        try {
            let resulthtdra =  await axios(confighydra)

            let resultcalEgg_hydra = await axios(getEGG);
            let arrEgg = resultcalEgg_hydra.data.Data;
            totlesupply_hydra = arrEgg[arrEgg.length-1].TotalSupply;
            let anshydra = JSON.parse(JSON.stringify(resulthtdra.data))
            // console.log(anshydra)
            HydraPriceWemix = parseFloat(anshydra.Data.HydraPriceWemix).toFixed(4)
        } catch (error) {
            HydraPriceWemix = "Hydra Error.";
        }


               
        let state = parseInt(totlesupply_hydra/100000)+1;
        let arr = [];
        
        let sum = 0;
        
for (let i = 1; i <= state; i++) {
// Sumation
let algrolitum =  0.6 / parseFloat(getBaseLog(3.7,i+1));
// console.log(i)
// console.log(algrolitum)
arr.push(algrolitum)
// console.log(algrolitum)
}
    // console.log(arr)
const reducer = (accumulator, curr) => accumulator + curr;
let useDracobuthydra = 20 + Math.round(arr.reduce(reducer))


    

    axios(config)
        .then((response) => {
            let ans = JSON.parse(JSON.stringify(response.data))

            let DrapriceTHB = ans.Data.USDDracoRate * thb_us;
            let Wemixone_THB = ans.Data.USDWemixRate * thb_us;
            let DracoPriceWemix = parseFloat(ans.Data.DracoPrice).toFixed(4)
            let dragobuyHydra = parseFloat(DracoPriceWemix*useDracobuthydra).toFixed(4);

      
            let alerttoline = `\n\rDraco-THB: ${parseFloat(DrapriceTHB).toFixed(3)}\n\rWemix-THB: ${parseFloat(Wemixone_THB).toFixed(3)}\n\rDraco-ExchageWemix: ${DracoPriceWemix}\n\rDraco-Buy_Hydra : ${dragobuyHydra} wemix\n\r\n\r======= Hrdra ======= \n\rหลอม  ${useDracobuthydra} Draco + ${state} Egg\n\rHydraPriceWemix : ${HydraPriceWemix}\n\rTotal_Token : ${totlesupply_hydra}\n\rState : ${state}`;


            // cal
            // console.log( Math.log10(37100));

            // console.log(algrolitum)
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

    // alertfunc(30);
});

cron.schedule('*/10 * * * *', () => {

    alertfunc(10);
});

