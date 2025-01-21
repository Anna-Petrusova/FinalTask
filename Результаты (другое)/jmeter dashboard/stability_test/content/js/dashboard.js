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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5240561537413112, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "open_account"], "isController": true}, {"data": [0.0, 500, 1500, "5_Просмотр заказов"], "isController": true}, {"data": [0.0, 500, 1500, "6_Выбор без покупки"], "isController": true}, {"data": [1.0, 500, 1500, "open_order_list"], "isController": true}, {"data": [0.38722927557879017, 500, 1500, "open_payment_page"], "isController": true}, {"data": [0.0, 500, 1500, "2_Покупка с выбором из категории"], "isController": true}, {"data": [0.0, 500, 1500, "1_Регистрация"], "isController": true}, {"data": [0.0, 500, 1500, "open_homepage"], "isController": true}, {"data": [0.801916308173641, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "submit_payment"], "isController": true}, {"data": [0.6289324394017535, 500, 1500, "add_to_cart"], "isController": true}, {"data": [1.0, 500, 1500, "open_register_page"], "isController": true}, {"data": [0.0, 500, 1500, "3_Быстрая покупка"], "isController": true}, {"data": [0.49071686436307377, 500, 1500, "open_item_page"], "isController": true}, {"data": [1.0, 500, 1500, "logout"], "isController": true}, {"data": [0.5, 500, 1500, "submit_register_data"], "isController": true}, {"data": [0.7595220313666916, 500, 1500, "open_cart"], "isController": true}, {"data": [1.0, 500, 1500, "delete_order"], "isController": true}, {"data": [0.5, 500, 1500, "open_category_page"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 0, 0, NaN, NaN, 9223372036854775807, -9223372036854775808, NaN, NaN, NaN, NaN, 0.0, 0.0, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["open_account", 144, 0, 0.0, 754.1111111111112, 722, 798, 752.5, 772.5, 778.0, 793.5000000000001, 0.026961813646310062, 0.16982783009638663, 0.10215999701922172], "isController": true}, {"data": ["5_Просмотр заказов", 617, 0, 0.0, 4655.860615883311, 4313, 5750, 4668.0, 4847.0, 4928.2, 5053.740000000001, 0.11429477530239952, 17.91533879937599, 1.3799991344532616], "isController": true}, {"data": ["6_Выбор без покупки", 600, 0, 0.0, 5265.980000000004, 4897, 6870, 5215.5, 5533.0, 5635.549999999999, 5873.81, 0.11117437756708587, 18.34873153712057, 1.232095648771514], "isController": true}, {"data": ["open_order_list", 617, 0, 0.0, 304.95299837925467, 292, 316, 305.0, 311.0, 313.0, 315.0, 0.11457021129940817, 0.26830397086750635, 0.11847748113908786], "isController": true}, {"data": ["open_payment_page", 1339, 0, 0.0, 1429.1351755041085, 1217, 2094, 1422.0, 1587.0, 1682.0, 1827.3999999999992, 0.24810056688848722, 3.1593010701074022, 1.5500538608913648], "isController": true}, {"data": ["2_Покупка с выбором из категории", 1200, 0, 0.0, 9285.857499999993, 8361, 11421, 9265.0, 9924.9, 10330.8, 10852.82, 0.22203497272855446, 42.181316557295936, 5.537514093727715], "isController": true}, {"data": ["1_Регистрация", 143, 0, 0.0, 4564.81118881119, 4421, 4716, 4563.0, 4636.0, 4675.4, 4714.68, 0.026906823551636733, 4.403627682791412, 0.4109596878394517], "isController": true}, {"data": ["open_homepage", 2700, 0, 0.0, 2804.5462962962947, 2698, 4103, 2800.0, 2853.0, 2871.0, 2920.0, 0.5001280883604078, 73.30347996272702, 3.502850243868013], "isController": true}, {"data": ["login", 2557, 0, 0.0, 504.02385608134637, 359, 1021, 487.0, 646.2000000000003, 746.0999999999999, 842.4200000000001, 0.4735664013435433, 1.0018267370761007, 0.7689326376796617], "isController": true}, {"data": ["submit_payment", 1339, 0, 0.0, 791.8319641523535, 678, 1028, 808.0, 864.0, 884.0, 919.0, 0.24819484129153999, 0.5993164273381335, 0.8769673183094205], "isController": true}, {"data": ["add_to_cart", 1939, 0, 0.0, 565.1732851985557, 423, 1042, 527.0, 702.0, 775.0, 893.5999999999999, 0.3593085561762898, 0.2850047854145928, 0.25037823873394416], "isController": true}, {"data": ["open_register_page", 144, 0, 0.0, 299.50000000000006, 288, 336, 298.0, 306.5, 315.5, 329.70000000000016, 0.026964206700867518, 0.18241325331486535, 0.038418728102114955], "isController": true}, {"data": ["3_Быстрая покупка", 138, 0, 0.0, 8516.21739130435, 7747, 9837, 8489.0, 9180.3, 9433.649999999998, 9821.4, 0.026028881118366713, 4.834282060803184, 0.6150133619638452], "isController": true}, {"data": ["open_item_page", 1939, 0, 0.0, 1395.8844765342963, 1310, 1768, 1389.0, 1446.0, 1468.0, 1526.1999999999998, 0.3592442494055518, 5.514837876558007, 0.6317642936806918], "isController": true}, {"data": ["logout", 1956, 0, 0.0, 257.7239263803679, 182, 376, 289.0, 308.0, 315.0, 331.43000000000006, 0.3624678949065478, 0.4067144641090072, 0.3981713473854501], "isController": true}, {"data": ["submit_register_data", 144, 0, 0.0, 712.9375000000002, 672, 789, 709.0, 743.0, 765.0, 784.5000000000001, 0.02696211149282471, 0.08697427598070935, 0.08238715513774268], "isController": true}, {"data": ["open_cart", 1339, 0, 0.0, 541.3510082150866, 432, 1049, 499.0, 701.0, 756.0, 894.5999999999999, 0.2481241977425701, 0.6430080777837858, 0.23790234999465393], "isController": true}, {"data": ["delete_order", 1339, 0, 0.0, 216.53771471247205, 183, 343, 222.0, 238.0, 246.0, 282.1999999999998, 0.24811357709365053, 0.1497009724143656, 0.17489819804040305], "isController": true}, {"data": ["open_category_page", 1817, 0, 0.0, 778.2575674188226, 729, 1125, 775.0, 800.0, 811.0, 865.0999999999997, 0.3366822438565219, 1.537979808677582, 0.4422242363154511], "isController": true}]}, function(index, item){
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
