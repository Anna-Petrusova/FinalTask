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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5753480753480753, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "open_account"], "isController": true}, {"data": [0.0, 500, 1500, "5_Просмотр заказов"], "isController": true}, {"data": [0.0, 500, 1500, "6_Выбор без покупки"], "isController": true}, {"data": [1.0, 500, 1500, "open_order_list"], "isController": true}, {"data": [0.47297297297297297, 500, 1500, "open_payment_page"], "isController": true}, {"data": [0.0, 500, 1500, "2_Покупка с выбором из категории"], "isController": true}, {"data": [0.0, 500, 1500, "1_Регистрация"], "isController": true}, {"data": [0.0, 500, 1500, "open_homepage"], "isController": true}, {"data": [0.9295774647887324, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "submit_payment"], "isController": true}, {"data": [0.8703703703703703, 500, 1500, "add_to_cart"], "isController": true}, {"data": [1.0, 500, 1500, "open_register_page"], "isController": true}, {"data": [0.0, 500, 1500, "3_Быстрая покупка"], "isController": true}, {"data": [0.5, 500, 1500, "open_item_page"], "isController": true}, {"data": [1.0, 500, 1500, "logout"], "isController": true}, {"data": [0.5, 500, 1500, "submit_register_data"], "isController": true}, {"data": [0.9066666666666666, 500, 1500, "open_cart"], "isController": true}, {"data": [1.0, 500, 1500, "delete_order"], "isController": true}, {"data": [0.5, 500, 1500, "open_category_page"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 0, 0, NaN, NaN, 9223372036854775807, -9223372036854775808, NaN, NaN, NaN, NaN, 0.0, 0.0, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["open_account", 8, 0, 0.0, 659.9999999999999, 645, 694, 658.0, 694.0, 694.0, 694.0, 0.00761466737229251, 0.047948608609904395, 0.028852450590327088], "isController": true}, {"data": ["5_Просмотр заказов", 35, 0, 0.0, 4436.5714285714275, 4313, 4657, 4444.0, 4528.8, 4560.2, 4657.0, 0.029303465009151056, 4.590010871323881, 0.35386713903154565], "isController": true}, {"data": ["6_Выбор без покупки", 33, 0, 0.0, 5028.969696969698, 4818, 5367, 5018.0, 5203.2, 5365.6, 5367.0, 0.028524973614399405, 4.698463780252679, 0.3159804317060268], "isController": true}, {"data": ["open_order_list", 35, 0, 0.0, 307.7714285714286, 300, 317, 308.0, 312.0, 314.59999999999997, 317.0, 0.029396794573519704, 0.06888233282042926, 0.03040812961004732], "isController": true}, {"data": ["open_payment_page", 74, 0, 0.0, 1349.8243243243244, 1271, 1564, 1335.0, 1441.0, 1506.75, 1564.0, 0.06343263111696291, 0.7984361445561087, 0.39659123005300906], "isController": true}, {"data": ["2_Покупка с выбором из категории", 66, 0, 0.0, 8778.181818181818, 8358, 9915, 8703.0, 9183.0, 9478.25, 9915.0, 0.05621652561429331, 10.640275915871545, 1.402588339798234], "isController": true}, {"data": ["1_Регистрация", 8, 0, 0.0, 4346.25, 4287, 4459, 4324.0, 4459.0, 4459.0, 4459.0, 0.0075876851869415935, 1.2409922172875922, 0.11589003547242825], "isController": true}, {"data": ["open_homepage", 150, 0, 0.0, 2791.2466666666664, 2686, 4086, 2781.0, 2840.8, 2854.9, 3467.370000000011, 0.12502354610118238, 18.311515888877825, 0.8756531959352345], "isController": true}, {"data": ["login", 142, 0, 0.0, 432.12676056338023, 372, 675, 411.0, 515.0, 546.0, 661.2399999999998, 0.11923584934970279, 0.25012320469226657, 0.19361147360605316], "isController": true}, {"data": ["submit_payment", 74, 0, 0.0, 749.3243243243246, 699, 831, 749.0, 778.5, 801.25, 831.0, 0.06346500033876588, 0.1533977601357465, 0.22442820795207877], "isController": true}, {"data": ["add_to_cart", 108, 0, 0.0, 491.8425925925926, 427, 740, 472.5, 582.8000000000001, 596.2, 738.1099999999999, 0.09046135289978893, 0.07137229950874459, 0.06302814929054845], "isController": true}, {"data": ["open_register_page", 8, 0, 0.0, 306.625, 300, 325, 302.5, 325.0, 325.0, 325.0, 0.007616972900714662, 0.05152800344382387, 0.010852698693498723], "isController": true}, {"data": ["3_Быстрая покупка", 8, 0, 0.0, 8122.125000000001, 7800, 8460, 8028.5, 8460.0, 8460.0, 8460.0, 0.007319070295095766, 1.3538591442062695, 0.1730211421066114], "isController": true}, {"data": ["open_item_page", 107, 0, 0.0, 1322.5327102803735, 1246, 1406, 1321.0, 1367.2, 1383.0, 1405.1200000000001, 0.09030191220628671, 1.3581854951604082, 0.15880141143154694], "isController": true}, {"data": ["logout", 108, 0, 0.0, 198.06481481481484, 184, 225, 196.0, 211.10000000000002, 214.1, 224.36999999999998, 0.09267164633753931, 0.10398410316585222, 0.10185903720165951], "isController": true}, {"data": ["submit_register_data", 8, 0, 0.0, 593.0, 563, 633, 582.5, 633.0, 633.0, 633.0, 0.007614747099971159, 0.02445512468910415, 0.023268109058407965], "isController": true}, {"data": ["open_cart", 75, 0, 0.0, 484.90666666666664, 436, 711, 465.0, 574.0, 592.0, 711.0, 0.06262817900636637, 0.16200393132736665, 0.060092063945040845], "isController": true}, {"data": ["delete_order", 74, 0, 0.0, 210.20270270270262, 191, 240, 208.0, 226.0, 238.0, 240.0, 0.06349658534241392, 0.03843179093835083, 0.044810274991698255], "isController": true}, {"data": ["open_category_page", 100, 0, 0.0, 738.7400000000001, 706, 788, 736.5, 761.0, 770.0, 787.97, 0.08443499898255827, 0.38054623164488666, 0.11090339221830162], "isController": true}]}, function(index, item){
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
