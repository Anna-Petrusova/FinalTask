/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": NaN, "KoPercent": NaN};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5597772682607272, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "open_account"], "isController": true}, {"data": [0.0, 500, 1500, "5_Просмотр заказов"], "isController": true}, {"data": [0.0, 500, 1500, "6_Выбор без покупки"], "isController": true}, {"data": [1.0, 500, 1500, "open_order_list"], "isController": true}, {"data": [0.477088948787062, 500, 1500, "open_payment_page"], "isController": true}, {"data": [0.0, 500, 1500, "2_Покупка с выбором из категории"], "isController": true}, {"data": [0.0, 500, 1500, "1_Регистрация"], "isController": true}, {"data": [0.0, 500, 1500, "open_homepage"], "isController": true}, {"data": [0.9018232819074333, 500, 1500, "login"], "isController": true}, {"data": [0.49865229110512127, 500, 1500, "submit_payment"], "isController": true}, {"data": [0.820631970260223, 500, 1500, "add_to_cart"], "isController": true}, {"data": [1.0, 500, 1500, "open_register_page"], "isController": true}, {"data": [0.0, 500, 1500, "3_Быстрая покупка"], "isController": true}, {"data": [0.4581005586592179, 500, 1500, "open_item_page"], "isController": true}, {"data": [1.0, 500, 1500, "logout"], "isController": true}, {"data": [0.5, 500, 1500, "submit_register_data"], "isController": true}, {"data": [0.8297297297297297, 500, 1500, "open_cart"], "isController": true}, {"data": [0.9973045822102425, 500, 1500, "delete_order"], "isController": true}, {"data": [0.5, 500, 1500, "open_category_page"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 0, 0, NaN, NaN, 9223372036854775807, -9223372036854775808, NaN, NaN, NaN, NaN, 0.0, 0.0, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["open_account", 40, 0, 0.0, 652.8500000000001, 633, 673, 654.0, 664.9, 667.85, 673.0, 0.0341684092555387, 0.21518756961813384, 0.1294662381948146], "isController": true}, {"data": ["5_Просмотр заказов", 171, 0, 0.0, 4451.754385964913, 4270, 4705, 4440.0, 4587.0, 4620.0, 4704.28, 0.1431769885274205, 22.400858504608458, 1.728616999514789], "isController": true}, {"data": ["6_Выбор без покупки", 166, 0, 0.0, 5092.0, 4774, 5720, 5064.0, 5367.6, 5440.95, 5661.710000000001, 0.13983645873434528, 23.03068238822981, 1.5497789494112126], "isController": true}, {"data": ["open_order_list", 172, 0, 0.0, 306.16279069767427, 294, 325, 306.0, 312.0, 315.0, 318.43000000000006, 0.14417447122755342, 0.3377140954225444, 0.14904337199779716], "isController": true}, {"data": ["open_payment_page", 371, 0, 0.0, 1330.8409703504033, 1201, 1624, 1300.0, 1440.6, 1499.4, 1604.84, 0.31016384342327247, 3.9520719595269624, 1.937701879511379], "isController": true}, {"data": ["2_Покупка с выбором из категории", 332, 1, 0.30120481927710846, 8783.259036144591, 8151, 10277, 8664.0, 9242.1, 9511.1, 9896.42, 0.275368305108082, 52.20300427365182, 6.866657725750172], "isController": true}, {"data": ["1_Регистрация", 38, 0, 0.0, 4295.421052631582, 4161, 4388, 4301.5, 4374.3, 4388.0, 4388.0, 0.03504565157244305, 5.73237053859633, 0.5352675689384857], "isController": true}, {"data": ["open_homepage", 750, 0, 0.0, 2768.5266666666676, 2648, 2905, 2768.0, 2818.0, 2834.45, 2863.49, 0.6250989740042174, 91.55365126822164, 4.378134610896725], "isController": true}, {"data": ["login", 713, 0, 0.0, 435.475455820477, 358, 986, 393.0, 541.0, 615.3, 746.0, 0.5950925314635354, 1.2581937050707226, 0.9661450878157933], "isController": true}, {"data": ["submit_payment", 371, 1, 0.2695417789757412, 713.5309973045817, 671, 1001, 711.0, 740.8, 751.0, 783.0, 0.3103563660699348, 0.7492817519240421, 1.0964246408106073], "isController": true}, {"data": ["add_to_cart", 538, 0, 0.0, 504.1524163568775, 406, 858, 471.0, 612.7000000000002, 682.05, 771.6600000000001, 0.44931433630092366, 0.3572407503779084, 0.31307449650486896], "isController": true}, {"data": ["open_register_page", 40, 0, 0.0, 300.0, 290, 319, 299.0, 305.9, 318.79999999999995, 319.0, 0.03417894901440729, 0.23119188510575395, 0.048698326769551006], "isController": true}, {"data": ["3_Быстрая покупка", 37, 0, 0.0, 7952.2972972972975, 7563, 8700, 7822.0, 8456.0, 8639.7, 8700.0, 0.033701806416823944, 6.251186074447745, 0.797109809650831], "isController": true}, {"data": ["open_item_page", 537, 0, 0.0, 1377.2346368715089, 1260, 1912, 1359.0, 1487.2, 1534.0, 1664.7000000000003, 0.44879064710262595, 6.766984319332096, 0.7892342243192715], "isController": true}, {"data": ["logout", 544, 0, 0.0, 202.07720588235313, 180, 349, 202.0, 216.0, 220.0, 231.54999999999995, 0.453871549345599, 0.5092757912090754, 0.4985045547762055], "isController": true}, {"data": ["submit_register_data", 40, 0, 0.0, 582.05, 546, 645, 578.5, 609.6, 621.65, 645.0, 0.03417109467101778, 0.11018175818824857, 0.10441538596251432], "isController": true}, {"data": ["open_cart", 370, 0, 0.0, 500.3351351351354, 418, 801, 460.0, 594.9000000000001, 675.8, 773.29, 0.31012066208246863, 0.8052709275918544, 0.2973059210416031], "isController": true}, {"data": ["delete_order", 371, 1, 0.2695417789757412, 200.78436657681942, 158, 266, 197.0, 218.0, 227.0, 252.0, 0.3098824952306494, 0.18698711601925447, 0.21840001183985003], "isController": true}, {"data": ["open_category_page", 505, 0, 0.0, 739.6772277227728, 693, 918, 735.0, 767.0, 784.0, 824.64, 0.42235627968516476, 1.8950714302217244, 0.5547550743911588], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 0, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
